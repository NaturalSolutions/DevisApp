import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import {TasksParserModule} from '../tasks-parser/tasks-parser.module';

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

  constructor(private http: HttpClient,private tasksParser : TasksParserModule){
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
    //$('#projets').show();
    //this.getProjectStories(projectvalable);
    //_this.transMuter.transmuteProjects(projectvalable);	
    // console.log("projectvalable",projectvalable);	
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
  
    getProjectStories(projectIds) {
    return new Promise<any>((resolve,reject) => {
      let stories = [];
      console.log("going to search Stories");
      let promises:Promise<any>[] = [];
      console.log("this.epic",this.epic);
      for(let i in projectIds){
        let res = this.Angularget("https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories"+"?with_label="+this.epic)
        .toPromise().then((res : any) => {
          let myCurrentStory : any;
          for(let u in res){
            // console.log("result[u]",result[u]); 
            myCurrentStory = res[u];
            myCurrentStory.listeTaches = [];
            if(myCurrentStory.story_type.toLowerCase() != 'release' && !this.checkifBonus(myCurrentStory.labels)){
              /*console.log('myCurrentStory',myCurrentStory);*/
               // renvoie les stories d'un projet correspondant a un epic 	
              //console.log("liste stories existe dans ce projet ",projectIds[i].listeStories);
              res[u].listeTaches = new Array();
              myCurrentStory.story_type = "";
              let stringLabels = "";
              for(let o in myCurrentStory.labels){
                //alert(result[i].labels[o].name.toLowerCase());
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
              if(!(projectIds[i].listeStories == undefined) && !(myCurrentStory == undefined)){
                stories.push(myCurrentStory);
                if(myCurrentStory.project_id == projectIds[i].id){
                 projectIds[i].listeStories.push(myCurrentStory);
                }
              }
             // $('#resultOptionStories').append('<br><p>'+result[u].name+'<p><br>');
            }
            //$('#stories').show();
            //console.log("projectIds debug",projectIds)
          }
      });
      promises.push(res);
      }
      Promise.all(promises).then(() => {
        let objectToSend : any = {};
        objectToSend.stories = stories;
        objectToSend.Projects = projectIds; 
        resolve(objectToSend);
      })
    });    
    //this.transMuter.transmuteStories(stories);
    //this.getTasks(stories,projectIds);
    //this.transMuter.transmuteStories(stories);
  }
 
    getTasks(storiesIds,projectIds){
      return new Promise<any>((resolve,reject) => {
        console.log("projectIds",projectIds);
        let tasks = [];
        let listeModifie = [];
        let promises:Promise<any>[] = [];
        for(let i in projectIds)
        {
          console.log("projectIds[i]",projectIds[i]);
          let strfiltered = storiesIds.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
          projectIds[i].listeStories.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
          //i = parseInt(i);
          for(let s in strfiltered)
          {
          	projectIds[i].listeStories[s].listeTaches = new Array(); 
            let result = this.Angularget("https://www.pivotaltracker.com/services/v5/projects/" + strfiltered[s].project_id + "/stories/" + strfiltered[s].id + "/tasks")
            .toPromise().then((result) => {
              for(let u in result){
                if(result[u].story_id == strfiltered[s].id){
                  tasks.push(result[u]);
                  /*strfiltered[s].listeTaches.push(result[u]);*/
                  //$('#resultOptionTasks').append('<br><p>'+result[u].description+'<p><br>');
                }
              }
              //$('#taks').show();
              let projetid =  projectIds.map(o => o.id);
              let storiesid = [];
              for(let k in projectIds){
                storiesid.push(projectIds[k].id); 
              }
              //let parser = new TasksParser();
              if(strfiltered[s].id != undefined && tasks != undefined && strfiltered[s].project_id != undefined){
                listeModifie = this.tasksParser.getInfoFromTasks(tasks,strfiltered[s].id,strfiltered[s].project_id,false);
              }
              /*console.log('projectIds tout complet',projectIds);*/		//this.transMuter.sendToServer();
            });
            promises.push(result);            
          }				
        }
        Promise.all(promises).then(() => {
          resolve(listeModifie);
        })
      });     
     // _this.transMuter.transmuteTasks(listeModifie);
    }	
  
 }
