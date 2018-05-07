using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public partial class Projet : WebApplication4.Models.Projet
    {
        public List<Stories> Stories { get; set; }
        public Dictionary<string, string> structure;

        public Projet(string description, string nom)
        {
            this.Description = description;
            this.Nom = nom;
            this.structure = new Dictionary<string, string>();
            this.structure.Add("Description", this.Description.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Nom", this.Nom.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
        }

        public object getStructure()
        {
            return this.structure;
        }
    }
}