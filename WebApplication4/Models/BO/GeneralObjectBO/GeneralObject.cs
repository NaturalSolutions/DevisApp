using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class GeneralObject
    {
        public List<Projet> projets {get; set;}
        public decimal JourDT;
        public decimal jourCdp;
        public string epic;

        public decimal getJourDT()
        {
            return this.JourDT;
        }

        public decimal getJourCdp()
        {
            return this.jourCdp;
        }

        public Boolean verifyProjectExist(Projet p)
        {
            DevisFacturationEntities db = new DevisFacturationEntities();
            List<Projet> projets = db.Projet.ToList();
            foreach (Projet myProject in projets)
            {
                if(myProject.Nom.Trim().ToLower() == p.Nom.Trim().ToLower())
                {
                    return true;
                }
            }
            return false;
        }

        public void SaveToDb(bool isFactu,dynamic fichier)
        {
            DevisFacturationEntities db = new DevisFacturationEntities();
            if (!isFactu)
            {
                fichier = (Devis)fichier;
            }else
            {
                fichier = (Facturation)fichier;
            }
            switch (isFactu)
            {
                case false:
                    foreach (Projet p in this.projets)
                    {
                        if (!this.verifyProjectExist(p))
                        {
                            p.save();
                        }                        
                        foreach (MasterStories s in p.Stories)
                        {
                            Stories_d stories_d = new Stories_d(s);
                            Stories_Devis stories_Devis = new Stories_Devis();
                            stories_d.Fk_Project = p.Id;
                            stories_d.IsPayed = false;
                            stories_d.Epic = this.epic;
                            stories_Devis.FK_Devis = fichier.ID;                            
                            stories_d.save();
                            stories_Devis.FK_Stories_d = stories_d.ID;
                            stories_Devis.CreationDate = DateTime.Now;
                            db.Stories_Devis.Add(stories_Devis);
                            db.SaveChanges();                           
                            foreach (MasterTasks ts in s.Tasks)
                            {
                                Tasks_d tasks_d = new Tasks_d(ts);
                                string[] initiales = tasks_d.Initials.Split('+');
                                foreach(string init in initiales)
                                {
                                    Ressource myressource = db.Ressource.Where(rez => rez.Initial == init).FirstOrDefault();
                                    tasks_d.Fk_Ressource_Initials += myressource.ID+";";
                                }
                                tasks_d.FK_Stories_d = stories_d.ID;
                                tasks_d.save();
                            }
                        }
                    }
                    break;

                case true:
                    foreach (Projet p in this.projets)
                    {
                        p.save();
                        foreach (MasterStories s in p.Stories)
                        {
                            Stories_f stories_f = new Stories_f(s);
                            stories_f.save();
                            foreach (MasterTasks ts in s.Tasks)
                            {
                                Tasks_f tasks_f = new Tasks_f(ts);
                                tasks_f.save();
                            }
                        }
                    }
                    break;
            }
            
        }
    }
}