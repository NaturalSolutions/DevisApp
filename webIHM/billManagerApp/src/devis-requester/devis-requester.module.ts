import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import {TasksParserModule} from '../tasks-parser/tasks-parser.module';
import {TransmuterModule} from '../transmuter/transmuter.module';
import {LogMessageComponent} from '../log-message/log-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class DevisRequesterModule {

  // class DevisRequester{
  //   constructor(epic){
  //     this.epic = epic;
  //     this.transMuter = new transmuter();
  //   }

  private epic;
  private transmuter;

  constructor(private http: HttpClient,private tasksParser : TasksParserModule,private  TransMuter : TransmuterModule, private log : LogMessageComponent){
  }  


  Angularget(configUrl) {
    return this.http.get(configUrl, {
      headers: {
        'X-TrackerToken': 'b4a752782f711a7c564221c2b0c2d5dc',
        'Content-Type': 'application/json'
      }
    });
  }


  getProjectFromEpic(myProjects,RequestedEpic : any){
    let projectvalable = [];
    this.epic = RequestedEpic;
    let epicsAdder = new Set();
    let epicsArray;
    for(let idProjet in myProjects)
    {
      let myCurrentProject : any;	
      if(myProjects[idProjet].epicName != undefined){
        for(let Name in myProjects[idProjet].epicName){
          if(myProjects[idProjet].epicName[Name].toLowerCase() === RequestedEpic.toLowerCase()){
            myCurrentProject = myProjects[idProjet];
            myCurrentProject.listeStories = [];
            projectvalable.push(myCurrentProject);
            //$('#resultOption').append('<br><p>'+myProjectsIds[idProjet].name+'<p><br>');	
          }
        }			
      }
    }
    //$('#projets').show(); TO DO AFFICHAGE 
    console.log("this.TransMuter",this.TransMuter);
    this.TransMuter.transmuteProjects(projectvalable);
    return projectvalable;
  }
  
  
  
  
    ///Récupère l'ensemble des stories d'un projet.
    ///Param : projectId -> id du projet dans PT
    ///Return : [objects] repésentant les personnes impliquées dans le projet
  
    checkifBonus(labels){
      for(let i in labels){
        if(labels[i].name == "bonus"){
          return true;
        }
      }
      return false;
    }
  
    getProjectStories(projects) {
    return new Promise<any>((resolve,reject) => {
      let stories = [];
      let promises:Promise<any>[] = [];
      console.log("this.epic",this.epic);
      for(let i in projects){
        let res = this.Angularget("https://www.pivotaltracker.com/services/v5/projects/" + projects[i].id + "/stories"+"?with_label="+this.epic)
        .toPromise().then((res : any) => {
          let myCurrentStory : any;
          for(let u in res){
            myCurrentStory = res[u];
            myCurrentStory.listeTaches = [];
            if(myCurrentStory.story_type.toLowerCase() != 'release' && !this.checkifBonus(myCurrentStory.labels)){
              res[u].listeTaches = new Array();
              myCurrentStory.story_type = "";
              let stringLabels = "";
              for(let o in myCurrentStory.labels){
                if(myCurrentStory.labels[o].name == "des" || myCurrentStory.labels[o].name == "dev" || myCurrentStory.labels[o].name == "amo"){
                  myCurrentStory.story_type = myCurrentStory.labels[o].name;
                }
                stringLabels += myCurrentStory.labels[o].name + " ";
                if(myCurrentStory.labels[o].name == "amo"){
                  myCurrentStory.AMO = true;
                }
              }
              myCurrentStory.labels = stringLabels;
              myCurrentStory.owner_ids = myCurrentStory.owner_ids.toString(); 
              if(myCurrentStory.AMO == undefined){
                myCurrentStory.AMO = false;
              }
              if(!(projects[i].listeStories == undefined) && !(myCurrentStory == undefined)){
                stories.push(myCurrentStory);
                if(myCurrentStory.project_id == projects[i].id){
                 projects[i].listeStories.push(myCurrentStory);
                }
              }
            }
          }
      });
      promises.push(res);
      }
      Promise.all(promises).then(() => {
        let objectToSend : any = {};
        objectToSend.stories = stories;
        objectToSend.Projects = projects; 
        resolve(objectToSend);
        this.TransMuter.transmuteStories(stories);
      })
    });    
  }
 
    getTasks(storiesIds,projectIds){
      return new Promise<any>((resolve,reject) => {
        let tasks = [];
        let listeModifie = [];
        let promises:Promise<any>[] = [];
        for(let i in projectIds)
        {
          let strfiltered = storiesIds.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
          projectIds[i].listeStories.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
          for(let s in strfiltered)
          {
          	projectIds[i].listeStories[s].listeTaches = new Array(); 
            let result = this.Angularget("https://www.pivotaltracker.com/services/v5/projects/" + strfiltered[s].project_id + "/stories/" + strfiltered[s].id + "/tasks")
            .toPromise().then((result) => {
              for(let u in result){
                if(result[u].story_id == strfiltered[s].id){
                  tasks.push(result[u]);
                  strfiltered[s].listeTaches.push(result[u]);
                }
              }
              let projetid =  projectIds.map(o => o.id);
              let storiesid = [];
              for(let k in projectIds){
                storiesid.push(projectIds[k].id); 
              }
              if(strfiltered[s].id != undefined && tasks != undefined && strfiltered[s].project_id != undefined){
                listeModifie = this.tasksParser.getInfoFromTasks(tasks,strfiltered[s].id,strfiltered[s].project_id,false);
              }
            });
            promises.push(result);            
          }				
        }
        Promise.all(promises).then(() => {
          let objectToSend : any = {};
          objectToSend.Taches = listeModifie;
          objectToSend.Project = projectIds;
          this.TransMuter.transmuteTasks(listeModifie); 
          resolve(objectToSend);
        })
      });     
    }

    containsEpic(labels,epic) : boolean{
      for(let lab in labels){
        if(labels[lab] != undefined && labels[lab].name != undefined){
          if(labels[lab].name.toLowerCase() == this.epic.toLowerCase()){
            return true;
          }
        }        
      }
      return false;
    }
    
    getAcceptedProjectStories(projects) : any {
      return new Promise<any>((resolve,reject) => {
        let stories = [];
        let storiesSansEpics = [];
        let promises:Promise<any>[] = [];
        for(let i in projects){
          //Example en dur a dynamiser avec du front
          let startdate = new Date(2018, 5, 1);
          let nowDate = new Date();
          let res = this.Angularget("https://www.pivotaltracker.com/services/v5/projects/" + projects[i].id + "/stories?accepted_after=" + startdate.toISOString() + "&accepted_before=" + nowDate.toISOString())
          .toPromise().then((res : any) => {            
            for(let u in res){
              let myCurrentStory : any;
              let stringLabels = "";
              myCurrentStory = res[u];
              if(myCurrentStory.story_type.toLowerCase() != 'release'){
                myCurrentStory.listeTaches = new Array();
                myCurrentStory.story_type = "";
                if(this.containsEpic(myCurrentStory.labels,this.epic)){
                  stories.push(myCurrentStory);
                }else {
                  storiesSansEpics.push(myCurrentStory);
                }

                for(let o in myCurrentStory.labels){
                  if(myCurrentStory.labels[o] != undefined){
                    stringLabels += myCurrentStory.labels[o].name + ";";
                    if(myCurrentStory.labels[o].name == "des" || myCurrentStory.labels[o].name == "dev" || myCurrentStory.labels[o].name == "amo"){
                      myCurrentStory.story_type = myCurrentStory.labels[o].name;
                      if(myCurrentStory.labels[o].name == "amo"){
                        myCurrentStory.AMO = true;
                      }                    
                    }                 
                    myCurrentStory.listeTaches = [];             
                    myCurrentStory.owner_ids = myCurrentStory.owner_ids.toString(); 
                    if(myCurrentStory.AMO == undefined){
                      myCurrentStory.AMO = false;
                    }  
                  }                  
                }
                myCurrentStory.labels = stringLabels;
              }
              
            }
        });
        promises.push(res);
        }
        Promise.all(promises).then(() => {
          if(storiesSansEpics.length > 0 ){
            let objectToSend : any = {};
            objectToSend.stories = stories;
            objectToSend.storiesSansEpics = storiesSansEpics;
            reject(objectToSend);
            this.log.setLoadingProperty();
          }else {
            let objectToSend : any = {};
            console.log("stories",stories);
            objectToSend.stories = stories;
            resolve(objectToSend);
            this.log.setLoadingProperty();
            //this.TransMuter.transmuteStories(stories);
          }          
        })

      });
    }
 }
