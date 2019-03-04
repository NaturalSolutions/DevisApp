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
            }
            else
            {
                fichier = (Facturation)fichier;
            }
            switch (isFactu)
            {
                case false:
                    List<Devis> lesdevis = db.Devis.Where(devisVerif => devisVerif.Commande.Trim().ToLower() == this.epic.Trim().ToLower()).ToList();
                    if (lesdevis.Count() > 0)
                    {
                        Devis devisAsupprimer = lesdevis[0];
                        fichier = lesdevis[0];
                        List<Stories_Devis> storiesDevisASuprimer = db.Stories_Devis.Where(stdevis => stdevis.FK_Devis == devisAsupprimer.ID).ToList();
                        foreach (Stories_Devis myStoriesDevis in storiesDevisASuprimer)
                        {
                            Stories_d storyASupprimer = db.Stories_d.Where(sas => sas.ID == myStoriesDevis.FK_Stories_d).FirstOrDefault();
                            List<Tasks_d> tachesAsupprimer = db.Tasks_d.Where(tachasup => tachasup.FK_Stories_d == storyASupprimer.ID).ToList();
                            foreach (Tasks_d ta in tachesAsupprimer)
                            {
                                db.Tasks_d.Remove(ta);
                            }
                            db.Stories_d.Remove(storyASupprimer);
                            db.Stories_Devis.Remove(myStoriesDevis);
                        }
                        devisAsupprimer.Date = DateTime.Now;
                        db.SaveChanges();
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
                                Projet proj = db.Projet.Where(pro => pro.Nom.Trim().ToLower() == p.Nom.Trim().ToLower()).FirstOrDefault();
                                stories_d.Fk_Project = proj.Id;
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
                                    foreach (string init in initiales)
                                    {
                                        Ressource myressource = db.Ressource.Where(rez => rez.Initial == init).FirstOrDefault();
                                        tasks_d.Fk_Ressource_Initials += myressource.ID + ";";
                                    }
                                    tasks_d.FK_Stories_d = stories_d.ID;
                                    tasks_d.save();
                                }
                            }
                        }
                    }
                    break;

                case true:
                    List<Facturation> lesFacturations = db.Facturation.Where(devisVerif => devisVerif.Commande.Trim().ToLower() == this.epic.Trim().ToLower()).ToList();
                    if (lesFacturations.Count() > 0)
                    {
                        Facturation facturationASupprimer = lesFacturations[0];
                        fichier = lesFacturations[0];
                        List<Stories_Facturation> storiesDevisASuprimer = db.Stories_Facturation.Where(stdevis => stdevis.FK_Facturation == facturationASupprimer.ID).ToList();
                        foreach (Stories_Facturation myStoriesFacturation in storiesDevisASuprimer)
                        {
                            Stories_f storyASupprimer = db.Stories_f.Where(sas => sas.ID == myStoriesFacturation.FK_Stories_f).FirstOrDefault();
                            List<Tasks_f> tachesAsupprimer = db.Tasks_f.Where(tachasup => tachasup.FK_Stories_f == storyASupprimer.ID).ToList();
                            foreach (Tasks_f ta in tachesAsupprimer)
                            {
                                db.Tasks_f.Remove(ta);
                            }
                            db.Stories_f.Remove(storyASupprimer);
                            db.Stories_Facturation.Remove(myStoriesFacturation);
                        }
                        facturationASupprimer.Date = DateTime.Now;
                        db.SaveChanges();
                        foreach (Projet p in this.projets)
                        {
                            if (!this.verifyProjectExist(p))
                            {
                                p.save();
                            }
                            foreach (MasterStories s in p.Stories)
                            {
                                Stories_f stories_f = new Stories_f(s);
                                Stories_Facturation stories_Facturation = new Stories_Facturation();
                                Projet proj = db.Projet.Where(pro => pro.Nom.Trim().ToLower() == p.Nom.Trim().ToLower()).FirstOrDefault();
                                stories_f.Fk_Project = proj.Id;
                                stories_f.IsPayed = true;
                                stories_f.Epic = this.epic;
                                stories_Facturation.FK_Facturation = fichier.ID;
                                stories_f.save();
                                stories_Facturation.FK_Stories_f = stories_f.ID;
                                stories_Facturation.CreationDate = DateTime.Now;
                                db.Stories_Facturation.Add(stories_Facturation);
                                db.SaveChanges();
                                foreach (MasterTasks ts in s.Tasks)
                                {
                                    Tasks_f tasks_f = new Tasks_f(ts);
                                    string[] initiales = tasks_f.Initials.Split('+');
                                    foreach (string init in initiales)
                                    {
                                        Ressource myressource = db.Ressource.Where(rez => rez.Initial == init).FirstOrDefault();
                                        tasks_f.Fk_Ressource_Initials += myressource.ID + ";";
                                    }
                                    tasks_f.FK_Stories_f = stories_f.ID;
                                    tasks_f.save();
                                }
                            }
                        }
                    }
                    break;
            }
        }
    }
}