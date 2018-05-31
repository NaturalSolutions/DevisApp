import { Component, OnInit } from '@angular/core';
import {EpicRecuperatorModule} from '../epic-recuperator/epic-recuperator.module';
import { HttpClient } from '@angular/common/http';
import {DevisRequesterModule} from '../devis-requester/devis-requester.module';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';

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
  constructor(private epicRecuperator : EpicRecuperatorModule, private http: HttpClient,private devisRequester : DevisRequesterModule) {
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

  lauchDevis() :void {
    let infoLogContext = document.getElementById('infoLog');
    if(this.DevisProcessLauched == false){      
      infoLogContext.style.visibility = "visible";
      infoLogContext.innerHTML = "<p> Devis process lauched </p>"
      setTimeout(() => {
        infoLogContext.style.visibility = "hidden";
      }, 2000);
      this.DevisProcessLauched = true;
      let objetTransition;
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
           let ev : Event;
           selector.onchange = () => {          
            this.devisRequester.getProjectStories(this.devisRequester.getProjectFromEpic(projects,selector.value)).then((rezzz) => {
              console.log("rezzz",rezzz);
              this.devisRequester.getTasks(rezzz.stories,rezzz.Projects).then((rez) => {
                console.log("rez",rez.Project);
              })
            })
           };
           
        });
      
        // let promises: Promise<any[]>[] = [];
        // projects.forEach(project => {
        //   let promise: Promise<any[]> = this.http.get<any[]>('')
        //   .toPromise()
        //   .then(stories => {
        //     //stories iterations
        //     project.stories = stories;


        //     return stories;


        //   }, error => {
        //     project.stories = [];
        //     return [];
        //   })
        //   .then(stories => {
        //     return stories;
        //   });

        //   promises.push(promise);
        // });
        // Promise.all(promises).then(success => {

        // }, error => {

        // });
      });
    }else{
      infoLogContext.innerHTML = "<p> Keep Calm and take a coffee, Devis process is already processing !"
      infoLogContext.style.visibility = "visible";
      setTimeout(() => {
        infoLogContext.style.visibility = "hidden";
      }, 2000);
    }
    
  }

}
