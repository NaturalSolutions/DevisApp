using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace WebApplication4.Models
{
    public class LogFile
    {
        public static void create()
        {
            string basePath = System.AppDomain.CurrentDomain.BaseDirectory;
            DateTime date = DateTime.Now;
            string parsedDate = getDateString();
            File.Create(basePath + "\\Log_"+parsedDate+".txt");
        }

        private static string getDateString()
        {
            DateTime date = DateTime.Now;
            string parsedDate = date.Day + "-" + date.Month + "-" + date.Year;
            return parsedDate;
        }

        private static void addSepartionLine(string type = "")
        {
            string basePath = System.AppDomain.CurrentDomain.BaseDirectory;
            string parsedDate = getDateString();
            string line = "";


            if (!File.Exists(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                throw new Exception("Soucis de lecture du fichier de log");
            }
            using (StreamWriter file = new StreamWriter(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                for(int i = 0; i < 40;  i++ )
                {
                    line += type;
                }
                file.WriteLine(line);
            }
        }

        public static void initialiseEpic(string epic)
        {
            string basePath = System.AppDomain.CurrentDomain.BaseDirectory;
            string parsedDate = getDateString();

            if(!File.Exists(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                create();
            }
            else
            {
                File.Delete(basePath + "\\Log_" + parsedDate + ".txt");
                create();
            }

           using (StreamWriter file = new StreamWriter(basePath + "\\Log_" + parsedDate + ".txt"))
           {
               file.WriteLine("EPIC CHOISI POUR CETTE SESSION : ");
               file.WriteLine(epic);
                addSepartionLine("=");
           }

        }

        public static void initialiseProject(string project)
        {
            string basePath = System.AppDomain.CurrentDomain.BaseDirectory;
            string parsedDate = getDateString();

            if (!File.Exists(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                throw new Exception("Soucis de lecture du fichier de log");
            }
            using (StreamWriter file = new StreamWriter(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                file.WriteLine("Calcul pour le projet : ");
                file.WriteLine(project);
                addSepartionLine();
            }

        }

        public static void initialiseStory(string story, int id)
        {
            string basePath = System.AppDomain.CurrentDomain.BaseDirectory;
            string parsedDate = getDateString();

            if (!File.Exists(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                throw new Exception("Soucis de lecture du fichier de log");
            }
            using (StreamWriter file = new StreamWriter(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                file.WriteLine("ID : " + id.ToString() + " Descr : " + story );
            }
        }

        public static void initialiseTaskCalc(string user, int duration, float dayValue, float factu )
        {
            string basePath = System.AppDomain.CurrentDomain.BaseDirectory;
            string parsedDate = getDateString();

            if (!File.Exists(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                throw new Exception("Soucis de lecture du fichier de log");
            }
            using (StreamWriter file = new StreamWriter(basePath + "\\Log_" + parsedDate + ".txt"))
            {
                file.WriteLine("ID : " + id.ToString() + " Descr : " + story);
            }
        }
    }
}