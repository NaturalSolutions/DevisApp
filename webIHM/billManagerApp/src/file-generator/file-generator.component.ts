import { Component, OnInit } from '@angular/core';
import {EpicRecuperatorModule} from '../epic-recuperator/epic-recuperator.module';
import { HttpClient } from '@angular/common/http';
import {DevisRequesterModule} from '../devis-requester/devis-requester.module';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import {LogMessageComponent} from '../log-message/log-message.component';
import * as moment from 'moment';
import {TransmuterModule} from "../transmuter/transmuter.module";

@Component({
  selector: 'app-file-generator',
  templateUrl: './file-generator.component.html',
  styleUrls: ['./file-generator.component.css']
})
export class FileGeneratorComponent implements OnInit {

  private divVisibility;
  private DevisProcessLauched;
  private devisScope;
  private factureScope;
  private fileScope; 
  constructor(private epicRecuperator : EpicRecuperatorModule, private http: HttpClient,private devisRequester : DevisRequesterModule,private alerter : LogMessageComponent, private myTransMuter : TransmuterModule) {
    this.divVisibility = false; 
    this.DevisProcessLauched = false;
   }

  ngOnInit() {
    this.devisScope = document.getElementById('devis');
    this.factureScope = document.getElementById('facture');
    this.fileScope = document.getElementById('fileGenerator');
  }

  displayOptions () :void {
    if(this.divVisibility == false){
      this.fileScope.style.visibility = "visible";
      this.devisScope.style.visibility = "visible";
      this.factureScope.style.visibility = "visible";
      this.divVisibility = true;
    }else{
      this.fileScope.style.visibility = "hidden";
      this.devisScope.style.visibility = "hidden";
      this.factureScope.style.visibility = "hidden";
      this.divVisibility = false;
    }
  } 
  setLocalMessageLog(result){
    let infoLogContext = document.getElementById('infoLog');
    let logMessage = "<p>Ces Stories ne possède pas l'epic que vous avez sélectionnées, veuillez noter que si vous continuez elle ne seront pas prises en compte dans la tarification:</p> '\n'";
    for(let a in result.storiesSansEpics){
      logMessage += '<a href="'+result.storiesSansEpics[a].url+'" target="_blank">story['+a+']</a>' + '&nbsp ' + '&nbsp ' + '\n';
    }
    infoLogContext.innerHTML = "<p>"+logMessage+"</p>" + '<br><button id="continue">Continuer</button><button id="stop">Arreter le processus</button>'
    infoLogContext.style.visibility = "visible";
    document.getElementById('continue').style.borderRadius = "15px";
    document.getElementById('continue').style.backgroundColor = "black";
    document.getElementById('continue').style.margin = "10px";
    document.getElementById('continue').style.color = "white";
    document.getElementById('continue').style.border = "none";
    document.getElementById('continue').style.padding = "5px";

    document.getElementById('stop').style.backgroundColor = "black";
    document.getElementById('stop').style.borderRadius = "15px";
    document.getElementById('stop').style.margin = "10px";
    document.getElementById('stop').style.color = "white";
    document.getElementById('stop').style.border = "none";
    document.getElementById('stop').style.padding = "5px";
  }

