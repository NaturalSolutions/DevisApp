﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using WebApplication4.Models.BO;
using Newtonsoft.Json;

namespace WebApplication4.Controllers
{
    public class WorldFileController : ApiController
    {
        [ActionName("createDevis")]
        public string PostCreateDevis(List<GeneralProject> docInfos)
        {
            WordFileGenerator test = new WordFileGenerator(docInfos);
            return JsonConvert.SerializeObject(test);
        }

        [ActionName("createFactu")]
        public string PostCreateFactu(FactuConstante docInfos)
        {
            WordFileGenerator test = new WordFileGenerator(docInfos, true);
            return JsonConvert.SerializeObject(test);
        }
    }
}