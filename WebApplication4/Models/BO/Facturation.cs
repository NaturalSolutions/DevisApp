using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models;

namespace WebApplication4.Models.BO
{
    public class Facturation
    {
        public string initials { get; set; } // initials de la personne sur la facturation
        public decimal? value { get; set; } // ValeurNormal
        public decimal? valueWE { get; set; } // valeur weekend
        public decimal valueF { get; set; } // valeur jour férié
        public decimal sum { get; set; } // somme 
        private Devis_Entities db;

        public Facturation()
        {
            this.db = new Devis_Entities();
        }

        public void updateValue(bool isAmo)
        {
            Ressource res = db.Ressource.Include("Tarification_Ressource").Where(x => x.Initial == initials).FirstOrDefault(); // Recuperation de la personne correspondant aux initials 
            Tarification tar = new Tarification(); // creation d'un nouvel objet Tarification
            if (res != null) // Si l'objet n'est pas null
            {
                List<long> typeId = res.Tarification_Ressource.Select(x => x.FK_Tarification).ToList(); // Récupération des id's correspondant à la personne pointé par les initals
                if (!res.isFullAMO()) // si la personne n'est pas Full Amo
                {
                    tar = db.Tarification.Where(x => typeId.Contains(x.ID) && x.IsAmo == isAmo).FirstOrDefault(); // je récupère la tarification de la personne correspondant au bool Amo pris en param
                }
                //SI la personne n'as que des tarifs amo
                else
                {
                    if (isAmo)
                    {
                        //Si la tache est typé amo alors on prend la valeur tarifaire la plus cher
                        List<Tarification> lesTarifications = db.Tarification.Where(x => typeId.Contains(x.ID)).ToList(); // récuperation des differentes tarification correspondant a l'id de la personne
                        if (lesTarifications.Count > 1) // si il y en a plus d'une
                        {
                            if (res.Niveau == 3) // si le niveau de cette personne est bac+3 
                            {
                                tar = lesTarifications.Select(s => s).OrderByDescending(s => s.Tar3).FirstOrDefault(); // je prend la tarification la plus chère correspondant au niveau bac+ 3
                            }
                            else
                            {
                                tar = lesTarifications.Select(s => s).OrderByDescending(s => s.Tar5).FirstOrDefault(); // je prend la tarification la plus chère correspondant au niveau bac+ 5
                            }
                        }
                        else
                        {
                            tar = lesTarifications.FirstOrDefault();
                        }
                    }
                    else // Sinon si la tache n'est pas typé amo
                    {
                        List<Tarification> tars = db.Tarification.Where(x => typeId.Contains(x.ID)).ToList(); // je recupère les tartification correspondant à la personne
                        if (tars.Count > 1) // si il y a plus d'ue tarification 
                        {
                            if (res.Niveau == 3) // si niveaux personne => b + 3
                            {
                                tar = tars.Select(s => s).OrderBy(s => s.Tar3).FirstOrDefault(); // première tarification ordonnée a partir de tarification de niveaux 3
                            }
                            else // sinon si niveaux personne => b + 5
                            {
                                tar = tars.Select(s => s).OrderBy(s => s.Tar5).FirstOrDefault(); // première tarification ordonnée a partir de tarification de niveaux 5
                            }
                        }
                        else // sinon 
                        {
                            tar = tars.FirstOrDefault(); // je prend la seul qui est dispo
                        }
                    }
                }

                decimal dailyValue = this.value != null ? Math.Round(Convert.ToDecimal(this.value / 7), 2) : 0; // conversion en jour
                decimal dailyValueWE = this.valueWE != null ? Math.Round(Convert.ToDecimal(this.valueWE / 7), 2) : 0; // conversion en jour
                decimal dailyValueF = this.valueF != null ? Math.Round(Convert.ToDecimal(this.valueF / 7), 2) : 0; // conversion en jour
                dailyValue = getDecimalPart(dailyValue); //Arrondie au supérieur
                dailyValueWE = getDecimalPart(dailyValueWE); //Arrondie au supérieur
                dailyValueF = getDecimalPart(dailyValueF); //Arrondie au supérieur
                this.value = Math.Round(dailyValue * (res.Niveau == 3 ? (decimal)tar.Tar3 : (decimal)tar.Tar5), 2); // je prend la valeur en fonction de son niveau
                if (this.valueWE != null)
                {
                    this.valueWE = Math.Round(dailyValueWE * (res.Niveau == 3 ? (decimal)tar.Tar3 : (decimal)tar.Tar5), 2) * 1.5m; // si la personne a travailler le weekend j'applique le tarif weekend
                }
                else
                {
                    this.valueWE = 0; // Tarif weekend = 0
                }
                if (this.valueF != null)
                {
                    this.valueF = Math.Round(dailyValueF * (res.Niveau == 3 ? (decimal)tar.Tar3 : (decimal)tar.Tar5), 2) * 2m; // si la personne a travailler un jour férié j'applique le tarif férié 
                }
                else
                {
                    this.valueF = 0; // Tarif férié = 0
                }
                this.sum = Convert.ToDecimal(this.value + this.valueWE + this.valueF); //j'applique la somme de tout les tarifs pour la personne
            }
        }


        private decimal getDecimalPart(decimal value)
        {
            string strValue = value.ToString();
            string[] tabValues;
            if (strValue.IndexOf('.') != -1)
            {
                tabValues = strValue.Split('.');
            }
            else if (strValue.IndexOf(',') != -1)
            {
                tabValues = strValue.Split(',');
            }
            else
            {
                return value;
            }
            if (tabValues.Length > 1)
            {
                tabValues[1] = setHalfDays(Convert.ToInt32(tabValues[1]));
                if (tabValues[1] != "1")
                {
                    return Convert.ToDecimal(String.Join(",", tabValues));
                }
                else
                {
                    return Convert.ToDecimal(tabValues[0]) + 1;
                }
            }
            else
            {
                return Convert.ToDecimal(tabValues[0]);
            }

        }

        private string setHalfDays(int value)
        {
            if (value.ToString().Length < 2)
            {
                if (value == 0)
                {
                    return "00";
                }
                else if (value <= 5)
                {
                    return "50";
                }
                else
                {
                    return "1";
                }
            }
            else
            {
                if (value == 0)
                {
                    return "00";
                }
                else if (value <= 50)
                {
                    return "50";
                }
                else
                {
                    return "1";
                }
            }
        }
    }
}