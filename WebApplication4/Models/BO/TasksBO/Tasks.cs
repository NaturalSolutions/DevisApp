using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace WebApplication4.Models
{
    public class MasterTasks
    {
        private DevisFacturationEntities context;
        public long ID { get; set; }
        public long FK_Stories { get; set; }
        public string Description { get; set; }
        public string Initials { get; set; }
        public string Duration { get; set; }
        public string Fk_Ressource_Initials { get; set; }

        public virtual Stories_d Stories_d { get; set; }

        public bool isMultiProgramming;

        public Dictionary<string,string> structure;
        public MasterTasks(string description, string initials,string duration,long fk_stories)
        {
            //this.ID = id;
            this.FK_Stories = fk_stories;
            this.Description = description;
            this.Initials = initials;
            this.Duration = duration;
            //this.Fk_Ressource_Initials = fk_ressource_initials;
            this.structure = new Dictionary<string, string>();

            //this.structure.Add("ID", ID.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("FK_Stories", FK_Stories.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("Description", this.Description.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("Initials", this.Initials.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            this.structure.Add("Duration", this.Duration.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim());
            //this.structure.Add("Fk_Ressource_Initials",Fk_Ressource_Initials.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Trim()); 
            if (this.Duration.IndexOf('+') == 1 && this.Initials.IndexOf('+') == 1)
            {
                this.isMultiProgramming = true;
            }
            else
            {
                this.isMultiProgramming = false;
            }
        }

        public MasterTasks()
        {
            //  this.isMultiProgramming = false;
            //  if(this.Duration.IndexOf('+') != -1 && this.Duration.IndexOf('+') != 0 && this.Initials.IndexOf('+') != -1 && this.Initials.IndexOf('+') != 0)
            //  {
            //      this.isMultiProgramming = true;
            //  }else
            //  {
            //      this.isMultiProgramming = false;
            //  }
        }

        public object getStructure()
        {
            return this.structure;
        }
    }
}