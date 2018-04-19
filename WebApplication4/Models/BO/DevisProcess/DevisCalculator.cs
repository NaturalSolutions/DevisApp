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
                        Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == t.Initials).FirstOrDefault(); // Recuperation de la ressource correspondante
                        Tarification_Ressource tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).FirstOrDefault(); // Identification de la tarification ressource
                        if(((s.Type.Trim(' ')).ToUpper()).Equals("AMO")) // si la story est typé AMO
                        {
                            Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification && myTar.IsAmo == true).FirstOrDefault(); // On récupère la tarification IsAmo de la personne 
                            StoriesCost += tarTemp.Tar5 * t.Duration; // Application du tarif tar 5 parce que il faut etre tar5 pour faire de l'amo donc aucun tarif tar3 possible 
                        }
                        else if(((s.Type.Trim(' ')).ToUpper()).Equals("DES")) // ou alors si la tache est typé DES
                        {
                            Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).FirstOrDefault(); // récupération de la tarification correspondant a la personne
                            if (ressourceTemp.Niveau == 5) // si la personne est bac+5 
                            {
                                StoriesCost += tarTemp.Tar5 * t.Duration; // Application du tarif bac+5 
                            }
                            else // sinon elle est bac+3
                            {
                                StoriesCost += tarTemp.Tar3 * t.Duration; // Application du tarif bac+5 
                            }
                        }
                        else if (((s.Type.Trim(' ')).ToUpper()).Equals("DEV"))// ou si la tache est typé DEV
                        {
                            if (ressourceTemp.Niveau == 5)
                            {
                                Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar5).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne
                                StoriesCost += tarTemp.Tar5 * t.Duration; // Application du tarif bac+5 
                            }
                            else
                            {
                                Tarification tarTemp = db.Tarification.Where(myTar => myTar.ID == tarRessTemp.FK_Tarification).OrderBy(tar => tar.Tar3).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne
                                StoriesCost += tarTemp.Tar3 * t.Duration; // Application du tarif bac+5 
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