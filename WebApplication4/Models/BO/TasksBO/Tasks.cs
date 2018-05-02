using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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

        public Dictionary<Type,string> structure;
        public Tasks()
        {
            this.structure.Add(ID.GetType(), "ID");
            this.structure.Add(FK_Stories_d.GetType(), "FK_Stories_d");
            this.structure.Add(Description.GetType(), "Description)");
            this.structure.Add(Initials.GetType(), "Initials");
            this.structure.Add(Duration.GetType(), "Duration");
            this.structure.Add(Fk_Ressource_Initials.GetType(), "Fk_Ressource_Initials"); 
        }
    }
}