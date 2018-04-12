using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class FactuConstante
    {
        public List<GeneralProject> projet { get; set; }     
        public DirecteurTechnique directeur { get; set; }
        public ChefDeProjet chefProjet { get; set; }
    }

    //Gestion cas particuloer chef de projet et directeur technique tarification et devis 
    public class ChefDeProjet
    {
        private Devis_Entities db = new Devis_Entities();
        public decimal? jrs { get; set; }
        public decimal? we { get; set; }
        public decimal? f { get; set; }
        public decimal sum { get; set; }

        public void updateValue()
        {
            Tarification tar = this.db.Tarification.Where(x => x.Type == "Chef de projet fonctionnel").FirstOrDefault();
            decimal dailyValue = Convert.ToDecimal((this.jrs != null ? this.jrs : 0) * tar.Tar5);
            decimal dailyValueWE = Convert.ToDecimal((this.we != null ? this.we : 0) * tar.Tar5 * 1.5m);
            decimal dailyValueF = Convert.ToDecimal((this.f != null ? this.f : 0) * tar.Tar5 * 2m);

            this.sum = Convert.ToDecimal(dailyValue + dailyValueWE + dailyValueF);
        }
    }

    public class DirecteurTechnique
    {
        private Devis_Entities db = new Devis_Entities();
        public decimal? jrs { get; set; }
        public decimal? we { get; set; }
        public decimal? f { get; set; }
        public decimal sum { get; set; }

        public void updateValue()
        {
            Tarification tar = this.db.Tarification.Where(x => x.Type == "Directeur technique").FirstOrDefault();
            decimal dailyValue = Convert.ToDecimal((this.jrs != null ? this.jrs : 0) * tar.Tar5);
            decimal dailyValueWE = Convert.ToDecimal((this.we != null ? this.we : 0) * tar.Tar5 * 1.5m);
            decimal dailyValueF = Convert.ToDecimal((this.f != null ? this.f : 0) * tar.Tar5 * 2m);

            this.sum = Convert.ToDecimal(dailyValue + dailyValueWE + dailyValueF);
        }
    }
}