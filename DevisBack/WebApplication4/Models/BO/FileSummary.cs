using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web;
using WebApplication4.Models.BO.GeneralObjectBO;

namespace WebApplication4.Models.BO
{
    public class FileSummary
    {

        public static string getFile()
        {
            string fileName = "Log_Genral_" + DateTime.Now.Date.ToString() + ".txt";
            string basePath = System.AppDomain.CurrentDomain.BaseDirectory;
            if (File.Exists(basePath + @"\" + fileName))
            {
                return basePath + @"\" + fileName;
            }
            else
            {
                File.Create(basePath + @"\" + fileName);
                return basePath + @"\" + fileName;
            }
        }

        public static void writeLine(string lineText, bool separtor = false)
        {
            string fileName = FileSummary.getFile();
            using (StreamWriter sw = File.CreateText(fileName))
            {
                sw.WriteLine(lineText);
                if (separtor)
                {
                    sw.WriteLine("_____________________________________________________");
                }
            }
        }

        public static void writeLines(List<string> linesText, bool separator = false, bool eachLineSeprator = false)
        {
            string fileName = FileSummary.getFile();
            using (StreamWriter sw = File.CreateText(fileName))
            {
                foreach (string line in linesText)
                {
                    sw.WriteLine(line);
                    if (eachLineSeprator)
                    {
                        sw.WriteLine("_____________________________________________________");
                    }
                }
                if (separator)
                {
                    sw.WriteLine("_____________________________________________________");
                }
            }
        }

        public static void writeProjectSummaryLines(UserSummary sum, bool separator = false)
        {
            string fileName = FileSummary.getFile();
            using (StreamWriter sw = File.CreateText(fileName))
            {
                FileSummary.writeLine("Résumé pour la ressource  : " + sum.intials);         
                foreach (ProjectByUserSummary line in sum.projectsSummary)
                {
                    sw.WriteLine("PROJET : " + line.name + "; La ressource " + sum.intials + " à travailler : " + line.totalhours + "h; convertis en : " + line.totaldays + "jours;");                    
                }
                if (separator)
                {
                    sw.WriteLine("_____________________________________________________");
                }
            }
        }
    }
}