using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication4.Models.BO.StoriesBO
{
    public partial class Stories_d : MasterStories
    {
        public Stories_d(string description, string type, DateTime depart, DateTime maj, string owners, string labels, bool billable, bool isPayed, bool bonus, long originalID, string url, string epic, string isAmo, long fkprojet) : base(description, type, depart, maj, owners, labels, billable, isPayed, bonus, originalID, url, epic, isAmo,fkprojet)
        {
        }
    }
}