  lauchProcess(type : any) :void {
    let infoLogContext = document.getElementById('infoLog');
    if(this.DevisProcessLauched == false){      
      infoLogContext.style.visibility = "visible";
      infoLogContext.innerHTML = '<p> ' + type + ' process lauched </p>'
      setTimeout(() => {
        infoLogContext.style.visibility = "hidden";
      }, 2000);
      this.DevisProcessLauched = true;
      let objetTransition;
      this.alerter.setLoadingProperty();
      this.epicRecuperator.getAllProjectsId().then(projects => {
        this.epicRecuperator.getAllEpics(projects).then(epics => {
          let selector = document.createElement("select");
          selector.style.borderRadius = "15px";
          selector.style.padding = "10px"; 
          selector.style.position = "absolute";
          selector.style.bottom = "0px";
          selector.style.left = "50%";
          selector.style.transform ="translateX(-50%)";
          selector.style.width = "30%";

          for(let i in epics){
            let option = document.createElement("option");
            option.text = epics[i];
            selector.appendChild(option);
           }           
           let fileGeneratorContext = document.getElementById('fileGenerator');
           fileGeneratorContext.appendChild(selector); 
           this.alerter.setLoadingProperty();
           selector.onchange = () => {         
            //Ici traitement devis ou facturation
            if(type.toLowerCase() == "devis")    
            {
              let projets = this.devisRequester.getProjectFromEpic(projects,selector.value);
              let zeubi = this.myTransMuter.transmuteProjects(projets);
                let transformedProject = zeubi;
                this.devisRequester.getProjectStories(projets).then((rezzz) => {
                  console.log(rezzz); 
                  let race = this.myTransMuter.transmuteStories(rezzz.stories);
                    let transformedStories = race;
                    console.log("transformedStories",transformedStories);
                    this.devisRequester.getTasks(rezzz.stories,projects,false).then((rez) => {
                      console.log(rez.Taches);
                      let couilles = this.myTransMuter.transmuteTasks(rez.Taches)
                        let transformedTasks = couilles;
                        this.myTransMuter.encapsulateObjects(transformedProject,transformedStories,transformedTasks,false,0,0);
                        console.log('envoir en cours');
                    });              
                })
              
            }else if(type.toLowerCase() == "facture"){
              let monthPicker = document.createElement('input');
              monthPicker.type = "month";
              monthPicker.id = "month";
              monthPicker.pattern = '[0-9]{4}/[0-9]{2}';
              monthPicker.style.borderRadius = "15px";
              monthPicker.style.padding = "10px"; 
              monthPicker.style.position = "absolute";
              monthPicker.style.bottom = "-80px";
              monthPicker.style.left = "50%";
              monthPicker.style.transform ="translateX(-50%)";
              monthPicker.style.width = "25%";
              fileGeneratorContext.appendChild(monthPicker); 
              monthPicker.onchange = () => {
                this.alerter.setLoadingProperty();
                let projets = this.devisRequester.getProjectFromEpic(projects,selector.value);
                console.log('projets',projets);
                let projetmidified = this.myTransMuter.transmuteProjects(projets);                 
                  this.devisRequester.getAcceptedProjectStories(this.devisRequester.getProjectFromEpic(projets,selector.value),monthPicker.value).then((resFactu) => {  
                  this.myTransMuter.transmuteStories(resFactu);     
                }).catch((treatmeantStoriesWithoutEpics) => {               
                  this.setLocalMessageLog(treatmeantStoriesWithoutEpics);
                  document.getElementById('continue').onclick = () => {
                    this.alerter.setLoadingProperty();
                    infoLogContext.style.visibility = "hidden";
                    console.log("treatmeantStoriesWithoutEpics.stories",treatmeantStoriesWithoutEpics.stories);
                    let ProperStories = [];
                    for(let z in  treatmeantStoriesWithoutEpics.stories){
                      if(treatmeantStoriesWithoutEpics.stories[z].labels != undefined){                      
                        if(treatmeantStoriesWithoutEpics.stories[z].labels.includes('bonus')){
                          treatmeantStoriesWithoutEpics.stories[z].nonEffetue = false;
                          ProperStories.push(treatmeantStoriesWithoutEpics.stories[z]);
                        }else{
                          treatmeantStoriesWithoutEpics.stories[z].nonEffetue = false;
                          ProperStories.push(treatmeantStoriesWithoutEpics.stories[z]);
                        }
                      }
                    }
                    this.devisRequester.getProjectStories(projects).then((e : any) => {
                      for(let cpt in e.stories){
                          if(e.stories[cpt].current_state != "accepted"){
                            console.log("e[cpt]",e[cpt]);
                            e.stories[cpt].nonEffetue = true;
                            ProperStories.push(e.stories[cpt]);
                          }
                      }
                      let stories = this.myTransMuter.transmuteStories(ProperStories);
                        let storiesmodified = stories;
                        console.log("TRANSMUTED STORIES",stories);
                        if(ProperStories.length > 0){                      
                          this.devisRequester.getTasks(ProperStories,projects,true).then((properTasks) => {
                            console.log("properTasks",properTasks.Taches);
                            let taches = this.myTransMuter.transmuteTasks(properTasks.Taches);
                              let tachemodified = taches;
                              console.log('transformed tâches',taches);                                              
                              let DTCDP = document.getElementById("DTCDP");
                              DTCDP.style.display = "block";
                              let btnEnvoi = document.getElementById('sendObject');
                              btnEnvoi.onclick =(() =>{
                                let cdp : HTMLInputElement = <HTMLInputElement> document.getElementById("cdp");
                                let dt : HTMLInputElement  = <HTMLInputElement> document.getElementById("dt");
                                if(cdp.value != '0'|| dt.value != '0'){
                                  console.log("cdp dt ",document.getElementById("cdp").textContent + "    " +document.getElementById("dt").textContent)                                  
                                  this.myTransMuter.encapsulateObjects(projetmidified,storiesmodified,tachemodified,true,cdp.value,dt.value);  
                                  console.log('j\'envoi !');
                                }else{
                                  this.alerter.setlogMessage('tous les champs doivent être remplis ! ')
                                }
                              })
                          });
                        }                    
                    });
                  }
                  document.getElementById('stop').onclick = () => {
                    window.location.reload();
                  }
                });                               
              }              
            }
           };
           
        });
      });
    }else{
      infoLogContext.innerHTML = "<p> Keep Calm and take a coffee, "+type+" process is already processing !"
      infoLogContext.style.visibility = "visible";
      setTimeout(() => {
        infoLogContext.style.visibility = "hidden";
      }, 2000);
    }
    
  }

}
