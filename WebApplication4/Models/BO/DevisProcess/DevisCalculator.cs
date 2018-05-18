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
        private GeneralObject genObject;

        public bool checkIfRessourceIsFullAmo(string initialRessource)
        {
            Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == initialRessource).FirstOrDefault(); // Recuperation de la ressource correspondante
            Tarification_Ressource tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).FirstOrDefault(); // Identification de la tarification ressource
            List<Tarification> tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification && myTar.IsAmo == true).OrderBy(o => o.Tar5).ToList(); // On récupère la liste des tarifications IsAmo de la personne 
            if (tarTemp.Count >= 2) // si il y a deux tarification AMO la personn est full AMO
            {
                return true;
            }
            else
            {
                return false;
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

            foreach (Projet p in this.genObject.projets)
            {
                decimal? projectCost = 0;
                foreach (MasterStories s in p.Stories)
                {
                    decimal? StoriesCost = 0; // variale qui va définir le cout d'une story en fonction de ces taches
                    foreach (MasterTasks t in s.Tasks)
                    {
                        if(t.Duration.IndexOf('+') != -1 && t.Initials.IndexOf('+') != -1)
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
                                Tarification_Ressource tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).FirstOrDefault(); // Identification de la tarification ressource
                                if (((s.Type.Trim(' ')).ToUpper()).Equals("AMO")) // si la story est typé AM O
                                {
                                    Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification && myTar.IsAmo == true).OrderBy(o => o.Tar5).FirstOrDefault(); // On récupère la tarification IsAmo de la personne 
                                    StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif tar 5 parce que il faut etre tar5 pour faire de l'amo donc aucun tarif tar3 possible 
                                }
                                else if (((s.Type.Trim(' ')).ToUpper()).Equals("DES")) // ou alors si la tache est typé DES
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
                                    if (checkIfRessourceIsFullAmo(tempInitial))
                                    {
                                        List<Tarification> tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar5).ToList();
                                        tarTemp.Sort();
                                    }
                                    else
                                    {
                                        if (ressourceTemp.Niveau == 3)
                                        {
                                            Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar3).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 3
                                            StoriesCost += tarTemp.Tar3 * dailyValue; // Application du tarif bac+5 
                                        }
                                        else
                                        {
                                            Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar5).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 5
                                            StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif bac+3 
                                        }
                                    }
                                }
                            }
                        }
                        else // c'est pas une tache de N programming
                        {
                            decimal? dailyValue = t.Duration != null ? Math.Round(Convert.ToDecimal(int.Parse(t.Duration) / 7), 2) : 0; // conversion en jour
                            dailyValue = getDecimalPart(dailyValue); //Arrondie au supérieur

                            Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == t.Initials).FirstOrDefault(); // Recuperation de la ressource correspondante
                            Tarification_Ressource tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).FirstOrDefault(); // Identification de la tarification ressource
                            if (((s.Type.Trim(' ')).ToUpper()).Equals("AMO")) // si la story est typé AM O
                            {
                                Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification && myTar.IsAmo == true).OrderBy(o => o.Tar5).FirstOrDefault(); // On récupère la tarification IsAmo de la personne 
                                StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif tar 5 parce que il faut etre tar5 pour faire de l'amo donc aucun tarif tar3 possible 
                            }
                            else if (((s.Type.Trim(' ')).ToUpper()).Equals("DES")) // ou alors si la tache est typé DES
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
                                if (checkIfRessourceIsFullAmo(t.Initials))
                                {
                                    List<Tarification> tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar5).ToList();
                                    tarTemp.Sort();
                                }
                                else
                                {
                                    if (ressourceTemp.Niveau == 3)
                                    {
                                        Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar3).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 3
                                        StoriesCost += tarTemp.Tar3 * dailyValue; // Application du tarif bac+5 
                                    }
                                    else
                                    {
                                        Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar5).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 5
                                        StoriesCost += tarTemp.Tar5 * dailyValue; // Application du tarif bac+3 
                                    }
                                }
                            }

                        }
                    }
                    projectCost += StoriesCost; // Ajout du cout de la stoy au cout du projet
                }
                ResultSumManager.setProjectCost(p.Nom, projectCost);
            }
            return this.ResultSumManager;
        }
    }
}