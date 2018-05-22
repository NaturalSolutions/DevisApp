using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication4.Models;
using WebApplication4.Models.BO;
using WebApplication4.Models.BO.DevisProcess;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
                if ((db.Devis.ToList() != null) && (!db.Devis.ToList().Any()))
                {
                    return db.Devis.ToList(); // TO DO Jsonifier le renvoie de la liste des devis pour pouvoir acceder aux attributs des objets
                }
                else
                {
                    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "liste vide")); // lance une exception si la liste est vide
                }
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message));
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

        //public GeneralObject CreateATestingContext()
        //{
        //  //  Tasks taskTest = new Tasks();
        //  //  taskTest.Description = "une tache de merde bien chiante";
        //  //  taskTest.Duration = 2;
        //  //  taskTest.Initials = "TL";
        //  //  List<Tasks> TasksTest = new List<Tasks>();
        //  //  TasksTest.Add(taskTest);

        //    // LA TACHE

        //    //MasterStories storyTest = new MasterStories();
        //   // storyTest.Type = "DEV";
        //   // storyTest.Tasks = TasksTest;
        //    List<MasterStories> storiesTest = new List<MasterStories>();
        //    //   storiesTest.Add(storyTest);

        //    // WebApplication4.Models.BO.Projet projetTest = new WebApplication4.Models.BO.Projet();
        //    //projetTest.Nom = "nom Test";

        //    //projetTest.MasterStories = storiesTest;
        //    List<WebApplication4.Models.BO.Projet> projetsTest = new List<WebApplication4.Models.BO.Projet>();
        //    //projetsTest.Add(projetTest);
         
        //    GeneralObject myTestGenObject = new GeneralObject();
        //    myTestGenObject.projets = projetsTest;

        //    return myTestGenObject;
        //}

        // POST: api/Devis
        public void Post( object genObjec_d) // DEVRA CREER UN DEVIS 
        { // recup informations envoyer PUIIIS fabrique WORD et met son emplacement dans la bd 
            try
            {
                //JObject job = JObject.Parse(genObjec_d);

                var escouilles = genObjec_d.ToString();
                GeneralObject test = JsonConvert.DeserializeObject<GeneralObject>(escouilles);
                //GeneralObject genTest = CreateATestingContext();
                DevisCalculator devisCalculator = new DevisCalculator(test);
                //DevisCalculator devisCalculator = new DevisCalculator(genObjec_d);
                DevisSumManager resultFromcallCalculator = devisCalculator.CalculateDevis();


                foreach (Projet p in test.projets)
                {
                    foreach (MasterStories s in p.Stories)
                    {
                        foreach (MasterTasks t in s.Tasks)
                        {

                        }

                    }
                }
                //db.Devis.Add(EnormeObjetyaToutDedans); 
                //db.SaveChanges();
            }
            catch (Exception e)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message)); //lance exception si un attribut dans l'objet est nulle
            }
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
