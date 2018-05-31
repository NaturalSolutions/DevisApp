using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO.DevisProcess
{
    public class DevisFiller
    {
        private WordFileGenerator generator;
        public DevisFiller(Devis devis,bool isFactu, DevisSumManager sumManager,GeneralObject genObject)
        {
            this.generator = new WordFileGenerator(genObject,sumManager,devis,isFactu);
        }
    }
}