using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public partial class Projet : WebApplication4.Models.Projet
    {
        public List<Stories> Stories { get; set; }
    }
}