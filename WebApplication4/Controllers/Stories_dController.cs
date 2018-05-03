using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using WebApplication4.Models.BO.StoriesBO;
using Newtonsoft.Json;

namespace WebApplication4.Controllers
{
    public class Stories_dController : ApiController // stories liée a un devis
    {
        private DevisFacturationEntities db; // attribut de contexte de bd (objet qui permet de faire les requetes a la base
        // GET: api/Stories

        public Stories_dController()
        {
            this.db = new DevisFacturationEntities(); // instanciation du contexte de base donnée
        }
        public IEnumerable<WebApplication4.Models.Stories_d> Get() // renvoie tout les objet de types storiesD trouvé
        {
            try
            {
                List<WebApplication4.Models.Stories_d> st = db.Stories_d.ToList();
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
        public WebApplication4.Models.Stories_d Get(int id) // renvoie la Stories associé a son id
        {
            WebApplication4.Models.Stories_d res = this.db.Stories_d.Where(s => s.ID == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
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
        public void Post([FromBody]WebApplication4.Models.Stories_d st) // crée et ajoute a la bd un nouvel objet Stories_d
        {
            try
            {
                if (st != null)
                {
                    this.db.Stories_d.Add(st); // Ajout d'un nouvel objet dans la table
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
        public void Put(int id, [FromBody]WebApplication4.Models.Stories_d st) // Met a jour un objet Stories_d
        {
            try
            {
                if (st != null) // si l'objet source n'est pas null => update de la base
                {
                    WebApplication4.Models.Stories_d ts = db.Stories_d.Where(res => res.ID == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Stories_d.Attach(st); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    ts.Description = st.Description; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    ts.Type = st.Type; // same
                    ts.StartDate = st.StartDate; // same
                    ts.UpdatetDate = st.UpdatetDate; // same
                    ts.Owners = st.Owners;// same
                    ts.Labels = st.Labels; // same
                    ts.IsBillable = st.IsBillable;// same
                    ts.Bonus = st.Bonus;// same
                    ts.OriginalId = st.OriginalId; // same
                    ts.IsPayed = st.IsPayed; // same
                    ts.URL = st.URL; // same
                    ts.Epic = st.Epic; // same
                    ts.Fk_Project = st.Fk_Project; // same
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

        // DELETE: api/Stories_d/5
        public void Delete(int id) // supprime de la table un objet Stories_d
        {
            try // vérrif si un objet a été trouvé pour l'id
            {
                WebApplication4.Models.Stories_d ts = db.Stories_d.Where(res => res.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
                db.Stories_d.Attach(ts); // ecouter les changement de l'objet 
                db.Stories_d.Remove(ts); // remove l'objet ts
                db.SaveChanges(); // mettre a jour la table
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Pas d'objet pour cet Id"));
            }
        }

        [Route("api/Stories_d/getStructure")]
        public object getStructure()
        {
            WebApplication4.Models.BO.Stories s = new Models.BO.Stories("description", "type", new DateTime(2008, 5, 1, 8, 30, 52), new DateTime(2008, 5, 1, 8, 30, 56), "owners", "labels", true, true, false, 2555645, "url", "epic", "isAmo");
            return JsonConvert.SerializeObject(s.getStructure());
        }
    }
}
