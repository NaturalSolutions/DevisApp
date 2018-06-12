using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models.BO;

namespace WebApplication4.Models
{
    public partial class Projet
    {
        private DevisFacturationEntities db = new DevisFacturationEntities();
        public List<MasterStories> Stories { get; set; }
        public Dictionary<string, string> structure;
        public Dictionary<string, List<MasterStories>> découpageStories;

        

        public Projet(string description, string nom)
        {
            this.Description = description;
            this.Nom = nom;
            this.Id = 4564564;
            this.structure = new Dictionary<string, string>();
            this.découpageStories = new Dictionary<string,List<MasterStories>>();
            this.structure.Add("ID", this.Id.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Description", this.Description.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Nom", this.Nom.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
        }

        public object getStructure()
        {
            return this.structure;
        }

        public void save()
        {
            this.db.Projet.Add(this);
            this.db.SaveChanges();
        }
    }
}