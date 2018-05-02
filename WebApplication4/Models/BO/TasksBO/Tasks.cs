using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebApplication4.Models
{
    public class Tasks
    {
        private DevisFacturationEntities context;
        public long ID { get; set; }
        public long FK_Stories_d { get; set; }
        public string Description { get; set; }
        public string Initials { get; set; }
        public Nullable<int> Duration { get; set; }
        public string Fk_Ressource_Initials { get; set; }

        public virtual Stories_d Stories_d { get; set; }

        public Dictionary<string,string> structure;
        public Tasks()
        {
            this.structure.Add("ID", ID.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("FK_Stories_d", FK_Stories_d.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("Description", Description.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("Initials", Initials.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("Duration", Duration.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("Fk_Ressource_Initials",Fk_Ressource_Initials.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim()); 
        }

        public object getStructure()
        {
            return this.structure;
        }
    }
}