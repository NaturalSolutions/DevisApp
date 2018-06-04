import { Component, OnInit } from '@angular/core';
import {EpicRecuperatorModule} from '../epic-recuperator/epic-recuperator.module';
import { HttpClient } from '@angular/common/http';
import {DevisRequesterModule} from '../devis-requester/devis-requester.module';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import {LogMessageComponent} from '../log-message/log-message.component'

@Component({
  selector: 'app-file-generator',
  templateUrl: './file-generator.component.html',
  styleUrls: ['./file-generator.component.css'],
})
export class FileGeneratorComponent implements OnInit {

  private divVisibility;
  private DevisProcessLauched;
  private devisScope;
  private factureScope;
  private fileScope; 
  constructor(private epicRecuperator : EpicRecuperatorModule, private http: HttpClient,private devisRequester : DevisRequesterModule,private alerter : LogMessageComponent) {
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

  // lauchDevis() :void {
  //   let infoLogContext = document.getElementById('infoLog');
  //   if(this.DevisProcessLauched == false){      
  //     infoLogContext.style.visibility = "visible";
  //     infoLogContext.innerHTML = "<p> Devis process lauched </p>"
  //     setTimeout(() => {
  //       infoLogContext.style.visibility = "hidden";
  //     }, 2000);
  //     this.DevisProcessLauched = true;
  //     let objetTransition;
  //     this.alerter.setLoadingProperty();
  //     this.epicRecuperator.getAllProjectsId().then(projects => {
  //       console.log("res",projects);
  //       this.epicRecuperator.getAllEpics(projects).then(epics => {
  //         let selector = document.createElement("select");
  //         selector.style.borderRadius = "15px";
  //         selector.style.padding = "10px"; 
  //         selector.style.position = "absolute";
  //         selector.style.bottom = "0px";
  //         selector.style.left = "50%";
  //         selector.style.transform ="translateX(-50%)";
  //         selector.style.width = "30%";

  //         for(let i in epics){
  //           let option = document.createElement("option");
  //           option.text = epics[i];
  //           selector.appendChild(option);
  //          }           
  //          let fileGeneratorContext = document.getElementById('fileGenerator');
  //          fileGeneratorContext.appendChild(selector); 
  //          this.alerter.setLoadingProperty();
  //          selector.onchange = () => {      
  //           this.alerter.setLoadingProperty();
  //           this.devisRequester.getProjectStories(this.devisRequester.getProjectFromEpic(projects,selector.value)).then((rezzz) => {
  //             console.log("rezzz",rezzz);
  //             this.devisRequester.getTasks(rezzz.stories,rezzz.Projects).then((rez) => {
  //               console.log("rez",rez.Project);
  //             });
  //           })
  //          };
           
  //       });
      
  //       // let promises: Promise<any[]>[] = [];
  //       // projects.forEach(project => {
  //       //   let promise: Promise<any[]> = this.http.get<any[]>('')
  //       //   .toPromise()
  //       //   .then(stories => {
  //       //     //stories iterations
  //       //     project.stories = stories;


  //       //     return stories;


  //       //   }, error => {
  //       //     project.stories = [];
  //       //     return [];
  //       //   })
  //       //   .then(stories => {
  //       //     return stories;
  //       //   });

  //       //   promises.push(promise);
  //       // });
  //       // Promise.all(promises).then(success => {

  //       // }, error => {

  //       // });
  //     });
  //   }else{
  //     infoLogContext.innerHTML = "<p> Keep Calm and take a coffee, Devis process is already processing !"
  //     infoLogContext.style.visibility = "visible";
  //     setTimeout(() => {
  //       infoLogContext.style.visibility = "hidden";
  //     }, 2000);
  //   }
    
  // }

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
        console.log("res",projects);
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
            this.alerter.setLoadingProperty();    
            //Ici traitement devis ou facturation
            if(type.toLowerCase() == "devis")    
            {
              this.devisRequester.getProjectStories(this.devisRequester.getProjectFromEpic(projects,selector.value)).then((rezzz) => {
                console.log("rezzz",rezzz);
                this.devisRequester.getTasks(rezzz.stories,rezzz.Projects).then((rez) => {
                  console.log("rez",rez.Project);
                });
              })
            }else if(type.toLowerCase() == "facture"){
              this.devisRequester.getAcceptedProjectStories(this.devisRequester.getProjectFromEpic(projects,selector.value)).then((resFactu) => {
                console.log("res factu",resFactu);                
              }).catch((error) => {
                console.log(error);
                let logMessage = "<p>Ces Stories ne possède pas l'epic que vous avez séléctionnez, veuillez noter que si vous continuez elle ne seront pas prise en compte dans la tarification :</p> '\n'";
                for(let a in error.storiesSansEpics){
                  logMessage += '<a href="'+error.storiesSansEpics[a].url+'" target="_blank">story['+a+']</a>' + '&nbsp ' + '&nbsp ' + '\n';
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

                document.getElementById('continue').onclick = () => {
                  infoLogContext.style.visibility = "hidden";
                  console.log("error.stories",error.stories);
                  let ProperStories = error.stories;
                  let nonAcceptedStories : [any];
                  let bonnusStories : [any];
                  let allStories = this.devisRequester.getProjectStories(projects).then((e : any) => {
                    for(let couilles in e){
                      if(e[couilles].labels != undefined){
                        if(e[couilles].labels.includes("bonus") && e[couilles].current_state == "accepted"){
                          bonnusStories.push(e[couilles]);
                        }else if(e[couilles].current_state != "accepted"){
                          nonAcceptedStories.push(e[couilles]);
                        }
                      }
                    }
                    this.devisRequester.getTasks(projects,bonnusStories).then((bonusTasks) =>{
                      console.log("bonusTasks",bonusTasks);
                    });

                    this.devisRequester.getTasks(projects,nonAcceptedStories).then((nonAcceptedTasks) => {
                      console.log("nonAcceptedTasks",nonAcceptedTasks);
                    });

                    this.devisRequester.getTasks(projects,ProperStories).then((properTasks) => {
                      console.log("properTasks",properTasks);
                    });
                  })
                }
                document.getElementById('stop').onclick = () => {
                  window.location.reload();
                }
              });
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
