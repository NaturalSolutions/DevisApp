using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models.BO.Process;

namespace WebApplication4.Models.BO.ProcessFiles
{
    public class FileFiller
    {
        private WordFileGenerator generator;
        public FileFiller(Devis devis,bool isFactu, SumManager sumManager,GeneralObject genObject)
        {
            this.generator = new WordFileGenerator(genObject,sumManager,devis,isFactu);
        }
    }
}