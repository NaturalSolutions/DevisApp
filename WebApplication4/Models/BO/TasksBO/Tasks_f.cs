using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication4.Models.BO;

namespace WebApplication4.Models.BO
{
    public partial class Tasks_f : Tasks
    {
        public Tasks_f(string description, string initials, int duration) : base(description, initials, duration)
        {
        }
    }
}