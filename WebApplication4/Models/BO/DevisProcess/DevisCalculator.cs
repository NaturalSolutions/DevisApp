using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO.DevisProcess
{
    public class DevisCalculator // Classe de calcul du devis a partir de l'objet general renvoyer par le controller Devis
    {
        private DevisFacturationEntities db;
        private DevisSumManager ResultSumManager;

        public bool checkIfRessourceIsFullAmo()
        {
            return true;
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

        private decimal? getDecimalPart(decimal? value) // Fonction d'arrondie au supérieur
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

        public DevisCalculator(GeneralObject myGeneralObject)
        {
            this.db = new DevisFacturationEntities();
            this.ResultSumManager = new DevisSumManager();
            foreach(Projet p in myGeneralObject.projets)
            {
                decimal? projectCost = 0;
                foreach(Stories_d s in p.Stories_d)
                {
                    decimal? StoriesCost = 0; // variale qui va définir le cout d'une story en fonction de ces taches
                    foreach(WebApplication4.Models.Tasks_d t in s.Tasks_d)
                    {
                        decimal? dailyValue = t.Duration != null ? Math.Round(Convert.ToDecimal(t.Duration / 7), 2) : 0; // conversion en jour
                        dailyValue = getDecimalPart(dailyValue); //Arrondie au supérieur

                        Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == t.Initials).FirstOrDefault(); // Recuperation de la ressource correspondante
                        Tarification_Ressource tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).FirstOrDefault(); // Identification de la tarification ressource
                        if(((s.Type.Trim(' ')).ToUpper()).Equals("AMO")) // si la story est typé AM O
                        {
                            Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification && myTar.IsAmo == true).OrderBy(o => o.Tar5).FirstOrDefault(); // On récupère la tarification IsAmo de la personne 
                            StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif tar 5 parce que il faut etre tar5 pour faire de l'amo donc aucun tarif tar3 possible 
                        }
                        else if(((s.Type.Trim(' ')).ToUpper()).Equals("DES")) // ou alors si la tache est typé DES
                        {
                            Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).FirstOrDefault(); // récupération de la tarification correspondant a la personne
                            if (ressourceTemp.Niveau == 5) // si la personne est bac+5 
                            {
                                StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif bac+5 
                            }
                            else // sinon elle est bac+3
                            {
                                StoriesCost += tarTemp.Tar3 * dailyValue; // Application du tarif bac+5 
                            }
                        }
                        else if (((s.Type.Trim(' ')).ToUpper()).Equals("DEV"))// ou si la tache est typé DEV
                        { //TO DO FOR TOMORROW PRENDRE EN COMPTE LES RESSOURCE FULL AMO 
                            if (checkIfRessourceIsFullAmo())
                            {
                                Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar5).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne
                            }
                            else
                            {
                                if(ressourceTemp.Niveau == 3)
                                {
                                    Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar3).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 3
                                    StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif bac+5 
                                }
                                else
                                {
                                    Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar5).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 5
                                    StoriesCost += tarTemp.Tar3 * dailyValue; // Application du tarif bac+3 
                                }
                            }
                        }
                        
                    }
                    projectCost += StoriesCost; // Ajout du cout de la stoy au cout du projet
                }
                ResultSumManager.setProjectCost(p.Nom, projectCost);
            }
        }
    }
}