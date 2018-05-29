using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace WebApplication4.Models.BO.DevisProcess
{
    public class DevisCalculator // Classe de calcul du devis a partir de l'objet general renvoyer par le controller Devis
    {
        private DevisFacturationEntities db;
        private DevisSumManager ResultSumManager;
        private GeneralObject genObject;

        public bool checkIfRessourceIsFullAmo(string initialRessource)
        {
            Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == initialRessource).FirstOrDefault(); // Recuperation de la ressource correspondante
            List<long> tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).Select(o => o.FK_Tarification).ToList(); // Identification de la tarification ressource
            List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).ToList(); // On récupère la liste des tarifications IsAmo de la personne 
            foreach(Tarification tar in tarTemp)
            {
                if (!(bool)tar.IsAmo)
                {
                    return false;
                }
            }           
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
            this.genObject = myGeneralObject;
        }

        public DevisSumManager CalculateDevis()
        {
            StreamWriter file = new StreamWriter(@"C:\Users\Tom\Desktop\Remi_projet_web\webApi_natural_solutions\WebApplication4\Content\calcul\CalculDevis.txt");
            foreach (Projet p in this.genObject.projets)
            {
                file.WriteLine(p.Nom+'\n'+'\r');
                if (p.Nom.ToLower() == "reneco apps")
                {
                    var test = "tst";
                }
                decimal? projectCost = 0;
                foreach (MasterStories s in p.Stories)
                {
                    file.WriteLine('\t' + s.Description + '\n' + '\r');
                    decimal? StoriesCost = 0; // variale qui va définir le cout d'une story en fonction de ces taches
                    foreach (MasterTasks t in s.Tasks)
                    {

                        file.WriteLine(t.Description + '\n' + '\r');
                        if (t.Duration.IndexOf('+') != -1 && t.Initials.IndexOf('+') != -1)
                        {
                            t.isMultiProgramming = true;
                        }
                        if( t.isMultiProgramming == true) // c'est une tache de N programming
                        {
                            string[] Initiales = t.Initials.Split('+');
                            string[] Durations = t.Duration.Split('+');
                            for(int i = 0; i < Durations.Length; i++)
                            {
                                string tempDuration = Durations[i];
                                string tempInitial = Initiales[i];
                                decimal? dailyValue = tempDuration != null ? Math.Round(Convert.ToDecimal(decimal.Parse(tempDuration) / 7), 2) : 0; // conversion en jour
                                dailyValue = getDecimalPart(dailyValue); //Arrondie au supérieur
                                Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == tempInitial).FirstOrDefault(); // Recuperation de la ressource correspondante
                                List<long> tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).Select(z => z.FK_Tarification).ToList(); // Identification de la tarification ressource
                                if (((s.Type.Trim(' ')).ToUpper()).Equals("AMO")) // si la story est typé AMO
                                {
                                    if (checkIfRessourceIsFullAmo(tempInitial))
                                    {
                                        List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(tar => tar.Tar5).ToList();
                                        Tarification tarif = tarTemp.OrderByDescending(o => o.Tar5).FirstOrDefault();
                                        StoriesCost += tarif.Tar5 * dailyValue;
                                        file.WriteLine(tempInitial + "  |  " + tempDuration + "   |   " + dailyValue + " x " + tarif.Tar5 + " = " + dailyValue * tarif.Tar5 + '\n' + '\r');
                                        file.WriteLine('\n');
                                    }
                                    else
                                    {
                                        Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == true).OrderBy(o => o.Tar5).FirstOrDefault(); // On récupère la tarification IsAmo de la personne 
                                        StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif tar 5 parce que il faut etre tar5 pour faire de l'amo donc aucun tarif tar3 possible 
                                        file.WriteLine(tempInitial + "  |  " + tempDuration + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                                        file.WriteLine('\n');
                                    }
                                }
                                else if (((s.Type.Trim(' ')).ToUpper()).Equals("DES")) // ou alors si la tache est typé DES
                                {
                                    if (checkIfRessourceIsFullAmo(tempInitial))
                                    {
                                        List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(tar => tar.Tar5).ToList();
                                        Tarification tarif = tarTemp.OrderByDescending(o => o.Tar5).FirstOrDefault();
                                        StoriesCost += tarif.Tar5 * dailyValue;
                                        file.WriteLine( tempInitial + "  |  " + tempDuration + "   |   " + dailyValue + " x " + tarif.Tar5 + " = " + dailyValue * tarif.Tar5 + '\n' + '\r');
                                        file.WriteLine('\n');
                                    }
                                    else
                                    {
                                        Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == false).FirstOrDefault(); // récupération de la tarification correspondant a la personne
                                        if (ressourceTemp.Niveau == 5) // si la personne est bac+5 
                                        {
                                            StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif bac+5 
                                            file.WriteLine( tempInitial + "  |  " + tempDuration + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                                            file.WriteLine('\n');
                                        }
                                        else // sinon elle est bac+3
                                        {
                                            StoriesCost += tarTemp.Tar3 * dailyValue; // Application du tarif bac+5 
                                            file.WriteLine( tempInitial + "  |  " + tempDuration + "   |   " + dailyValue + " x " + tarTemp.Tar3 + " = " + dailyValue * tarTemp.Tar3 + '\n' + '\r');
                                            file.WriteLine('\n');
                                        }
                                    }    
                                }
                                else if (((s.Type.Trim(' ')).ToUpper()).Equals("DEV"))// ou si la tache est typé DEV
                                {
                                    if (checkIfRessourceIsFullAmo(tempInitial))
                                    {
                                        List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(tar => tar.Tar5).ToList();
                                        Tarification tarif = tarTemp.OrderBy(o => o.Tar5).FirstOrDefault();
                                        StoriesCost += tarif.Tar5 * dailyValue;
                                        file.WriteLine( t.Description + " |  " + tempInitial + "  |  " + tempDuration + "   |   " + dailyValue + " x " + tarif.Tar3 + " = " + dailyValue * tarif.Tar3 + '\n' + '\r');
                                        file.WriteLine('\n');
                                    }
                                    else
                                    {
                                        if (ressourceTemp.Niveau == 3)
                                        {
                                            Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == false).OrderBy(tar => tar.Tar3).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 3
                                            StoriesCost += tarTemp.Tar3 * dailyValue; // Application du tarif bac+5 
                                            file.WriteLine( tempInitial + "  |  " + tempDuration + "   |   " + dailyValue + " x " + tarTemp.Tar3 + " = " + dailyValue * tarTemp.Tar3 + '\n' + '\r');
                                            file.WriteLine('\n');
                                        }
                                        else
                                        {
                                            Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == false).OrderBy(tar => tar.Tar5).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 5
                                            StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif bac+3 
                                            file.WriteLine( tempInitial + "  |  " + tempDuration + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                                            file.WriteLine('\n');
                                        }
                                    }
                                }
                            }
                        }
                        else // c'est pas une tache de N programming
                        {
                            decimal? dailyValue = t.Duration != null ? Math.Round(Convert.ToDecimal(decimal.Parse(t.Duration) / 7), 2) : 0; // conversion en jour
                            dailyValue = getDecimalPart(dailyValue); //Arrondie au supérieur

                            Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == t.Initials).FirstOrDefault(); // Recuperation de la ressource correspondante
                            List<long> tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).Select(z => z.FK_Tarification).ToList(); // Identification de la tarification ressource

                            //Tarification_Ressource tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).FirstOrDefault(); // Identification de la tarification ressource
                            if (((s.Type.Trim(' ')).ToUpper()).Equals("AMO")) // si la story est typé AMO
                            {
                                if (checkIfRessourceIsFullAmo(ressourceTemp.Initial))
                                {
                                    List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(tar => tar.Tar5).ToList();
                                    Tarification tarif = tarTemp.OrderByDescending(o => o.Tar5).FirstOrDefault();
                                    StoriesCost += tarif.Tar5 * dailyValue;
                                    file.WriteLine(  t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + tarif.Tar5 + " = " + dailyValue * tarif.Tar5 + '\n' + '\r');
                                    file.WriteLine('\n');
                                }
                                else
                                {
                                    Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == true).OrderBy(o => o.Tar5).FirstOrDefault(); // On récupère la tarification IsAmo de la personne 
                                    if (tarTemp == null)
                                    {
                                        if (ressourceTemp.Niveau == 5)
                                        {
                                            List<Tarification> AMOTarif = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(o => o.Tar5).ToList(); // On récupère la tarification IsAmo de la personne 
                                                                                                                                                                        //TODO tester si au mloins une tar est amo, sinon prendre la plus chere non amo OK
                                            Tarification leTarif = new Tarification();
                                            bool amoExist = false;
                                            foreach (Tarification tarif in AMOTarif)
                                            {
                                                if ((bool)tarif.IsAmo)
                                                {
                                                    leTarif = tarif;
                                                    amoExist = true;
                                                }

                                            }
                                            if (amoExist == false)
                                            {
                                                leTarif = AMOTarif.OrderBy(o => o.Tar5).FirstOrDefault();
                                            }
                                            StoriesCost += leTarif.Tar5 * dailyValue; // Application du tarif tar 5 parce que il faut etre tar5 pour faire de l'amo donc aucun tarif tar3 possible 
                                            file.WriteLine(  t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + leTarif.Tar5 + " = " + dailyValue * leTarif.Tar5 + '\n' + '\r');
                                            file.WriteLine('\n');
                                        }
                                        else
                                        {
                                            List<Tarification> AMOtarif = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(o => o.Tar3).ToList(); // On récupère la tarification IsAmo de la personne 
                                            Tarification letarif = new Tarification();
                                            bool amoExist = false;
                                            foreach (Tarification tarif in AMOtarif)
                                            {
                                                if ((bool)tarif.IsAmo)
                                                {
                                                    letarif = tarif;
                                                    amoExist = true;
                                                }
                                            }
                                            if (amoExist == false)
                                            {
                                                letarif = AMOtarif.OrderBy(o => o.Tar3).FirstOrDefault();
                                            }
                                            //TODO tester si au mloins une tar est amo, sinon prendre la plus chere non amo OK
                                            StoriesCost += letarif.Tar3 * dailyValue; // Application du tarif tar 5 parce que il faut etre tar5 pour faire de l'amo donc aucun tarif tar3 possible 
                                            file.WriteLine( t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + letarif.Tar3 + " = " + dailyValue * letarif.Tar3 + '\n' + '\r');
                                            file.WriteLine('\n');
                                        }

                                    }
                                }
                            }
                            else if (((s.Type.Trim(' ')).ToUpper()).Equals("DES")) // ou alors si la tache est typé DES
                            {
                                if (checkIfRessourceIsFullAmo(t.Initials))
                                {
                                    List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(tar => tar.Tar5).ToList();
                                    Tarification tarif = tarTemp.OrderBy(o => o.Tar5).FirstOrDefault();
                                    StoriesCost += tarif.Tar5 * dailyValue;
                                    file.WriteLine(  t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + tarif.Tar5 + " = " + dailyValue * tarif.Tar5 + '\n' + '\r');
                                    file.WriteLine('\n');
                                }
                                else
                                {
                                    Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).FirstOrDefault(); // récupération de la tarification correspondant a la personne
                                    if (ressourceTemp.Niveau == 5) // si la personne est bac+5 
                                    {
                                        StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif bac+5 
                                        file.WriteLine(  t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                                        file.WriteLine('\n');
                                    }
                                    else // sinon elle est bac+3
                                    {
                                        StoriesCost += tarTemp.Tar3 * dailyValue; // Application du tarif bac+5 
                                        file.WriteLine( t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                                        file.WriteLine('\n');
                                    }
                                }
                            }
                            else if (((s.Type.Trim(' ')).ToUpper()).Equals("DEV"))// ou si la tache est typé DEV
                            { //TO DO FOR TOMORROW PRENDRE EN COMPTE LES RESSOURCE FULL AMO 
                                if (checkIfRessourceIsFullAmo(t.Initials))
                                {
                                    List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(tar => tar.Tar5).ToList();
                                    Tarification tarif = tarTemp.OrderBy(o => o.Tar5).FirstOrDefault();
                                    StoriesCost += tarif.Tar5 * dailyValue;
                                    file.WriteLine( t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + tarif.Tar5 + " = " + dailyValue * tarif.Tar5 + '\n' + '\r');
                                    file.WriteLine('\n');
                                }
                                else
                                {
                                    if (ressourceTemp.Niveau == 3)
                                    {
                                        Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == false).OrderBy(tar => tar.Tar3).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 3
                                        StoriesCost += tarTemp.Tar3 * dailyValue; // Application du tarif bac+5 
                                        file.WriteLine( t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                                        file.WriteLine('\n');
                                    }
                                    else
                                    {
                                        Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == false).OrderBy(tar => tar.Tar5).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 5
                                        StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif bac+3 
                                        file.WriteLine( t.Initials + "  |  " + t.Duration + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                                        file.WriteLine('\n');
                                    }
                                }
                            }

                        }
                    }
                    file.WriteLine('\r');
                    projectCost += StoriesCost; // Ajout du cout de la stoy au cout du projet
                }
                file.WriteLine('\r');
                ResultSumManager.setProjectCost(p.Nom, projectCost);
            }
            file.WriteLine('\r');
            file.Close();
            return this.ResultSumManager;
        }
    }
}