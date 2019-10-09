using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models.BO.ProcessFiles;

namespace WebApplication4.Models.BO.ProcessFiles
{
    public class FileFiller
    {
        private WordFileGenerator generator;
        public FileFiller(dynamic fichier,bool isFactu, SumManager sumManager,GeneralObject genObject, LogManager userLogs)
        {
            this.generator = new WordFileGenerator(genObject,sumManager,fichier,isFactu, userLogs);
        }
    }
}