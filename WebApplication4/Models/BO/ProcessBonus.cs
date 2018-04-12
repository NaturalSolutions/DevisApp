using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models;

namespace WebApplication4.Models.BO
{
    public class ProcessBonus
    {
        public ProcessTotal normal { get; set; }
        public ProcessTotal bonus { get; set; }
        public ProcessBonus()
        {

        }

        public void updateValue()
        {
            if (normal != null)
            {
                normal.updateValue();
            }
            if (bonus != null)
            {
                bonus.updateValue();
            }
        }

    }
}