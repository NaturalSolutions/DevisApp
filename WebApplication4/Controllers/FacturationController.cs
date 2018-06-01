using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using WebApplication4.Models;
using WebApplication4.Models.BO;
using System.Web.Http.Cors;

namespace WebApplication4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class FacturationController : ApiController
    {
        private DevisFacturationEntities db;
        public FacturationController()
        {
            this.db = new DevisFacturationEntities(); // interface avec la bd
        }


        // GET: api/Facturation
        public IEnumerable<Facturation> Get()
        {
            try
            {
                List<Facturation> factus = db.Facturation.ToList();
                if ((!factus.Any()) && (factus != null)) // verification de la nullité de la liste renvoyé
                {
                    return factus; // si c'est bon on renvoi la liste des taches
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Aucun élément dans la liste"));
                }
            }
            catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }

        // GET: api/Facturation/5
        public Facturation Get(int id)
        {
            Facturation res = this.db.Facturation.Where(s => s.ID == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
            if (res != null)
            {
                return res;
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "pas d'objet pour cet ID"));
            }
        }

        // POST: api/Facturation
        public void Post([FromBody] GeneralObject genObject)
        {
            try
            {
                if (genObject != null)
                {
                   // pas trop vite garçon this.db.Facturation.Add(genObject); // Ajout d'un nouvel objet dans la table
                   // this.db.SaveChanges(); // mise a jour de la table
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Objet source null"));
                }
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e.Message));
            }
        }

        // PUT: api/Facturation/5
        public void Put(int id, [FromBody]Facturation factu)
        {
            try
            {
                if (factu != null) // si l'objet source n'est pas null => update de la base
                {
                    Facturation ts = db.Facturation.Where(res => res.ID == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Facturation.Attach(ts); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    ts.Numéro = factu.Numéro; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    ts.Mois = factu.Mois; // same
                    ts.Montant = factu.Montant; // same
                    ts.FK_Devis = factu.FK_Devis; // same
                    ts.Date = factu.Date; // same
                    ts.Filename = factu.Filename; // same
                    db.SaveChanges(); // mise a jour de la table
                }
                else // sinon je throw une exception
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "l'objet source est vide"));
                }

            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e.Message));
            }
        }

        // DELETE: api/Facturation/5
        public void Delete(int id)
        {
            try // vérrif si un objet a été trouvé pour l'id
            {
                Facturation ts = db.Facturation.Where(res => res.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
                db.Facturation.Attach(ts); // ecouter les changement de l'objet 
                db.Facturation.Remove(ts); // remove l'objet ts
                db.SaveChanges(); // mettre a jour la table
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Pas d'objet pour cet Id"));
            }
        }

        [ActionName("factu")]
        public string GetFactu(ProcessTotal laFactu)
        {
            laFactu.updateValue();
            return JsonConvert.SerializeObject(laFactu);
        }

        [ActionName("postfactu")]
        public string PostFactu(ProcessTotal laFactu)
        {
            laFactu.updateValue();
            return JsonConvert.SerializeObject(laFactu);
        }

        [ActionName("postfactuWBonus")]
        public string PostFactuWBOnus(ProcessBonus lesFactus)
        {
            //FacturationWBonus result = new FacturationWBonus();
            if (lesFactus != null)
            {
                lesFactus.updateValue();
            }
            return JsonConvert.SerializeObject(lesFactus);
        }
    }
}
