using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models;

namespace WebApplication4.Models.BO
{
    public class ProcessTotal
    {
        public List<ProcessCalcul> amo { get; set; }
        public List<ProcessCalcul> dev { get; set; }
        public List<ProcessCalcul> des { get; set; }

        public ProcessTotal()
        {

        }


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