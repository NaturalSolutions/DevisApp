using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models;

namespace WebApplication4.Models
{
    public partial class Ressource
    {
        public bool isFullAMO()
        {
            using (DevisFacturationEntities cont = new DevisFacturationEntities())
            {
                List<long> ids = cont.Tarification_Ressource.Where(s => s.FK_Ressource == this.ID).Select(s => s.FK_Tarification).ToList();
                List<Tarification> tars = cont.Tarification.Where(s => ids.Contains(s.ID)).ToList();
                if (tars.Any(s => s.IsAmo == false))
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }

        public bool hasAmo()
        {
            bool result = false;
            using (DevisFacturationEntities cont = new DevisFacturationEntities())
            {
                List<Tarification_Ressource> test = cont.Tarification_Ressource.Where(o => o.FK_Ressource == this.ID && o.Tarification.IsAmo == true).ToList();
                if (test.Count() > 0)
                {
                    result = true;
                }
            }
            return result;
        }

        public decimal getCurrentTarification(bool type)
        {
            Tarification result;
            decimal tarResult;
            using (DevisFacturationEntities cont = new DevisFacturationEntities())
            {
                List<Tarification_Ressource> test = cont.Tarification_Ressource.Where(o => o.FK_Ressource == this.ID).ToList();
                bool boolFullAmo = this.isFullAMO();
                if (type)
                {
                    if (boolFullAmo)
                    {
                        result = test.OrderByDescending(o => o.Tarification.Tar5).Select(o => o.Tarification).FirstOrDefault();
                        tarResult = result.Tar5;
                    }
                    else
                    {
                        if (this.hasAmo())
                        {
                            result = test.Where(o => o.Tarification.IsAmo == true).Select(o => o.Tarification).FirstOrDefault();
                            tarResult = result.Tar5;
                        }
                        else
                        {
                            if (this.Niveau == 3)
                            {
                                result = test.OrderByDescending(o => o.Tarification.Tar3).Select(o => o.Tarification).FirstOrDefault();
                                tarResult = (decimal)result.Tar3;
                            }
                            else
                            {
                                result = test.OrderByDescending(o => o.Tarification.Tar5).Select(o => o.Tarification).FirstOrDefault();
                                tarResult = result.Tar5;
                            }
                        }
                    }
                }
                else
                {
                    if (boolFullAmo)
                    {
                        result = test.OrderBy(o => o.Tarification.Tar5).Select(o => o.Tarification).FirstOrDefault();
                        tarResult = result.Tar5;
                    }
                    else
                    {
                        result = test.Where(o => o.Tarification.IsAmo == false).Select(o => o.Tarification).FirstOrDefault();
                        tarResult = this.Niveau == 3 ? (decimal)result.Tar3 : result.Tar5;
                    }
                }
             }
            return tarResult;
        }
    }
}