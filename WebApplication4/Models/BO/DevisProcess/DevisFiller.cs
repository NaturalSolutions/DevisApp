using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO.DevisProcess
{
    public class DevisFiller // classe de remplissage du devis ... a prevoir plus tard
    {
        private WordFileGenerator generator;

        public DevisFiller(FactuConstante f,bool isFactu)
        {
            this.generator = new WordFileGenerator(f,isFactu);
        }
    }
}