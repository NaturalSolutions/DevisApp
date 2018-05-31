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
        private StreamWriter logFile;

        public bool checkIfRessourceIsFullAmo(string initialRessource)
        {
            Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == initialRessource).FirstOrDefault(); // Recuperation de la ressource correspondante
            List<long> tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).Select(o => o.FK_Tarification).ToList(); // Identification de la tarification ressource
            List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).ToList(); // On récupère la liste des tarifications IsAmo de la personne 
            foreach (Tarification tar in tarTemp)
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
            DateTime longDate = DateTime.Now;
            Directory.CreateDirectory(@"C: \Users\Tom\Desktop\Remi_projet_web\webApi_natural_solutions\WebApplication4\Content\Devis" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month);
            this.logFile = new StreamWriter(@"C:\Users\Tom\Desktop\Remi_projet_web\webApi_natural_solutions\WebApplication4\Content\Devis"+ longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month+ @"\Calcul.txt");
        }

        public DevisSumManager CalculateDevis()
        {
            foreach (Projet p in this.genObject.projets)
            {
                this.logFile.WriteLine(p.Nom + '\n' + '\r');
                if (p.Nom.ToLower() == "ecollection")
                {
                    var test = "tst";
                }
                decimal? projectCost = 0;
                //Dictionary<string, decimal> StoriesTasksInfoDic = new Dictionary<string, decimal>();
                Dictionary<string, Dictionary<string, decimal>> truc = new Dictionary<string, Dictionary<string, decimal>>();
                truc.Add("AMO", new Dictionary<string, decimal>());
                truc.Add("DES", new Dictionary<string, decimal>());
                truc.Add("DEV", new Dictionary<string, decimal>());
                foreach (MasterStories s in p.Stories)
                {              
                 this.logFile.WriteLine('\t' + s.Description + "    |  type : (" + s.Type + ")" + '\n' + '\r');
                    decimal? StoriesCost = 0; // variale qui va définir le cout d'une story en fonction de ces taches
                    foreach (MasterTasks t in s.Tasks)
                    {
                        string dicSelector = s.Type.ToUpper();                
                        this.logFile.WriteLine(t.Description + '\n' + '\r');
                        if (t.Duration.IndexOf('+') != -1 && t.Initials.IndexOf('+') != -1)
                        {
                            t.isMultiProgramming = true;
                        }
                        if (t.isMultiProgramming == true) // c'est une tache de N programming
                        {
                            string[] Initiales = t.Initials.Split('+');
                            string[] Durations = t.Duration.Split('+');
                            for (int i = 0; i < Durations.Length; i++)
                            {
                                string tempDuration = Durations[i];
                                string tempInitial = Initiales[i];
                                //decimal? dailyValue = tempDuration != null ? Math.Round(Convert.ToDecimal(decimal.Parse(tempDuration) / 7), 2) : 0; // conversion en jour
                                //dailyValue = getDecimalPart(dailyValue); //Arrondie au supérieur
                                //Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == tempInitial).FirstOrDefault(); // Recuperation de la ressource correspondante
                                //List<long> tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).Select(z => z.FK_Tarification).ToList(); // Identification de la tarification ressource
                                if (truc[dicSelector].Where(o => o.Key == tempInitial).Count() > 0)
                                {
                                    truc[dicSelector][tempInitial] += decimal.Parse(tempDuration);
                                   // StoriesTasksInfoDic[tempInitial] += decimal.Parse(tempDuration);//La valeur a ajouter en heure;
                                }
                                else
                                {
                                    truc[dicSelector].Add(tempInitial, decimal.Parse(tempDuration));
                                    //StoriesTasksInfoDic.Add(tempInitial, decimal.Parse(tempDuration));
                                }
                            }
                        }
                        else //c'est pas une tache de N programming
                        {
                            //decimal? dailyValue = t.Duration != null ? Math.Round(Convert.ToDecimal(decimal.Parse(t.Duration) / 7), 2) : 0; // conversion en jour
                            //dailyValue = getDecimalPart(dailyValue); //Arrondie au supérieur
                            //Tarification_Ressource tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).FirstOrDefault(); // Identification de la tarification ressource                     
                            //Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == t.Initials).FirstOrDefault(); // Recuperation de la ressource correspondante
                            //List<long> tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).Select(z => z.FK_Tarification).ToList(); // Identification de la tarification ressource
                            if (truc[dicSelector].Where(o => o.Key == t.Initials).Count() > 0)
                            {
                                truc[dicSelector][t.Initials] += decimal.Parse(t.Duration);
                            }
                            else
                            {
                                truc[dicSelector].Add(t.Initials, decimal.Parse(t.Duration));
                            }
                        }
                    }
                   this.logFile.WriteLine('\r');
                }
                this.logFile.WriteLine('\r');
                projectCost += calculateStoriesCost(truc); // Ajout du cout de la stoy au cout du projet
                ResultSumManager.setProjectCost(p.Nom, projectCost);
            }
            this.logFile.WriteLine('\r');
            this.logFile.Close();
            return this.ResultSumManager;
        }




        public decimal calculateStoriesCost(Dictionary<string, Dictionary<string, decimal>> myDic)
        {
            decimal storycost = 0;
            foreach (KeyValuePair<string, Dictionary<string, decimal>> entry in myDic)
            {
                foreach(KeyValuePair<string,decimal> entryT in entry.Value)
                {
                    Ressource ressourceTemp = db.Ressource.Where(ressource => ressource.Initial == entryT.Key).FirstOrDefault(); // Recuperation de la ressource correspondante
                    //List<long> tarRessTemp = db.Tarification_Ressource.Where(tarRess => tarRess.FK_Ressource == ressourceTemp.ID).Select(z => z.FK_Tarification).ToList(); // Identification de la tarification ressource
                    decimal? dailyValue = entry.Value != null ? Math.Round(Convert.ToDecimal(entryT.Value / 7), 2) : 0; // conversion en jour
                    dailyValue = getDecimalPart(dailyValue); //Arrondie au supérieur      
                    decimal resFact = ressourceTemp.getCurrentTarification(entry.Key);
                    storycost += resFact * (decimal)dailyValue;
                    //this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + resFact + " = " + dailyValue * resFact + '\n' + '\r');
                    //this.logFile.WriteLine('\n');
                }
                
                //if (((storyType.Trim(' ')).ToUpper()).Equals("AMO")) // si la story est typé AMO
                //{
                //    if (checkIfRessourceIsFullAmo(ressourceTemp.Initial))
                //    {
                //        Tarification tarif = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderByDescending(tar => tar.Tar5).FirstOrDefault();
                //        //Tarification tarif = tarTemp.OrderByDescending(o => o.Tar5).FirstOrDefault();
                //        storiecost += tarif.Tar5 * (decimal)dailyValue;
                //        this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + tarif.Tar5 + " = " + dailyValue * tarif.Tar5 + '\n' + '\r');
                //        this.logFile.WriteLine('\n');
                //    }
                //    else
                //    {
                //        if (ressourceTemp.hasAmo())
                //        {
                //            Tarification_Ressource tarAmo = db.Tarification_Ressource.Where(o => o.Tarification.IsAmo == true && o.FK_Ressource == ressourceTemp.ID)
                //            Tarification tarAmo = db.Tarification.Where(o => o.Tarification_Ressource)
                //        }
                //        else
                //        {

                //        }
                //        ///Tarification de base AMO -> niveau 5 pour tout le monde
                //        List<Tarification> AMOTarif = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(o => o.Tar5).ToList();
                //        Tarification leTarif = new Tarification();
                //        bool amoExist = false;
                //        foreach (Tarification tarif in AMOTarif)
                //        {
                //            if ((bool)tarif.IsAmo)
                //            {
                //                leTarif = tarif;
                //                amoExist = true;
                //            }

                //        }
                //        if (amoExist == false)
                //        {
                //            leTarif = AMOTarif.OrderBy(o => o.Tar5).FirstOrDefault();
                //        }
                //        storiecost += leTarif.Tar5 * (decimal)dailyValue; // Application du tarif tar 5 parce que il faut etre tar5 pour faire de l'amo donc aucun tarif tar3 possible 
                //        this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + leTarif.Tar5 + " = " + dailyValue * leTarif.Tar5 + '\n' + '\r');
                //        this.logFile.WriteLine('\n');

                //    }
                //}
                //else if (((storyType.Trim(' ')).ToUpper()).Equals("DES")) // ou alors si la tache est typé DES
                //{
                //    if (checkIfRessourceIsFullAmo(entry.Key))
                //    {
                //        List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(tar => tar.Tar5).ToList();
                //        Tarification tarif = tarTemp.OrderByDescending(o => o.Tar5).FirstOrDefault();
                //        storiecost += tarif.Tar5 * (decimal)dailyValue;
                //        this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + tarif.Tar5 + " = " + dailyValue * tarif.Tar5 + '\n' + '\r');
                //        this.logFile.WriteLine('\n');
                //    }
                //    else
                //    {
                //        Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == false).FirstOrDefault(); // récupération de la tarification correspondant a la personne
                //        if (ressourceTemp.Niveau == 5) // si la personne est bac+5 
                //        {
                //            storiecost += tarTemp.Tar5 * (decimal)dailyValue; // Application du tarif bac+5 
                //            this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                //            this.logFile.WriteLine('\n');
                //        }
                //        else // sinon elle est bac+3
                //        {
                //            storiecost += (decimal)tarTemp.Tar3 * (decimal)dailyValue; // Application du tarif bac+5 
                //            this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + tarTemp.Tar3 + " = " + dailyValue * tarTemp.Tar3 + '\n' + '\r');
                //            this.logFile.WriteLine('\n');
                //        }
                //    }
                //}
                //else if (((storyType.Trim(' ')).ToUpper()).Equals("DEV"))// ou si la tache est typé DEV
                //{
                //    if (checkIfRessourceIsFullAmo(entry.Key))
                //    {
                //        List<Tarification> tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID)).OrderBy(tar => tar.Tar5).ToList();
                //        Tarification tarif = tarTemp.OrderBy(o => o.Tar5).FirstOrDefault();
                //        storiecost += tarif.Tar5 * (decimal)dailyValue;
                //        this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + tarif.Tar5 + " = " + dailyValue * tarif.Tar5 + '\n' + '\r');
                //        this.logFile.WriteLine('\n');
                //    }
                //    else
                //    {
                //        if (ressourceTemp.Niveau == 3)
                //        {
                //            Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == false).OrderBy(tar => tar.Tar3).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 3
                //            storiecost += (decimal)tarTemp.Tar3 * (decimal)dailyValue; // Application du tarif bac+5 
                //            this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + tarTemp.Tar3 + " = " + dailyValue * tarTemp.Tar3 + '\n' + '\r');
                //            this.logFile.WriteLine('\n');
                //        }
                //        else
                //        {
                //            Tarification tarTemp = db.Tarification.Where(myTar => tarRessTemp.Contains(myTar.ID) && myTar.IsAmo == false).OrderBy(tar => tar.Tar5).FirstOrDefault(); // Enfin récuperation de la tarification correspondant a la personne niveau 5
                //            storiecost += tarTemp.Tar5 * (decimal)dailyValue; // Application du tarif bac+3 
                //            this.logFile.WriteLine(entry.Key + "  |  " + entry.Value + "   |   " + dailyValue + " x " + tarTemp.Tar5 + " = " + dailyValue * tarTemp.Tar5 + '\n' + '\r');
                //            this.logFile.WriteLine('\n');
                //        }
                //    }
                //}
            }
            return storycost;
        }


    }
}