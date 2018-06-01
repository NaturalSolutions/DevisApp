using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using Newtonsoft.Json;
using System.Web.Http.Cors;

namespace WebApplication4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class Tasks_fController : ApiController // Tache lié aux Facturations
    {
        // GET: api/Tasks
        private DevisFacturationEntities db; // attribut de contexte de bd (objet qui permet de faire les requetes a la base

        public Tasks_fController()
        {
            this.db = new DevisFacturationEntities(); // instanciation du contexte de base donnée
        }

        public IEnumerable<Tasks_f> Get() // renvoie toute les taches lié aux Facturation 
        {
            try
            {
                List<Tasks_f> ts = db.Tasks_f.ToList();
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

        // GET: api/Tasks/5
        public Tasks_f Get(int id) // renvoie la tacheFacturation correspondant a L'id
        {
            Tasks_f res = this.db.Tasks_f.Where(s => s.ID == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
            if (res != null)
            {
                return res;
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "pas d'objet pour cet ID"));
            }
        }

        // POST: api/Tasks
        public void Post([FromBody]Tasks_f tsk) // Création et ajout d'une nouvelle tacheFacturation dans la BD
        {
            try
            {
                if (tsk != null)
                {
                    this.db.Tasks_f.Add(tsk); // Ajout d'un nouvel objet dans la table
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

        // PUT: api/Tasks/5
        public void Put(int id, [FromBody]Tasks_f tsk) // update une Tache Facturation
        {
            try
            {
                if (tsk != null) // si l'objet source n'est pas null => update de la base
                {
                    Tasks_f ts = db.Tasks_f.Where(res => res.ID == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Tasks_f.Attach(ts); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    ts.Description = tsk.Description; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    ts.Duration = tsk.Duration; // same
                    ts.Initials = tsk.Initials; // same
                    ts.Fk_Ressource_Initials = tsk.Fk_Ressource_Initials; // same
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

        // DELETE: api/Tasks/5
        public void Delete(int id) // Détruit une Tache Facturation
        {
            try // vérrif si un objet a été trouvé pour l'id
            {
                Tasks_f ts = db.Tasks_f.Where(res => res.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
                db.Tasks_f.Attach(ts); // ecouter les changement de l'objet 
                db.Tasks_f.Remove(ts); // remove l'objet ts
                db.SaveChanges(); // mettre a jour la table
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Pas d'objet pour cet Id"));
            }
        }

        [Route("api/Tasks_f/getStructure")]
        public object getStructure()
        {
            MasterTasks t = new MasterTasks("description", "initials", "45",45646);
            return JsonConvert.SerializeObject(t.getStructure());
        }
    }
}
