import { Component, OnInit } from '@angular/core';
import {EpicRecuperatorModule} from '../epic-recuperator/epic-recuperator.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-generator',
  templateUrl: './file-generator.component.html',
  styleUrls: ['./file-generator.component.css'],
})
export class FileGeneratorComponent implements OnInit {

  private divVisibility;
  private DevisProcessLauched;
  constructor(private epicRecuperator : EpicRecuperatorModule, private http: HttpClient) {
    this.divVisibility = false; 
    this.DevisProcessLauched = false;
   }

  ngOnInit() {
  }

  displayOptions () :void {
    let devisScope = document.getElementById('devis');
    let factureScope = document.getElementById('facture');
    if(this.divVisibility == false){
      devisScope.style.visibility = "visible";
      factureScope.style.visibility = "visible";
      this.divVisibility = true;
    }else{
      devisScope.style.visibility = "hidden";
      factureScope.style.visibility = "hidden";
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
      // this.epicRecuperator.Angularget('https://www.pivotaltracker.com/services/v5/projects').subscribe(response => {
      //   console.log("response",response);
      // });
      let objetTransition;
      this.epicRecuperator.getAllProjectsId().then(projects => {
        console.log("res",projects);
        this.epicRecuperator.getAllEpics(projects).then(epics => {
          console.log("epics",epics);
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
