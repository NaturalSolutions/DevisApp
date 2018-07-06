using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using WebApplication4.Models.BO;
using WebApplication4.Models.BO.ProcessFiles;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.Http.Cors;

namespace WebApplication4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ParametresController : ApiController
    {
        private DevisFacturationEntities db;
        public ParametresController()
        {
            this.db = new DevisFacturationEntities(); // interface d'appel de la bd
        }
        // GET: api/Parametres
        public Paramètres Get() // Devra return TOUUUUT les emplacements des DEVIS existant
        {
            Paramètres param = db.Paramètres.Where(p => p.ID == 1).FirstOrDefault();
            return param;
        }

        // GET: api/Parametres/5
        public List<string> Get(int id) //Devra return l'emmplacement d'un DEVIS existant en particulier
        {
            return new List<string>();
        }

        // POST: api/Parametres
        public HttpResponseMessage Post(object genObjec_d) // DEVRA CREER UN DEVIS 
        { // recup informations envoyer PUIIIS fabrique WORD et met son emplacement dans la bd 
            return new HttpResponseMessage();
        }

        // PUT: api/Parametres/5
        public void Put(int id, [FromBody]Devis value) // Update un DEVIS
        {
        }

        // DELETE: api/Parametres/5
        public void Delete(int id)  // Devra supprimer un DEVIS
        {          
        }
    }
}
