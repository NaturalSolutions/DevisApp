using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;

namespace WebApplication4.Controllers
{
    public class StoriesController : ApiController
    {
        private Devis_Entities db; // attribut de contexte de bd (objet qui permet de faire les requetes a la base
        // GET: api/Stories

        public StoriesController()
        {
            this.db = new Devis_Entities(); // instanciation du contexte de base donnée
        }
        public IEnumerable<Stories> Get()
        {
            try
            {
                List<Stories> st = db.Stories.ToList();
                if ((!st.Any()) && (st != null)) // verification de la nullité de la liste renvoyé
                {
                    return st; // si c'est bon on renvoi la liste des taches
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

        // GET: api/Stories/5
        public Stories Get(int id)
        {
            Stories res = this.db.Stories.Where(s => s.ID == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
            if (res != null)
            {
                return res;
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "pas d'objet pour cet ID"));
            }
        }

        // POST: api/Stories
        public void Post([FromBody]Stories st)
        {
            try
            {
                if (st != null)
                {
                    this.db.Stories.Add(st); // Ajout d'un nouvel objet dans la table
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

        // PUT: api/Stories/5
        public void Put(int id, [FromBody]Stories st)
        {
            try
            {
                if (st != null) // si l'objet source n'est pas null => update de la base
                {
                    Stories ts = db.Stories.Where(res => res.ID == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Stories.Attach(st); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    ts.Description = st.Description; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    ts.Type = st.Type; // same
                    ts.StartDate = st.StartDate; // same
                    ts.UpdatetDate = st.UpdatetDate; // same
                    ts.Owners = st.Owners;// same
                    ts.Labels = st.Labels; // same
                    ts.IsBillable = st.IsBillable;// same
                    ts.Bonus = st.Bonus;// same
                    ts.OriginalId = st.OriginalId; // same
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

        // DELETE: api/Stories/5
        public void Delete(int id)
        {
            try // vérrif si un objet a été trouvé pour l'id
            {
                Stories ts = db.Stories.Where(res => res.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
                db.Stories.Attach(ts); // ecouter les changement de l'objet 
                db.Stories.Remove(ts); // remove l'objet ts
                db.SaveChanges(); // mettre a jour la table
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Pas d'objet pour cet Id"));
            }
        }
    }
}
