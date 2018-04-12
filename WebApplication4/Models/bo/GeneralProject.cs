using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO
{
    public class GeneralProject
    {
        public string projet { get; set; }
        public Dictionary<string, List<string>> stories { get; set; }
        public Dictionary<string, List<string>> storiesBonus { get; set; }
        public int total { get; set; }
        public int totalBonus { get; set; }
        public Dictionary<string, List<string>> unfinished { get; set; }
    }
}