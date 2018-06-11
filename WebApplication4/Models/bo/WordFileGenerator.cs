using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.Entity;
using System.Diagnostics;
using Xceed.Words.NET;
using System.Reflection;
using Newtonsoft.Json.Linq;
using System.IO;
using WebApplication4.Models.BO.Process;


namespace WebApplication4.Models.BO
{
    public class WordFileGenerator
    {

        DocX final { get; set; }
        decimal tableSubTotal { get; set; }
        decimal tableSubTotalBonus { get; set; }
        string basePath { get; set; }
        public string fileName { get; set; }
        public bool isFactu { get; set; }
        public byte[] encoded { get; set; }

        //public WordFileGenerator(FactuConstante obj, bool isFactu = false)
        //{
        //    DateTime longDate = DateTime.Now;
        //    this.isFactu = isFactu;
        //    this.basePath = System.AppDomain.CurrentDomain.BaseDirectory;
        //    this.tableSubTotal = 0;
        //    this.tableSubTotalBonus = 0;
        //    if (isFactu)
        //    {
        //        this.fileName = "Etat_des_lieux_VS_Devis_initial_All_NS_Reneco_" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + ".docx";
        //    }
        //    else
        //    {

        //        this.fileName = "Devis_All_NS_Reneco_" + longDate.Year.ToString() + "_" + longDate.AddMonths(1).Month + ".docx";
        //    }
        //    obj.chefProjet.updateValue();
        //    obj.directeur.updateValue();
        //    this.final = loadTemplate();
        //    setValue("dateCreation", longDate.ToShortDateString());
        //    //     manageDevisTable(obj.projet);
        //    insertElementsInFiles(obj.chefProjet.sum, obj.directeur.sum);
        //    //Save template to a new name same location
        //    //TODO : convenir d'une convention de nommage 
        //    this.final.SaveAs(this.basePath + @"\Content\" + this.fileName);
        //    this.encoded = File.ReadAllBytes(this.basePath + @"\Content\" + this.fileName);
        //}

