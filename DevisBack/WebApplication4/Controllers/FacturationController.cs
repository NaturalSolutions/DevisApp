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
using WebApplication4.Models.BO.ProcessFiles;
using System.IO;
using System.Net.Http.Headers;
using System.Text;

namespace WebApplication4.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class FacturationController : ApiController
    {
        private DevisFacturationEntities db;
        public FacturationController()
        {
            this.db = new DevisFacturationEntities(); // interface avec la bd
            db.Configuration.LazyLoadingEnabled = false;
        }


        // GET: api/Facturation
        public List<Facturation> Get()
        {
            List<Facturation> datas;

            if ((datas = db.Facturation.ToList()) != null)
            {
                return datas;
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, "liste vide")); // lance une exception si la liste est vide
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
        public void Post(object genObjec_f)
        {
            var stringed = genObjec_f.ToString();
            GeneralObject newGenObject = JsonConvert.DeserializeObject<GeneralObject>(stringed);
            foreach(Projet p in newGenObject.projets)
            {
                //Stories Bonus
                p.découpageStories.Add("B", new List<MasterStories>());
                //Stories PrévueRéalisé
                p.découpageStories.Add("PR", new List<MasterStories>());
                //Prévu non Réalisé
                p.découpageStories.Add("PNR", new List<MasterStories>());
                foreach(MasterStories s in p.Stories)
                {
                    if ((bool)s.Bonus)
                    {
                        p.découpageStories["B"].Add(s);
                    }
                    else if(s.nonEffetue)
                    {
                        p.découpageStories["PNR"].Add(s);
                    }
                    else
                    {
                        p.découpageStories["PR"].Add(s);
                    }
                }
            }
            Calculator devisCalculator = new Calculator(newGenObject);
            //DevisCalculator devisCalculator = new DevisCalculator(genObjec_d);
            SumManager resultFromcallCalculator = devisCalculator.CalculateFactu();
            Facturation facturation = new Facturation();
            FileFiller filler = new FileFiller(facturation, true, resultFromcallCalculator, newGenObject, devisCalculator.logs);
            //StreamWriter logFile = new StreamWriter(System.AppDomain.CurrentDomain.BaseDirectory + @"\Content\test.txt");
            //logFile.WriteLine("je suis juste un petit fichier de test qui va me permettre de savoir si j'arriva a renvoyer des fichiers au clients");
            //logFile.Close();
          //  DateTime longDate = DateTime.Now;
            //var path = System.AppDomain.CurrentDomain.BaseDirectory + @"\Content\Devis" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + @"\" + "Etat_des_lieux_VS_Devis_initial_All_NS_Reneco_" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + ".docx";
            //HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            //var stream = new FileStream(path, FileMode.Open);
            //result.Content = new StreamContent(stream);
            //result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            //result.Content.Headers.ContentDisposition.FileName = Path.GetFileName(path);
            //result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            //result.Content.Headers.ContentLength = stream.Length;

           // string strdocPath;
            //strdocPath = System.AppDomain.CurrentDomain.BaseDirectory + @"\Content\Devis" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + @"\Calcul" + ".txt";
           // strdocPath = System.AppDomain.CurrentDomain.BaseDirectory + @"\Content\Devis" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + @"\" + "Etat_des_lieux_VS_Devis_initial_All_NS_Reneco_" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + ".docx";

            //FileStream objfilestream = new FileStream(strdocPath, FileMode.Open, FileAccess.Read);
            //int len = (int)objfilestream.Length;
           // Byte[] documentcontents = File.ReadAllBytes(strdocPath);
           // objfilestream.Read(documentcontents, 0, len);
           // objfilestream.Close();

            //string stringFile = Convert.ToBase64String(documentcontents);

            //HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, "value");
            //response.Content = new StringContent(stringFile, Encoding.UTF8);
            //response.Content = new StringContent(stringFile);
            //response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

            //return response;
            newGenObject.SaveToDb(true, facturation);
            //return new HttpResponseMessage(HttpStatusCode.Accepted);
            //}
            //catch (Exception e)
            //{
            //    throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NotFound, e.Message)); //lance exception si un attribut dans l'objet est nulle
            //}
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
                    ts.Commande= factu.Commande; // changement des différents attribut de l'objet pointé avec les attributs de l'objet pris en paramètre
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

        //[ActionName("factu")]
        //public string GetFactu(ProcessTotal laFactu)
        //{
        //    laFactu.updateValue();
        //    return JsonConvert.SerializeObject(laFactu);
        //}

        //[ActionName("postfactu")]
        //public string PostFactu(ProcessTotal laFactu)
        //{
        //    laFactu.updateValue();
        //    return JsonConvert.SerializeObject(laFactu);
        //}

        //[ActionName("postfactuWBonus")]
        //public string PostFactuWBOnus(ProcessBonus lesFactus)
        //{
        //    //FacturationWBonus result = new FacturationWBonus();
        //    if (lesFactus != null)
        //    {
        //        lesFactus.updateValue();
        //    }
        //    return JsonConvert.SerializeObject(lesFactus);
        //}
    }
}
