import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StructurerModule} from '../structurer/structurer.module';
import {PtConfModule} from '../pt-conf/pt-conf.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import {AlertDisplayerService} from '../alert-displayer.service';
import {LogMessageComponent} from '../log-message/log-message.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class TransmuterModule {
  private listeTaches : any;
  private listeStories : any;
  private listeProjets : any;

  constructor(private config : PtConfModule, private http : HttpClient,private Structurer : StructurerModule,private alerter : LogMessageComponent){
		//this.formatConf = conf;
		this.listeTaches = undefined;
		this.listeStories = undefined;
		this.listeProjets = undefined;
  }
  

	// TO DO prendre en compte initials et duration pour les taches 
  public transmuteTasks(TaskObject){
    let finalListOfObjects = [];
    return new Promise<any>((resolve,reject) => {
      console.log("transmuting tasks");
      /* console.log("TaskObject",TaskObject);    */
		  let tasksStructure;
		  this.Structurer.getTasksStructure().then((res : any) => {
        tasksStructure = JSON.parse(res); 
        //Boucle sur object configConverterTasks
	  		for(let u in TaskObject){	
		  		let finalObjects = {};
         	for(let i  in this.config.ConverterTasks){
            //console.log("tasksStructure[i]",tasksStructure[ConverterTasks[i]]);
            //console.log("TaskObject[u][i]",TaskObject[u][i]);
         		if(tasksStructure[this.config.ConverterTasks[i]] !== undefined && TaskObject[u][i] !== undefined){
              //console.log("TaskObject[u][i]",TaskObject[u][i]);
             //console.log("ConverterTasks[i]",ConverterTasks[i]);
         			finalObjects[this.config.ConverterTasks[i]] = TaskObject[u][i];      			
        		}      			
         	}	
        	finalListOfObjects.push(finalObjects);
         /* console.log("finalObjects",finalObjects);        */
	  		}
        this.listeTaches = finalListOfObjects;
      }).then(() => {
        resolve(finalListOfObjects);
      })
    });    	
	}

	public transmuteStories(StoryObject){
    let finalListOfObjects = [];
    console.log('StoryObject', StoryObject)
    return new Promise<any> ((resolve,reject) => {
      console.log("Transmuting Stories");
		  let storyStructure;
		  this.Structurer.getStoriesStructure().then((res : any) => {
        	storyStructure = JSON.parse(res);      		
      		//console.log(storyStructure);
      		//Boucle sur object config
			for(let u in StoryObject){
        let finalObjects = {};
      			for(let i in this.config.ConverterStories){
      			 	//console.log('toujours plus', i, storyStructure[i],StoryObject[u],  StoryObject[u][ConverterProjet[i]]  )
      				if(storyStructure[i] !== undefined && StoryObject[u][this.config.ConverterStories[i]] !== undefined){
      					finalObjects[i] = StoryObject[u][this.config.ConverterStories[i]];      			
      				}      			
      			}
      	finalListOfObjects.push(finalObjects);	
			}
			this.listeStories = finalListOfObjects;
      }).then(() =>{
      resolve(finalListOfObjects);
      })
    })    
	}

	public transmuteProjects(ProjectsObjects){
    //obj bdd
    let finalListOfObjects = [];
    return new Promise<any>((resolve,reject) => {
      console.log("Transmuting Projects");
    let projectStructure;
    //console.log("this.Structurer",this.Structurer);
		this.Structurer.getProjetStructure().then((res : any) => {
        	projectStructure = JSON.parse(res);
      		//Boucle sur object config
			for(let u in ProjectsObjects){
				let finalObjects = {};
      			for(let i  in this.config.ConverterProjet){
      				/*console.log('touyjours plus', i, projectStructure[i],ProjectsObjects[u],  ProjectsObjects[u][ConverterProjet[i]]  )*/
      				if(projectStructure[i] !== undefined && ProjectsObjects[u][this.config.ConverterProjet[i]] !== undefined){
      					finalObjects[i] = ProjectsObjects[u][this.config.ConverterProjet[i]];      			
      				}      			
      			}
      			finalListOfObjects.push(finalObjects);	
			}
      this.listeProjets = finalListOfObjects;
      // console.log("mes enormes couilles sur ton nez " ,finalListOfObjects);
        }).then(() => {
          resolve(finalListOfObjects);
        })
    });
	}

	public encapsulateObjects(projects,stories,tasks)
  {
    /*console.log("this.listeTaches",this.listeTaches);*/
    let GeneralObject : any = {};
    	if( projects != undefined && stories != undefined && tasks != undefined)
      {
    		GeneralObject.projets = projects;
    		for(let p in GeneralObject.projets){
          GeneralObject.projets[p].Stories = stories.filter(o => o.Fk_Project == GeneralObject.projets[p].ID);
          for(let t in GeneralObject.projets[p].Stories){
            GeneralObject.projets[p].Stories[t].Tasks = tasks.filter(o => o.FK_Stories == GeneralObject.projets[p].Stories[t].OriginalId);
          }
        }

      //GeneralObject = JSON.parse('{"projets":[{"ID":2136665,"Nom":"Devis","Description":"reneco","Stories":[{"Description":"test3","Labels":[{"id":19530099,"project_id":2136665,"kind":"label","name":"amo","created_at":"2017-12-14T11:28:04Z","updated_at":"2017-12-14T11:28:04Z"},{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"}],"OriginalId":155361699,"Owners":[],"StartDate":"2018-02-20T14:40:10Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361699","UpdatetDate":"2018-04-19T13:31:59Z","isAMO":true,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444581,"story_id":155361699,"description":"test6.-12 FB","complete":false,"position":1,"created_at":"2018-02-20T14:40:10Z","updated_at":"2018-02-20T14:40:10Z","initials":"FB","duree":"12","isBonnus":false},{"kind":"task","id":60444582,"story_id":155361699,"description":"test7.-13 VB","complete":false,"position":2,"created_at":"2018-02-20T14:40:10Z","updated_at":"2018-03-29T09:25:35Z","initials":"VB","duree":"13","isBonnus":false}]},{"Description":"test1","Labels":[{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"},{"id":19530103,"project_id":2136665,"kind":"label","name":"dev","created_at":"2017-12-14T11:28:34Z","updated_at":"2017-12-14T11:28:34Z"}],"OriginalId":155361638,"Owners":[809107],"StartDate":"2018-02-20T14:38:52Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361638","UpdatetDate":"2018-05-07T13:16:29Z","isAMO":false,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444550,"story_id":155361638,"description":"test1.-4 TL","complete":false,"position":1,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-02-20T14:38:52Z","initials":"TL","duree":"4","isBonnus":false},{"kind":"task","id":60444551,"story_id":155361638,"description":"test2.-7 VB","complete":false,"position":2,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-05-07T13:16:29Z","initials":"VB","duree":"7","isBonnus":false},{"kind":"task","id":60444552,"story_id":155361638,"description":"test3.-3+3 DL+JVA","complete":false,"position":3,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-02-20T14:38:52Z","initials":["DL","JVA"],"duree":["3","3"],"isBonnus":false}]},{"Description":"test2","Labels":[{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"},{"id":19530102,"project_id":2136665,"kind":"label","name":"des","created_at":"2017-12-14T11:28:19Z","updated_at":"2017-12-14T11:28:19Z"}],"OriginalId":155361671,"Owners":[809107],"StartDate":"2018-02-20T14:39:41Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361671","UpdatetDate":"2018-02-20T14:40:36Z","isAMO":false,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444569,"story_id":155361671,"description":"test4.-12 AR","complete":false,"position":1,"created_at":"2018-02-20T14:39:41Z","updated_at":"2018-02-20T14:39:41Z","initials":"AR","duree":"12","isBonnus":false},{"kind":"task","id":60444570,"story_id":155361671,"description":"test5.-4 AR","complete":false,"position":2,"created_at":"2018-02-20T14:39:41Z","updated_at":"2018-02-20T14:39:41Z","initials":"AR","duree":"4","isBonnus":false}]}]}]}')
      //console.log("GeneralObject",GeneralObject);
      this.sendToServer(GeneralObject);
        //Temporary to delete
        
        /*GeneralObject = JSON.parse('[{"ID":2136665,"Nom":"Devis","Description":"reneco","Stories":[{"Description":"test3","Labels":[{"id":19530099,"project_id":2136665,"kind":"label","name":"amo","created_at":"2017-12-14T11:28:04Z","updated_at":"2017-12-14T11:28:04Z"},{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"}],"OriginalId":155361699,"Owners":[],"StartDate":"2018-02-20T14:40:10Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361699","UpdatetDate":"2018-04-19T13:31:59Z","isAMO":true,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444581,"story_id":155361699,"description":"test6.-12 FB","complete":false,"position":1,"created_at":"2018-02-20T14:40:10Z","updated_at":"2018-02-20T14:40:10Z","initials":"FB","duree":"12","isBonnus":false},{"kind":"task","id":60444582,"story_id":155361699,"description":"test7.-13 VB","complete":false,"position":2,"created_at":"2018-02-20T14:40:10Z","updated_at":"2018-03-29T09:25:35Z","initials":"VB","duree":"13","isBonnus":false}]},{"Description":"test1","Labels":[{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"},{"id":19530103,"project_id":2136665,"kind":"label","name":"dev","created_at":"2017-12-14T11:28:34Z","updated_at":"2017-12-14T11:28:34Z"}],"OriginalId":155361638,"Owners":[809107],"StartDate":"2018-02-20T14:38:52Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361638","UpdatetDate":"2018-05-07T13:16:29Z","isAMO":false,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444550,"story_id":155361638,"description":"test1.-4 TL","complete":false,"position":1,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-02-20T14:38:52Z","initials":"TL","duree":"4","isBonnus":false},{"kind":"task","id":60444551,"story_id":155361638,"description":"test2.-7 VB","complete":false,"position":2,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-05-07T13:16:29Z","initials":"VB","duree":"7","isBonnus":false},{"kind":"task","id":60444552,"story_id":155361638,"description":"test3.-3+3 DL+JVA","complete":false,"position":3,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-02-20T14:38:52Z","initials":["DL","JVA"],"duree":["3","3"],"isBonnus":false}]},{"Description":"test2","Labels":[{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"},{"id":19530102,"project_id":2136665,"kind":"label","name":"des","created_at":"2017-12-14T11:28:19Z","updated_at":"2017-12-14T11:28:19Z"}],"OriginalId":155361671,"Owners":[809107],"StartDate":"2018-02-20T14:39:41Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361671","UpdatetDate":"2018-02-20T14:40:36Z","isAMO":false,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444569,"story_id":155361671,"description":"test4.-12 AR","complete":false,"position":1,"created_at":"2018-02-20T14:39:41Z","updated_at":"2018-02-20T14:39:41Z","initials":"AR","duree":"12","isBonnus":false},{"kind":"task","id":60444570,"story_id":155361671,"description":"test5.-4 AR","complete":false,"position":2,"created_at":"2018-02-20T14:39:41Z","updated_at":"2018-02-20T14:39:41Z","initials":"AR","duree":"4","isBonnus":false}]}]}]')
        this.sendToServer(GeneralObject);*/
    	}
      //Temporary to delete
      //GeneralObject = JSON.parse('{"projets":[{"ID":2136665,"Nom":"Devis","Description":"reneco","Stories":[{"Description":"test3","Labels":[{"id":19530099,"project_id":2136665,"kind":"label","name":"amo","created_at":"2017-12-14T11:28:04Z","updated_at":"2017-12-14T11:28:04Z"},{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"}],"OriginalId":155361699,"Owners":[],"StartDate":"2018-02-20T14:40:10Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361699","UpdatetDate":"2018-04-19T13:31:59Z","isAMO":true,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444581,"story_id":155361699,"description":"test6.-12 FB","complete":false,"position":1,"created_at":"2018-02-20T14:40:10Z","updated_at":"2018-02-20T14:40:10Z","initials":"FB","duree":"12","isBonnus":false},{"kind":"task","id":60444582,"story_id":155361699,"description":"test7.-13 VB","complete":false,"position":2,"created_at":"2018-02-20T14:40:10Z","updated_at":"2018-03-29T09:25:35Z","initials":"VB","duree":"13","isBonnus":false}]},{"Description":"test1","Labels":[{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"},{"id":19530103,"project_id":2136665,"kind":"label","name":"dev","created_at":"2017-12-14T11:28:34Z","updated_at":"2017-12-14T11:28:34Z"}],"OriginalId":155361638,"Owners":[809107],"StartDate":"2018-02-20T14:38:52Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361638","UpdatetDate":"2018-05-07T13:16:29Z","isAMO":false,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444550,"story_id":155361638,"description":"test1.-4 TL","complete":false,"position":1,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-02-20T14:38:52Z","initials":"TL","duree":"4","isBonnus":false},{"kind":"task","id":60444551,"story_id":155361638,"description":"test2.-7 VB","complete":false,"position":2,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-05-07T13:16:29Z","initials":"VB","duree":"7","isBonnus":false},{"kind":"task","id":60444552,"story_id":155361638,"description":"test3.-3+3 DL+JVA","complete":false,"position":3,"created_at":"2018-02-20T14:38:52Z","updated_at":"2018-02-20T14:38:52Z","initials":["DL","JVA"],"duree":["3","3"],"isBonnus":false}]},{"Description":"test2","Labels":[{"id":19772478,"project_id":2136665,"kind":"label","name":"commande devis","created_at":"2018-02-20T14:37:44Z","updated_at":"2018-02-20T14:37:44Z"},{"id":19530102,"project_id":2136665,"kind":"label","name":"des","created_at":"2017-12-14T11:28:19Z","updated_at":"2017-12-14T11:28:19Z"}],"OriginalId":155361671,"Owners":[809107],"StartDate":"2018-02-20T14:39:41Z","Type":"feature","URL":"https://www.pivotaltracker.com/story/show/155361671","UpdatetDate":"2018-02-20T14:40:36Z","isAMO":false,"Fk_Project":2136665,"Tasks":[{"kind":"task","id":60444569,"story_id":155361671,"description":"test4.-12 AR","complete":false,"position":1,"created_at":"2018-02-20T14:39:41Z","updated_at":"2018-02-20T14:39:41Z","initials":"AR","duree":"12","isBonnus":false},{"kind":"task","id":60444570,"story_id":155361671,"description":"test5.-4 AR","complete":false,"position":2,"created_at":"2018-02-20T14:39:41Z","updated_at":"2018-02-20T14:39:41Z","initials":"AR","duree":"4","isBonnus":false}]}]}]}')
      //console.log("GeneralObject",GeneralObject);
       // this.sendToServer(GeneralObject);
  }


  public Angularget(configUrl,objetAEnvoyer) {
    return this.http.post(configUrl,objetAEnvoyer, {
      headers: {
        "dataType" :  "json",
        "Content-Type" :"application/json; charset=UTF-8"
      }
    });
  }

  public sendToServer(GeneralObject){
    console.log("sending object : ", GeneralObject);
    /*api/Devis/post*/
    // var xhr = new window.XMLHttpRequest();
    // let result = {};
    // xhr.onreadystatechange = function(){
    //   if(xhr.readyState === 4){
    //     if(xhr.status === 200){
    //         alert("envoie réussi");
    //         result = JSON.parse(xhr.response);
    //       }else{
    //         if(xhr.status === 403){
    //           result.code = 403;
    //           result = "Vous n'avez pas accès à cet url " + url + '\n' + "Veuillez changer votre Token D'accès à Pivotal Tracker";
    //         }else{
    //           result.code = "Others";
    //           result = xhr.response;
    //         }
    //       }
    //     }
    //   }
    // xhr.open('POST','http://localhost/DevisAPI/api/Devis/',false);
    //   xhr.setRequestHeader("dataType", "json")
    //   xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

    // //xhr.setRequestHeader('X-TrackerToken','b4a752782f711a7c564221c2b0c2d5dc','Content-Type','application/json');
    // xhr.send(JSON.stringify(GeneralObject));

    this.Angularget('http://localhost/DevisAPI/api/Devis/',JSON.stringify(GeneralObject)).toPromise().then((res) => {
      this.alerter.setlogMessage("Process Terminé :)");
      console.log("terminé ! ");
      this.alerter.setLoadingProperty();
    }).catch((error) => {
      this.alerter.setlogMessage("Il y a eu une erreur");
      console.log("Il y a eu une erreur");
    });
  }
 }
