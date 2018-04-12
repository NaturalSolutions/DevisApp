using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models;

namespace WebApplication4.Models.BO
{
    public class FacturationBonus
    {
        public FacturationTotale normal { get; set; }
        public FacturationTotale bonus { get; set; }
        public FacturationBonus()
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