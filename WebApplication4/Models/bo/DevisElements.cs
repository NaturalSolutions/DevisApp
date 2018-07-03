using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class DevisElements
    {
        public string dateCreation;
        public string dateVersion;
        public decimal numVersion;
        public int numEdition;
        public string nomFichier;
        public string totalTable;
        public string facturationDT;
        public string facturationCDP;
        public string estimationDTCDP;
        public string totalCumule;
        public string dateDebut;
        public string livraisonFinal;
        public string mois;
        public string annee;
        public decimal support;
        private DevisFacturationEntities db;

        public DevisElements(string _nomFichier, decimal _totalTable, bool isFactu = false, decimal? _tarCDP = null, decimal? _tarDT = null)
        {
            this.db = new DevisFacturationEntities();
            this.dateCreation = DateTime.Now.ToShortDateString();
            this.dateVersion = DateTime.Now.ToShortDateString();
            this.annee = DateTime.Now.Year.ToString();
            this.mois = new CultureInfo("fr-FR").DateTimeFormat.GetMonthName(isFactu ? DateTime.Now.AddMonths(-1).Month : DateTime.Now.Month).ToString();
            this.numVersion = 1.0m;
            this.numEdition = 1;
            this.nomFichier = _nomFichier;
            this.totalTable = _totalTable.ToString("G29");
            this.support = 8900m;
            DateTime firstOfTheMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            this.dateDebut = firstOfTheMonth.AddMonths(1).ToLongDateString();
            this.livraisonFinal = firstOfTheMonth.AddMonths(2).AddDays(-1).ToLongDateString();

            if (_tarCDP == null)
            {
                decimal cdp = db.Tarification.Where(s => s.Type == "Chef de projet technique").Select(s => s.Tar5).First();
                decimal dt = db.Tarification.Where(s => s.Type == "Directeur technique").Select(s => s.Tar5).First();
                //TODO possibiliter de saisir le nombre de jour
                decimal factuCDP = 20 * cdp;
                this.facturationCDP = factuCDP.ToString("G29");
                decimal factuDT = 7 * dt;
                this.facturationDT = factuDT.ToString("G29");
                decimal totalDTCDP = factuCDP + factuDT;
                this.estimationDTCDP = totalDTCDP.ToString("G29");
                this.totalCumule = this.estimationDTCDP + this.totalTable + this.support;
            }
            else
            {
                decimal cdp = db.Tarification.Where(s => s.Type == "Chef de projet technique").Select(s => s.Tar5).First();
                decimal dt = db.Tarification.Where(s => s.Type == "Directeur technique").Select(s => s.Tar5).First();
                decimal factuCDP = Convert.ToDecimal(_tarCDP) * cdp;
                this.facturationCDP = factuCDP.ToString("G29");
                decimal factuDT = Convert.ToDecimal(_tarDT) * dt;
                this.facturationDT = factuDT.ToString("G29");
                decimal totalDTCDP = factuCDP + factuDT;
                this.estimationDTCDP = totalDTCDP.ToString("G29");
                decimal total = decimal.Parse(this.estimationDTCDP) + decimal.Parse(this.totalTable) + this.support;
                this.totalCumule = total.ToString("G29");
            }
            
        }
    }
}