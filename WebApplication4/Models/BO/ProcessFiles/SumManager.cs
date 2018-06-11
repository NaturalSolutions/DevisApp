using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO.Process
{
    public class SumManager // objet renvoyer par le DevisCalculator 
    {
        private Dictionary<string, decimal?> projectCost; // Dictionnaire qui associe le nom du projet a son cout
        public SumManager()
        {
            this.projectCost = new Dictionary<string, decimal?>();
        }
       
        public decimal? getProjectCost(string key)
        {
            decimal? result;
            if(this.projectCost != null && key != null)
            {
                if (this.projectCost.ContainsKey(key))
                {
                    result = this.projectCost[key];
                }
                else
                {
                    result = -1;
                }
            }
            else
            {
                result = -2;
            }
            return result;
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