using System;
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
    public class ProjetController : ApiController
    {
        private DevisFacturationEntities db; // attribut de contexte de bd (objet qui permet de faire les requetes a la base
        // GET: api/Stories

        public ProjetController()
        {
            this.db = new DevisFacturationEntities(); // instanciation du contexte de base donnée
        }
        public IEnumerable<WebApplication4.Models.Projet> Get()
        {
            try
            {
                List<WebApplication4.Models.Projet> st = db.Projet.ToList();
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
        public WebApplication4.Models.Projet Get(int id)
        {
            WebApplication4.Models.Projet res = this.db.Projet.Where(s => s.Id == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
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
        public void Post([FromBody]WebApplication4.Models.Projet st)
        {
            try
            {
                if (st != null)
                {
                    this.db.Projet.Add(st); // Ajout d'un nouvel objet dans la table
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
        public void Put(int id, [FromBody]WebApplication4.Models.Projet st)
        {
            try
            {
                if (st != null) // si l'objet source n'est pas null => update de la base
                {
                    WebApplication4.Models.Projet ts = db.Projet.Where(res => res.Id == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Projet.Attach(st); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    ts.Description = st.Description; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    ts.Nom = st.Nom; // same
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
                WebApplication4.Models.Projet ts = db.Projet.Where(res => res.Id == id).FirstOrDefault(); // récupération de la tache pointé par l'id
                db.Projet.Attach(ts); // ecouter les changement de l'objet 
                db.Projet.Remove(ts); // remove l'objet ts
                db.SaveChanges(); // mettre a jour la table
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Pas d'objet pour cet Id"));
            }
        }

        [Route("api/Projet/getStructure")]
        public object getStructure()
        {
            WebApplication4.Models.BO.Projet p = new WebApplication4.Models.BO.Projet("description","nom");
            return JsonConvert.SerializeObject(p.getStructure());
        }
    }
}
