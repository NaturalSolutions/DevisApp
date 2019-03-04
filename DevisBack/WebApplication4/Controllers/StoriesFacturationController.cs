using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using System.Web.Http.Cors;

namespace WebApplication4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class StoriesFacturationController : ApiController // obket de liaison entre stories et Facturation
    {
        // GET: api/Tasks
        private DevisFacturationEntities db; // attribut de contexte de bd (objet qui permet de faire les requetes a la base

        public StoriesFacturationController()
        {
            this.db = new DevisFacturationEntities(); // instanciation du contexte de base donnée
        }

        // GET: api/StoriesDevis
        public IEnumerable<Stories_Facturation> Get() // renvoie tout les objet StoriesFacturation 
        {
            try
            {
                List<Stories_Facturation> ts = db.Stories_Facturation.ToList();
                if ((!ts.Any()) && (ts != null)) // verification de la nullité de la liste renvoyé
                {
                    return ts; // si c'est bon on renvoi la liste des taches
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Aucun élément dans la liste"));
                }
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }

        // GET: api/StoriesDevis/5
        public Stories_Facturation Get(int id) // renvoie la StoriesFacturation d'id ID
        {
            Stories_Facturation res = this.db.Stories_Facturation.Where(s => s.ID == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
            if (res != null)
            {
                return res;
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "pas d'objet pour cet ID"));
            }
        }

        // POST: api/StoriesDevis
        public void Post([FromBody]Stories_Facturation tsk) // creer et ajoute un nouvel objet StoriesFacturation
        {
            try
            {
                if (tsk != null)
                {
                    this.db.Stories_Facturation.Add(tsk); // Ajout d'un nouvel objet dans la table
                    this.db.SaveChanges(); // mise a jour de la table
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

        // PUT: api/StoriesDevis/5
        public void Put(int id, [FromBody]Stories_Facturation tsk) // met a jour un objet StoriesFacturation
        {
            try
            {
                if (tsk != null) // si l'objet source n'est pas null => update de la base
                {
                    Stories_Facturation ts = db.Stories_Facturation.Where(res => res.ID == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Stories_Facturation.Attach(ts); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    ts.FK_Stories_f = tsk.FK_Stories_f; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    ts.FK_Facturation = tsk.FK_Facturation; // same
                    ts.CreationDate = tsk.CreationDate; // same
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

        // DELETE: api/StoriesDevis/5
        public void Delete(int id) // Détruit un objet StoriesFacturation
        {
            try // vérrif si un objet a été trouvé pour l'id
            {
                Stories_Facturation ts = db.Stories_Facturation.Where(res => res.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
                db.Stories_Facturation.Attach(ts); // ecouter les changement de l'objet 
                db.Stories_Facturation.Remove(ts); // remove l'objet ts
                db.SaveChanges(); // mettre a jour la table
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Pas d'objet pour cet Id"));
            }
        }
    }
}
