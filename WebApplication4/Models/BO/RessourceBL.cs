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
    }
}