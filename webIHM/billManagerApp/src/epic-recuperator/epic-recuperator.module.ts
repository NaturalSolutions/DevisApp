import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import { observable } from 'rxjs/internal/symbol/observable';
import { Observable } from 'rxjs/internal/Observable';
import { resetFakeAsyncZone } from '@angular/core/testing';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],
  declarations: []
})
export class EpicRecuperatorModule {
  constructor(private http: HttpClient) { }

  Angularget(configUrl) {
    return this.http.get(configUrl, {
      headers: {
        'X-TrackerToken': 'b4a752782f711a7c564221c2b0c2d5dc',
        'Content-Type': 'application/json'
      }
    });
  }


  getAllProjectsId(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.Angularget('https://www.pivotaltracker.com/services/v5/projects').subscribe((res: Array<any>) => {
        let projects = [];
        projects = res.filter(o => o.description == 'reneco');
        projects.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        });
        resolve(projects);
      });
    });
  }


  getAllEpics(ProjectsArray) : Promise<any[]> { 
    return new Promise<any[]>((resolve,reject) => {
      let epics;
      let epicsAdder = [];
      let epicsArray;
      let compter = ProjectsArray.length;
      for(let idProjet in ProjectsArray){
          this.Angularget('https://www.pivotaltracker.com/services/v5/projects/'+ProjectsArray[idProjet].id+'/epics').subscribe((data: Array<any>) => {
         // let tabNames = data.map(o => epicsAdder.add(o.name.toLowerCase()));
         data.forEach(epic => {
          let prevs:any[] = epicsAdder.filter(prevEpic => {
            return prevEpic.name.toLowerCase().trim() == epic.name.toLowerCase().trim();
          });
          if (!prevs.length)
            epicsAdder.push(epic);
         });
          ProjectsArray[idProjet].epicName = data.map(o => o.name.toLowerCase()); 
        });
      }
       epics = epicsAdder.sort((a, b) => {
         if (a.name.toLowerCase() < b.name.toLowerCase()) return -1; 
         if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
         return 0;
       });
      resolve(epics);
    });
	}


}
