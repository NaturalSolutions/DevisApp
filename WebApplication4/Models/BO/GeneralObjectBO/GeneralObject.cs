using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class GeneralObject
    {
        private DevisFacturationEntities db;
        public List<Projet> projets {get; set;}

        public void SaveToDb()
        {
            this.db = new DevisFacturationEntities();
            foreach(Projet p in this.projets)
            {
                db.Projet.Add(p);
                foreach(MasterStories s in p.Stories)
                {
                    Stories_d st_d = new Stories_d();
                }
            }
        }
    }
}