using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using WebApplication4.Models.BO;
using Newtonsoft.Json;
using System.Web.Http.Cors;

namespace WebApplication4.Controllers // Ca devrait pas Etre un Controller mais on verra ça apres
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class WorldFileController : ApiController
    {
        [ActionName("createDevis")]
        public string PostCreateDevis(List<GeneralObject> docInfos)
        {
            //WordFileGenerator test = new WordFileGenerator(docInfos);
            return "dd"; //JsonConvert.SerializeObject(test);
        }

        [ActionName("createFactu")]
        public string PostCreateFactu(FactuConstante docInfos)
        {
            //WordFileGenerator test = new WordFileGenerator(docInfos, true);
            return ""; //JsonConvert.SerializeObject(test);
        }
    }
}
