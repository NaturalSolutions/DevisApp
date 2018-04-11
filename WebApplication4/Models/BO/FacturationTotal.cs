using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class FacturationTotal
    {
        public List<Facturation> amo { get; set; }
        public List<Facturation> dev { get; set; }
        public List<Facturation> des { get; set; }

        public void updateValue()
        {
            if (amo != null)
            {
                amo.ForEach(x => x.updateValue(true));
            }
            if (dev != null)
            {
                dev.ForEach(x => x.updateValue(false));
            }
            if (des != null)
            {
                des.ForEach(x => x.updateValue(false));
            }
        }
    }
}