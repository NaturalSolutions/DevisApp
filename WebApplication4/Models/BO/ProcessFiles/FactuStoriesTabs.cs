using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO.ProcessFiles
{
    public class FactuStoriesTabs
    {
        private decimal B;
        private decimal PN;
        private decimal PR;

        public FactuStoriesTabs()
        {
            this.B = 0;
            this.PN = 0;
            this.PR = 0;
        }

        public void setB(decimal b)
        {
            this.B = b;
        }

        public decimal getB() { return this.B; }

        public void setPN(decimal pn)
        {
            this.PN = pn;
        }

        public decimal getPN() { return this.PN; }

        public void setPR(decimal pr)
        {
            this.PR = pr;
        }

        public decimal getPR() { return this.PR; }
    }
}