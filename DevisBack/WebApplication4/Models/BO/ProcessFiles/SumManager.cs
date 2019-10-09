using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models.BO.ProcessFiles;

namespace WebApplication4.Models.BO.ProcessFiles
{
    public class SumManager // objet renvoyer par le DevisCalculator 
    {
        private Dictionary<string, decimal?> projectCost; // Dictionnaire qui associe le nom du projet a son cout
        private Dictionary<string, FactuStoriesTabs> factuProjectCost; // Dictionnaire qui associe le nom du projet à un objet contenant les stories bonus les stories non réalisé et les stories réalisé
        public SumManager()
        {
            this.factuProjectCost = new Dictionary<string, FactuStoriesTabs>();
            this.projectCost = new Dictionary<string, decimal?>();
        }
       
        public dynamic getProjectCost(string key, bool isFactu = false)
        {
            dynamic result;
            //if (!isFactu)
            //{
            //    if(this.projectCost != null && key != null)
            //    {
            //        if (this.projectCost.ContainsKey(key))
            //        {
            //            result = this.projectCost[key];
            //        }
            //        else
            //        {
            //            result = -1;
            //        }
            //    }
            //    else
            //    {
            //        result = -2;
            //    }
            //}else
            //{
                if (this.projectCost != null && key != null)
                {
                    if (this.factuProjectCost.ContainsKey(key))
                    {
                        result = this.factuProjectCost[key];
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
            //}
            return result;
        }
        public void setProjectCost(string projectName,decimal? priceCash)
        {
            this.projectCost.Add(projectName, priceCash);
        }

        public void setProjectCostfactu(string projectName, FactuStoriesTabs priceCash)
        {
            this.factuProjectCost.Add(projectName, priceCash);
        }        
    }
}