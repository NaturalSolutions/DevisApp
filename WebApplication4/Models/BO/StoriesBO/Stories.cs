using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class Stories
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Stories()
        {
            this.Tasks = new HashSet<Tasks>();
        }

        public long ID { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> UpdatetDate { get; set; }
        public string Owners { get; set; }
        public string Labels { get; set; }
        public Nullable<bool> IsBillable { get; set; }
        public Nullable<bool> IsPayed { get; set; }
        public Nullable<bool> Bonus { get; set; }
        public Nullable<long> OriginalId { get; set; }
        public string URL { get; set; }
        public string Epic { get; set; }
        public Nullable<long> Fk_Project { get; set; }

        public virtual Projet Projet { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Tasks> Tasks { get; set; }
    }
}