//------------------------------------------------------------------------------
// <auto-generated>
//     Ce code a été généré à partir d'un modèle.
//
//     Des modifications manuelles apportées à ce fichier peuvent conduire à un comportement inattendu de votre application.
//     Les modifications manuelles apportées à ce fichier sont remplacées si le code est régénéré.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebApplication4.Models
{
    using System;
    using System.Collections.Generic;
    using Newtonsoft.Json;
    public partial class Tasks
    {
        public long ID { get; set; }
        public long FK_Stories { get; set; }
        public string Description { get; set; }
        public string Initials { get; set; }
        public Nullable<int> Duration { get; set; }
        public Nullable<bool> IsInSprint { get; set; }
    
    [JsonIgnore]
        public virtual Stories Stories { get; set; }
    }
}
