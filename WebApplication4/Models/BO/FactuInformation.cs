using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class DirecteurTechnique
    {

    }

    public class ChefDeProjet
    {
        public decimal? jours { get; set; }

        public decimal? weekend { get; set; }

        public decimal? férié { get; set; }

        public decimal sum { get; set; }

        private Devis_Entities db = new Devis_Entities();

        public void updateValue()
        {
            Tarification tar = db.Tarification.Where(x => x.Type == "Chef de projet fonctionnel").FirstOrDefault();
            decimal dailyValue = Convert.ToDecimal((this.jours != null ? this.jours : 0) * tar.Tar5);
            decimal dailyValueWE = Convert.ToDecimal((this.weekend != null ? this.weekend : 0) * tar.Tar5 * 1.5m);
            decimal dailyValueF = Convert.ToDecimal((this.férié != null ? this.férié : 0) * tar.Tar5 * 2m);

            this.sum = Convert.ToDecimal(dailyValue + dailyValueWE + dailyValueF);
        }
    }
}

public class FactuInformation // class de gestion de cas particulier pour la facturation 
{
    public List<object> projet { get; set; }
    public DirecteurTechnique directeur { get; set; }
    public ChefDeProjet chefProjet { get; set; }
}
}