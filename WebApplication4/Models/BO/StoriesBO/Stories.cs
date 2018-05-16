using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class Stories
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]

        public long ID {get; set;} // OK
        public string Description {get; set; }// OK
        public string Type {get; set; }// OK
        public Nullable<System.DateTime> StartDate {get; set; }// OK
        public Nullable<System.DateTime> UpdatetDate {get; set; }// OK
        public string Owners {get; set; }// OK
        public string Labels {get; set; }// OK
        public Nullable<bool> IsBillable {get; set; }// OK
        public Nullable<bool> IsPayed {get; set; }// OK
        public Nullable<bool> Bonus {get; set; }// OK
        public Nullable<long> OriginalId {get; set; }// OK
        public string URL {get; set; }// OK
        public string Epic {get; set; }// OK
        public string isAMO {get; set; }// OK
        public Nullable<long> Fk_Project {get; set; }// OK

        public virtual Projet Projet { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Tasks> Tasks { get; set; }

        public Dictionary<string, string> structure;

        public Stories(string description,
            string type,
            System.DateTime depart,
            System.DateTime maj,
            string owners,
            string labels,
            bool billable,
            bool isPayed,
            bool bonus,
            long originalID,
            string url,
            string epic,
            string isAmo,
            long fkprojet)
        {

           // this.ID = id;
            this.Description = description;
            this.Type = type;
            this.StartDate = depart;
            this.UpdatetDate = maj;
            this.Owners = owners;
            this.Labels = labels;
            this.IsBillable = billable;
            this.IsPayed = isPayed;
            this.Bonus = bonus;
            this.OriginalId = originalID;
            this.URL = url;
            this.Epic = epic;
            this.isAMO = isAmo;
            this.Fk_Project = fkprojet;
            this.Tasks = new List<Tasks> ();
            this.structure = new Dictionary<string, string>();
          //  this.structure.Add("ID", this.ID.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Description", this.Description.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Type", this.Type.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("StartDate", this.StartDate.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("UpdatetDate", this.UpdatetDate.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Owners", this.Owners.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Labels", this.Labels.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("IsBillable", this.IsBillable.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("IsPayed", this.IsPayed.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Bonus", this.Bonus.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("OriginalId", this.OriginalId.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("URL", this.URL.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Epic", this.Epic.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("isAMO", this.isAMO.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Fk_Project", this.Fk_Project.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.structure.Add("Tasks", this.Tasks.GetType().ToString().Split(',')[0].Replace("System.", "").Replace("32", "").Replace("64", "").Trim());
            this.Tasks = new HashSet<Tasks>();
        }

        public Stories()
        {

        }

        public object getStructure()
        {
            return this.structure;
        }
    }
}