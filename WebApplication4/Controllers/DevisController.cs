using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using WebApplication4.Models.BO;

namespace WebApplication4.Controllers
{
    public class DevisController : ApiController
    {
        private DevisFacturationEntities db;
        public DevisController()
        {
            this.db = new DevisFacturationEntities(); // interface d'appel de la bd
        }
        // GET: api/Devis
        public IEnumerable<Devis> Get() // Devra return TOUUUUT les emplacements des DEVIS existant
        {
            try
            {
                if((db.Devis.ToList() != null) && (!db.Devis.ToList().Any()))
                {
                    return db.Devis.ToList(); // TO DO Jsonifier le renvoie de la liste des devis pour pouvoir acceder aux attributs des objets
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,"liste vide")); // lance une exception si la liste est vide
                }
            }catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
            }
        }

        // GET: api/Devis/5
        public Devis Get(int id) //Devra return l'emmplacement d'un DEVIS existant en particulier
        {
            if(db.Devis.Where(res => res.ID == id).FirstOrDefault() != null)
            {
                return db.Devis.Where(res => res.ID == id).FirstOrDefault(); // return l'objet Devis jsonifier
            }else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Pas d'objet pour cet ID")); // lance une exception si il n'y a pas d'objet pour l'id visé
            }
            
        }

        // POST: api/Devis
        public void Post([FromBody] GeneralObject genObjec_d) // DEVRA CREER UN DEVIS 
        { // recup informations envoyer PUIIIS fabrique WORD et met son emplacement dans la bd 
            try
            {
                if(genObjec_d != null)
                {
                    List<string> NomProjet = new List<string>(); // liste contenant tout les nom de projets
                    List<string> DescriptionProjet = new List<string>(); // liste contenant toutes les descrîption projet
                    foreach(WebApplication4.Models.BO.Projet p in genObjec_d.projets) // Parcours de tout les projets et ajout de leur informations dans des listes 
                    {
                        NomProjet.Add(p.Nom);
                        DescriptionProjet.Add(p.Description);
                    }
                    // Parcours et découpage de l'objet et on récupère aussi les info nécessaire a la creation des objet d'apres
                    //db.Devis.Add(EnormeObjetyaToutDedans); 
                    db.SaveChanges();
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,"Objet source null")); //lance exception si objet source est nulle
                }
            }
            catch(Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound,e.Message)); //lance exception si un attribut dans l'objet est nulle
            }
        }

        // PUT: api/Devis/5
        public void Put(int id, [FromBody]Devis value) // Update un DEVIS
        {
            try
            {
                if(value != null)
                {
                    Devis res = db.Devis.Where(s => s.ID == id).FirstOrDefault();
                    db.Devis.Attach(res); // ecouteur de chamgement de l'objet
                    res.Mois = value.Mois;  // changement de valeur des attributs
                    res.Montant = value.Montant; // same
                    res.Numéro = value.Numéro; // same
                    res.Filename = value.Filename; // same
                    res.Date = value.Date; // same
                    db.SaveChanges(); // mise a joue de la table
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "Objet source null"));
                }
                
            }
            catch(Exception e)
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
