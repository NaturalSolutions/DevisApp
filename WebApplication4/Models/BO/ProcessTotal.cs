using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models;

namespace WebApplication4.Models.BO
{
    public class ProcessTotal
    {
        public List<Process> amo { get; set; }
        public List<Process> dev { get; set; }
        public List<Process> des { get; set; }

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