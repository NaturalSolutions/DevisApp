using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO.DevisProcess
{
    public class DevisSumManager // objet renvoyer par le DevisCalculator 
    {
        private Dictionary<string,decimal?> projectCost; // Dictionnaire qui associe le nom du projet a son cout
        public Dictionary<string,decimal?> getProjectCost()
        {
            return this.projectCost;
        }
        public void setProjectCost(string projectName,decimal? priceCash)
        {
            this.projectCost.Add(projectName, priceCash);
        }

        private decimal? supportCost; // cout du support
        public decimal? getSupportCost()
        {
            return this.supportCost;
        }
        public void setSupport(decimal? supportValue)
        {
            this.supportCost = supportValue;
        }

        private decimal? projectDirectionCost; // cout de la direction du projet
        public decimal? getProjectDirectionCost()
        {
            return this.projectDirectionCost;
        }
        public void setProjectDirectionCost(decimal? directionCost)
        {
            this.projectDirectionCost = directionCost;
        }

        private decimal? totalAmout; // Montant total du devis
        public decimal? getTotalAmout()
        {
            return this.projectDirectionCost;
        }
        public void setTotalAmout (decimal? directionCost)
        {
            this.projectDirectionCost = directionCost;
        }
    }
}