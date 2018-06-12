using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models
{
    public partial class UserProcess 
    {
        public string name;
        public bool isAmo;
        protected decimal final;
        public decimal we { get; set; }
        public decimal fe { get; set; }
        public decimal no { get; set; }
        public decimal wefe { get; set; }

        private DevisFacturationEntities db = new DevisFacturationEntities();
        public UserProcess()
        {
        }

        public UserProcess(string _name, bool _isAmo)
        {
            this.name = _name;
            this.isAmo = _isAmo;
        }

        public void setFe(decimal value)
        {
            if (this.fe == default(decimal))
            {
                this.fe = value;
            }else
            {
                this.fe += value;
            }
        }
        public void setWe(decimal value)
        {
            if (this.we == default(decimal))
            {
                this.we = value;
            }
            else
            {
                this.we += value;
            }
        }
        public void setWefe(decimal value)
        {
            if (this.wefe == default(decimal))
            {
                this.wefe = value;
            }
            else
            {
                this.wefe += value;
            }
        }
        public void setNo(decimal value)
        {
            if (this.no == default(decimal))
            {
                this.no = value;
            }
            else
            {
                this.no += value;
            }
        }
    }
}