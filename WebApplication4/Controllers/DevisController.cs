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
using System.Web;
using System.IO;

namespace WebApplication4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class DevisController : ApiController
    {
        private DevisFacturationEntities db;
        public DevisController()
        {
            this.db = new DevisFacturationEntities(); // interface d'appel de la bd
            db.Configuration.LazyLoadingEnabled = false;
        }
        // GET: api/Devis
        public List<Devis> Get() 
        {
            if (db.Devis.ToList() != null)
            {
               return db.Devis.ToList(); 
            }
            else
            {
                return null;
            }
        }

        // GET: api/Devis/5
        public Devis Get(int id) //Devra return l'emmplacement d'un DEVIS existant en particulier
        {
            if (db.Devis.Where(res => res.ID == id).FirstOrDefault() != null)
            {
                return db.Devis.Where(res => res.ID == id).FirstOrDefault(); // return l'objet Devis jsonifier
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Pas d'objet pour cet ID")); // lance une exception si il n'y a pas d'objet pour l'id visé
            }

        }

        //[EnableCors(origins: "*", headers: "*", methods: "*")]
        // POST: api/Devis
        public HttpResponseMessage Post( [FromBody]object genObjec_d) // DEVRA CREER UN DEVIS 
        { // recup informations envoyer PUIIIS fabrique WORD et met son emplacement dans la bd 
            //try
            //{

                //HttpContent requestContent = Request.Content;
                //string jsonContent = requestContent.ReadAsStringAsync().Result;

                //JObject job = JObject.Parse(genObjec_d);
                //var request = HttpContext.Current.Request;
                //HttpResponseMessage result = null;
                var jsonstring = genObjec_d.ToString();
                GeneralObject newGenObject = JsonConvert.DeserializeObject<GeneralObject>(jsonstring);
                foreach (Projet p in newGenObject.projets)
                {
                    p.découpageStories.Add("B", new List<MasterStories>());
                    p.découpageStories.Add("PR", new List<MasterStories>());
                    p.découpageStories.Add("PNR", new List<MasterStories>());
                    foreach (MasterStories s in p.Stories)
                    {
                        if ((bool)s.Bonus)
                        {
                            p.découpageStories["B"].Add(s);
                        }
                        else if (s.nonEffetue)
                        {
                            p.découpageStories["PNR"].Add(s);
                        }
                        else
                        {
                            p.découpageStories["PR"].Add(s);
                        }
                    }
                }
            //GeneralObject genTest = CreateATestingContext();
                Calculator devisCalculator = new Calculator(newGenObject);
                SumManager resultFromcallCalculator = devisCalculator.CalculateFactu();
                Devis devis = new Devis();
                FileFiller filler = new FileFiller(devis,false,resultFromcallCalculator,newGenObject);

                newGenObject.SaveToDb(false,devis);
                return new HttpResponseMessage(HttpStatusCode.Accepted);
            //}
            //catch (Exception e)
            //{
            //    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e.Message)); //lance exception si y'a eu un problème
            //    //return new HttpResponseMessage(HttpStatusCode.InternalServerError);
            //}
        }

        // PUT: api/Devis/5
        public void Put(int id, [FromBody]Devis value) // Update un DEVIS
        {
            try
            {
                if (value != null)
                {
                    Devis res = db.Devis.Where(s => s.ID == id).FirstOrDefault();
                    db.Devis.Attach(res); // ecouteur de chamgement de l'objet
                    res.Mois = value.Mois;  // changement de valeur des attributs
                    res.Montant = value.Montant; // same
                    res.Commande = value.Commande; // same
                    res.Filename = value.Filename; // same
                    res.Date = value.Date; // same
                    db.SaveChanges(); // mise a joue de la table
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Objet source null"));
                }

            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }

        // DELETE: api/Devis/5
        public void Delete(int id)  // Devra supprimer un DEVIS
        {
            try
            {
                Devis devis = db.Devis.Where(s => s.ID == id).FirstOrDefault();
                db.Devis.Attach(devis);
                db.Devis.Remove(devis); // je remove l'objet associé à l'id visé
                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }
    }
}
