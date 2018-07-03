import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StructurerModule } from '../structurer/structurer.module';
import { PtConfModule } from '../pt-conf/pt-conf.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import { AlertDisplayerService } from '../alert-displayer.service';
import { LogMessageComponent } from '../log-message/log-message.component';
import { HttpResponse } from '@angular/common/http/src/response';
import { Binary } from 'selenium-webdriver/firefox';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class TransmuterModule {
  private listeTaches: any;
  private listeStories: any;
  private listeProjets: any;
  private blob: Blob;
  constructor(private config: PtConfModule, private http: HttpClient, private Structurer: StructurerModule, private alerter: LogMessageComponent) {
    this.listeTaches = undefined;
    this.listeStories = undefined;
    this.listeProjets = undefined;
  }


  public transmuteTasks(TaskObject) {
    let finalListOfObjects = [];
    console.log("transmuting tasks");
    let tasksStructure;
    //Boucle sur object configConverterTasks
    for (let u in TaskObject) {
      let finalObjects = {};
      for (let i in this.config.ConverterTasks) {
        if (TaskObject[u][i] !== undefined) {
          finalObjects[this.config.ConverterTasks[i]] = TaskObject[u][i];
        }
      }
      finalListOfObjects.push(finalObjects);
    }
    this.listeTaches = finalListOfObjects;
    return finalListOfObjects;
  }

  public transmuteStories(StoryObject) { // Transformation des stories au format serveur
    let finalListOfObjects = [];
    console.log('StoryObject', StoryObject)
    console.log("Transmuting Stories");
    //Boucle sur object config
    for (let u in StoryObject) { // parcours de toute les stories dans la liste de stories 
      let finalObjects = {}; // création de l'objet qui va contenir les info et qui sera sous le format serveur
      for (let i in this.config.ConverterStories) { // parcours du fichier de configuration
        if (StoryObject[u][this.config.ConverterStories[i]] !== undefined) { // si la story actuel contient le nom d'attribut actuel 
          finalObjects[i] = StoryObject[u][this.config.ConverterStories[i]];  // alors on ajoute au nouvel objet serveur un attribut "serveur" qui va contenir l'info de la story correspondante    			
        }
      }
      finalListOfObjects.push(finalObjects);	// on ajoute le nouvel objet à la
    }
    this.listeStories = finalListOfObjects;
    return finalListOfObjects;
  }

  public transmuteProjects(ProjectsObjects) {
    //obj bdd
    let finalListOfObjects = [];
    console.log("Transmuting Projects");
    let projectStructure;
    //Boucle sur object config
    for (let u in ProjectsObjects) {
      let finalObjects = {};
      for (let i in this.config.ConverterProjet) {
        if (ProjectsObjects[u][this.config.ConverterProjet[i]] !== undefined) {
          finalObjects[i] = ProjectsObjects[u][this.config.ConverterProjet[i]];
        }
      }
      finalListOfObjects.push(finalObjects);
    }
    this.listeProjets = finalListOfObjects;
    return finalListOfObjects;
  }

  public encapsulateObjects(projects, stories, tasks, isFactu, tarCDP = null, tarDT = null) {
    this.alerter.setlogProcess("encapsulating objects");
    let GeneralObject: any = {};
    if (projects != undefined && stories != undefined && tasks != undefined) {
      GeneralObject.projets = projects;
      for (let p in GeneralObject.projets) {
        GeneralObject.projets[p].Stories = stories.filter(o => o.Fk_Project == GeneralObject.projets[p].ID);
        for (let t in GeneralObject.projets[p].Stories) {
          GeneralObject.projets[p].Stories[t].Tasks = tasks.filter(o => o.FK_Stories == GeneralObject.projets[p].Stories[t].OriginalId);
        }
      }
      GeneralObject.JourDT = tarDT
      GeneralObject.jourCdp = tarCDP;
      this.sendToServer(GeneralObject, isFactu);
    }
  }


  public Angularget(configUrl, objetAEnvoyer) {
    return this.http.post(configUrl, objetAEnvoyer, {
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  }

  public getfile(configUrl) {
    return this.http.get(configUrl);
  }


  public sendToServer(GeneralObject, isFactu) {
    this.alerter.setLoadingProperty();
    if (isFactu) {
      this.alerter.setlogProcess("Sending objects for Facturation");
      console.log("sending object : ", GeneralObject);
      this.Angularget('http://localhost/DevisAPI/api/Facturation/', JSON.stringify(GeneralObject)).toPromise().then((file: HttpResponse<string>) => {
        this.alerter.setLoadingProperty();
        this.alerter.setlogMessage("Process Terminé :)");
        this.getfile("http://localhost/DevisAPI/api/Facturation/").toPromise().then((file: any) => {
          console.log("file", file);
        });
      }).catch((error) => {
        this.alerter.setlogMessage("Il y a eu une erreur");
        this.alerter.setLoadingProperty();
        console.log("Il y a eu une erreur", error);
      });
    } else {
      this.alerter.setLoadingProperty();
      this.alerter.setlogProcess("Sending objects for Devis");
      console.log("sending object : ", GeneralObject);
      this.Angularget('http://localhost/DevisAPI/api/Devis/', JSON.stringify(GeneralObject)).toPromise().then((res) => {
        this.alerter.setlogMessage("Process Terminé :)");
        console.log("terminé ! ");
      }).catch((error) => {
        this.alerter.setLoadingProperty();
        this.alerter.setlogMessage("Il y a eu une erreur");
        console.log("Il y a eu une erreur");
      });
    }
  }
}