        public WordFileGenerator(GeneralObject obj,SumManager sumManager,Devis devis, bool isFactu = false)
        {
            DateTime longDate = DateTime.Now;
            this.isFactu = isFactu;
            this.basePath = System.AppDomain.CurrentDomain.BaseDirectory;
            this.tableSubTotal = 0;
            this.tableSubTotalBonus = 0;
            if (isFactu)
            {
                this.fileName = "Etat_des_lieux_VS_Devis_initial_All_NS_Reneco_" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + ".docx";
            }
            else
            {
                this.fileName = "Devis_All_NS_Reneco_" + longDate.Year.ToString() + "_" + longDate.AddMonths(1).Month + ".docx";
            }
            this.final = loadTemplate();
            setValue("dateCreation", longDate.ToShortDateString());
            manageDevisTable(obj, sumManager);
            insertElementsInFiles(devis);
            this.final.SaveAs(this.basePath + @"\Content\Devis" + longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + @"\" + this.fileName);
            this.encoded = File.ReadAllBytes(this.basePath + @"\Content\Devis"+ longDate.Year.ToString() + "_" + longDate.AddMonths(-1).Month + @"\" + this.fileName);
            DevisFacturationEntities db = new DevisFacturationEntities();
            devis.Filename = this.fileName;
            devis.Date = DateTime.Now;

            db.Devis.Add(devis);
            db.SaveChanges();
        }

        private DocX loadTemplate()
        {
            string fileName;
            if (this.isFactu)
            {
                fileName = this.basePath + @"\Content\templateFacturePropre.docx";
            }
            else
            {
                fileName = this.basePath + @"\Content\templateDevisPropre.docx";
            }
            DocX temp = DocX.Load(fileName);
            //LoadFile in memory
            return temp;
        }

        private void setValue(string balise, string toSet)
        {
            this.final.ReplaceText("[" + balise + "]", toSet);
        }

        private void insertElementsInFiles(Devis devis,decimal? tarCDP = null, decimal? tarDT = null)
        {
            DevisElements infos = new DevisElements(this.fileName, this.tableSubTotal + this.tableSubTotalBonus, isFactu, tarCDP, tarDT);
            JObject json = JObject.FromObject(infos);
            foreach (JProperty property in json.Properties())
            {
                setValue(property.Name, property.Value.ToString());
            }
            devis.Montant = infos.totalCumule;
        }

          private void manageDevisTable(GeneralObject obj,SumManager sumManager)
          {
          Table tab = this.final.Tables[2];

           Row templateToCopy = tab.Rows[1];
            foreach (Projet projet in obj.projets)
            {
                if (projet.Stories != null)
                {
                    Row toAdd = tab.InsertRow(tab.RowCount - 2);
                    //project
                    toAdd.Cells[0].InsertParagraph(projet.Nom);
                    List bulletedList = null;
                    //stories
                    if(projet.Stories.Count > 0)
                    {
                        foreach (MasterStories story in projet.Stories)
                        {
                            if (bulletedList == null)
                            {
                                bulletedList = this.final.AddList(story.Description, 0, ListItemType.Bulleted, 1);
                            }
                            else
                            {
                                this.final.AddListItem(bulletedList, story.Description);
                            }
                        }
                        toAdd.Cells[1].InsertList(bulletedList);
                        //Cout
                        toAdd.Cells[2].InsertParagraph((decimal)sumManager.getProjectCost(projet.Nom).ToString() + "€");
                    }
                }
                this.tableSubTotal += (decimal) sumManager.getProjectCost(projet.Nom);
            }            
            tab.Rows[tab.RowCount - 1].Cells[1].ReplaceText("[totalTable]", this.tableSubTotal.ToString());

            if (this.isFactu)
            {
                Dictionary<string, decimal?> truc = (Dictionary<string, decimal?>)sumManager.getProjectCost("test");
               // Table tabBonus = this.final.Tables[3];
               // Table tabUnfinished = this.final.Tables[4];
               // Row ToCopy = tab.Rows[1];
               // foreach (Projet insert in obj.projets)
               // {
               //     if (insert.Stories != null && insert.StoriesBonus.Values.Count > 0 && insert.storiesBonus.Keys.Count > 0)
               //     {
               //         Row toAdd = tabBonus.InsertRow(tabBonus.RowCount - 2);
               //         //project
               //         toAdd.Cells[0].InsertParagraph(insert.projet);
               //         List bulletedList = null;
               //         //stories
               //         foreach (string story in insert.storiesBonus.Keys)
               //         {
               //             if (bulletedList == null)
               //             {
               //                 bulletedList = this.final.AddList(story, 0, ListItemType.Bulleted, 1);
               //             }
               //             else
               //             {
               //                 this.final.AddListItem(bulletedList, story);
               //             }
               //         }
               //         toAdd.Cells[1].InsertList(bulletedList);
               //         //Cout
               //         toAdd.Cells[2].InsertParagraph(insert.totalBonus.ToString() + "€");
               //         this.tableSubTotalBonus += insert.totalBonus;
               //     }
               // 
               //     if (insert.unfinished != null && insert.unfinished.Values.Count > 0 && insert.unfinished.Keys.Count > 0)
               //     {
               //         Row toAdd = tabUnfinished.InsertRow(tabUnfinished.RowCount - 1);
               //         //project
               //         toAdd.Cells[0].InsertParagraph(insert.projet);
               //         List bulletedList = null;
               //         //stories
               //         foreach (string story in insert.unfinished.Keys)
               //         {
               //             if (bulletedList == null)
               //             {
               //                 bulletedList = this.final.AddList(story, 0, ListItemType.Bulleted, 1);
               //             }
               //             else
               //             {
               //                 this.final.AddListItem(bulletedList, story);
               //             }
               //         }
               //         toAdd.Cells[1].InsertList(bulletedList);
               //     }
               // }
               // tabBonus.Rows[tabBonus.RowCount - 1].Cells[1].ReplaceText("[totalTableBonus]", this.tableSubTotalBonus.ToString());

            }
        }
    } 
}