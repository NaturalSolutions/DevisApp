using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace WebApplication4.Models.BO.ProcessFiles
{
    public class LoggedUser
    {
        public string initials;
        public bool isAmo;
        public decimal hours;
        public decimal days;
        public decimal factuCost;
        public decimal wefBonus;
        public decimal total;

        public LoggedUser(string initials, bool isAmo, decimal hours, decimal days, decimal factuCost, decimal wefBonus, decimal total)
        {
            this.initials = initials;
            this.isAmo = isAmo;
            this.hours = hours;
            this.days = days;
            this.factuCost = factuCost;
            this.wefBonus = wefBonus;
            this.total = total;
        }

        public override string ToString()
        {
            return "Initials;" + this.initials + ";Heures loggées;" + this.hours + ";Jours;" + this.days + ";Tarif;" + this.factuCost + ";Facturation;" + total;
        }
    }
    public class LoggedProject
    {
        public string name;
        public List<LoggedUser> users;

        public LoggedProject(string projectName)
        {
            this.name = projectName;
            this.users = new List<LoggedUser>();
        }

    }

    public class LogManager
    {
        public List<LoggedProject> Logs;
        public string fileName;
        public LogManager()
        {
            this.Logs = new List<LoggedProject>();
        }

        public void AddProject(string projectName)
        {
            this.Logs.Add(new LoggedProject(projectName));
        }

        public void SetFileName(string path, string epic)
        {
            this.fileName = path + epic + ".txt";
        }

        public void CreateFile()
        {
            try
            {
                // Check if file already exists. If yes, delete it.     
                if (File.Exists(this.fileName))
                {
                    File.Delete(this.fileName);
                }

                using (StreamWriter file =
                new StreamWriter(this.fileName))
                {
                    foreach (LoggedProject proj in this.Logs)
                    {
                        file.WriteLine("Projet : " + proj.name);
                        file.WriteLine("AMO : ");
                        List<LoggedUser> amoUsers =  proj.users.Where(o => o.isAmo == true).ToList();
                        foreach(LoggedUser usr in amoUsers)
                        {
                            file.WriteLine(usr.ToString());
                        }
                        file.WriteLine("DEV/DES: ");                
                        List<LoggedUser> classicUsers = proj.users.Where(o => o.isAmo == false).ToList();
                        foreach (LoggedUser usr2 in classicUsers)
                        {
                            file.WriteLine(usr2.ToString());
                        }
                    }
                }

                // Open the stream and read it back.    
                using (StreamReader sr = File.OpenText(fileName))
                {
                    string s = "";
                    while ((s = sr.ReadLine()) != null)
                    {
                        Console.WriteLine(s);
                    }
                }
            }
            catch (Exception Ex)
            {
                
            }
        }

        public void AddUserData(string project, string initials, bool isAmo, decimal hours, decimal days, decimal factuCost, decimal wefBonus, decimal total)
        {
            LoggedProject proj = this.Logs.Where(o => o.name == project).First();
            LoggedUser user;
            if (proj.users.Where(o => o.initials == initials && o.isAmo == isAmo).Count() > 0)
            {
                user = proj.users.Where(o => o.initials == initials && o.isAmo == isAmo).First();
                user.total += total;
                user.hours += hours;
                user.days += days;
            }
            else
            {
                user = new LoggedUser(initials, isAmo, hours, days, factuCost, wefBonus, total);
                proj.users.Add(user);
            }

        }
    }
}