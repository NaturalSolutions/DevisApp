using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models.BO;

namespace WebApplication4.Models
{
    public partial class Tasks_d : MasterTasks
    {
        private DevisFacturationEntities db = new DevisFacturationEntities();
        public Tasks_d(MasterTasks t)
        {
            //this.FK_Stories = t.FK_Stories;
            this.Description = t.Description;
            this.Initials = t.Initials;
            this.Duration = t.Duration;
            //this.Fk_Ressource_Initials = t.Fk_Ressource_Initials;
        }

        public Tasks_d(string description, string initials, string duration,long fk_stories) : base(description, initials, duration,fk_stories)
        {
        }

        public Tasks_d()
        {

        }

        public void save()
        {
            this.db.Tasks_d.Add(this);
            this.db.SaveChanges();
        }
    }
}