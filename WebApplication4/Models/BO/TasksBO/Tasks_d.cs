using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models.BO;

namespace WebApplication4.Models.BO
{
    public partial class Tasks_d : MasterTasks
    {
        private MasterTasks t;

        public Tasks_d(MasterTasks t)
        {
            this.t = t;
        }

        public Tasks_d(string description, string initials, string duration,long fk_stories) : base(description, initials, duration,fk_stories)
        {
        }
    }
}