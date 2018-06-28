using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models
{
    public partial class Stories_f : WebApplication4.Models.BO.MasterStories
    {
        private DevisFacturationEntities db = new DevisFacturationEntities();
        public Stories_f(string description, string type, DateTime depart, DateTime maj, string owners, string labels, bool billable, bool isPayed, bool bonus, long originalID, string url, string epic, string isAmo,long fkprojet) : base(description, type, depart, maj, owners, labels, billable, isPayed, bonus, originalID, url, epic, isAmo,fkprojet)
        {
        }

        public Stories_f(WebApplication4.Models.BO.MasterStories s)
        {
            this.Description = s.Description;
            this.Type = s.Type;
            this.StartDate = s.StartDate;
            this.UpdatetDate = s.UpdatetDate;
            this.Owners = s.Owners;
            this.Labels = s.Labels;
            this.IsBillable = s.IsBillable;
            this.IsPayed = s.IsPayed;
            this.Bonus = s.Bonus;
            this.OriginalId = s.OriginalId;
            this.URL = s.URL;
            this.Epic = s.Epic;
            this.Fk_Project = s.Fk_Project;
        }

        public void save()
        {
            this.db.Stories_f.Add(this);
            this.db.SaveChanges();
        }
    }
}