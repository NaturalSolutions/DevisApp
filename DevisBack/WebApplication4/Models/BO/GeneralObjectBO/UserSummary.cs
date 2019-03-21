using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO.GeneralObjectBO
{
    public class ProjectByUserSummary
    {
        public string name;
        public decimal totalhours;
        public decimal totaldays;
    }
    public class UserSummary
    {
        public string intials;
        public List<ProjectByUserSummary> projectsSummary;

        public UserSummary(string initials)
        {
            this.intials = initials;
            this.projectsSummary = new List<ProjectByUserSummary>();
        }

        public void addProject(string name, decimal totalHours, decimal totalDays)
        {
            this.projectsSummary.Add(new ProjectByUserSummary() { name = name, totalhours = totalHours, totaldays = totalDays });
        }

        public void toText()
        {
            //FileSummary.writeLine("Résumé pour la ressource  : " + this.intials);
            FileSummary.writeProjectSummaryLines(this);
        }
    }
}