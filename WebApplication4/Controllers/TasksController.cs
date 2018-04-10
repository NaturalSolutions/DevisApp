﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;

namespace WebApplication4.Controllers
{
    public class TasksController : ApiController
    {
        // GET: api/Tasks
        private Devis_Entities db; // attribut de contexte de bd (objet qui permet de faire les requetes a la base

        public TasksController()
        {
            this.db = new Devis_Entities(); // instanciation du contexte de base donnée
        }

        public IEnumerable<Tasks> Get()
        {
            try
            {
                List<Tasks> ts = db.Tasks.ToList();
                if ((!ts.Any()) && (ts != null)) // verification de la nullité de la liste renvoyé
                {
                    return ts; // si c'est bon on renvoi la liste des taches
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,"Aucun élément dans la liste"));
                }
            }
            catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,e.Message));
            }
        }

        // GET: api/Tasks/5
        public Tasks Get(int id)
        {
            Tasks res = this.db.Tasks.Where(s => s.ID == id).FirstOrDefault();   // renvoi l'objet pointé par l'id pris en paramètre      
            if(res != null)
            {
                return res;
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "pas d'objet pour cet ID"));
            }
        }

        // POST: api/Tasks
        public void Post([FromBody]Tasks tsk) // route d'envoi d'un nouvel objet dans la table en POST
        {
            try
            {
                if (tsk != null)
                {
                    this.db.Tasks.Add(tsk); // Ajout d'un nouvel objet dans la table
                    this.db.SaveChanges(); // mise a jour de la table
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Objet source null"));
                }
            }
            catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError,e.Message));
            }
        }

        // PUT: api/Tasks/5
        public void Put(int id, [FromBody]Tasks tsk)
        {
            try
            {
                if(tsk != null) // si l'objet source n'est pas null => update de la base
                {
                    Tasks ts = db.Tasks.Where(res => res.ID == id).FirstOrDefault(); // recuperer la tache pointé par l'id pris en paramètre de la fonction
                    db.Tasks.Attach(ts); // Faire ecouter le contexte de base de donnée sur les changements de l'objet ts 
                    ts.Description = tsk.Description; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
                    ts.Duration = tsk.Duration; // same
                    ts.Initials = tsk.Initials; // same
                    ts.IsInSprint = tsk.IsInSprint; // same
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
        public void Delete(int id)
        {
            try // vérrif si un objet a été trouvé pour l'id
            {
                Tasks ts = db.Tasks.Where(res => res.ID == id).FirstOrDefault(); // récupération de la tache pointé par l'id
                db.Tasks.Attach(ts); // ecouter les changement de l'objet 
                db.Tasks.Remove(ts); // remove l'objet ts
                db.SaveChanges(); // mettre a jour la table
            }
            catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Pas d'objet pour cet Id"));
            }
        }
    }
}
