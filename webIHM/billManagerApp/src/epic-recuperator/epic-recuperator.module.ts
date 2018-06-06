import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import { observable } from 'rxjs/internal/symbol/observable';
import { Observable } from 'rxjs/internal/Observable';
import { resetFakeAsyncZone } from '@angular/core/testing';
import {LogMessageComponent} from '../log-message/log-message.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],
  declarations: []
})
export class EpicRecuperatorModule {
  constructor(private http: HttpClient,private log : LogMessageComponent) { }

  Angularget(configUrl) {
    return this.http.get(configUrl, {
      headers: {
        'X-TrackerToken': 'b4a752782f711a7c564221c2b0c2d5dc',
        'Content-Type': 'application/json'
      }
    });
  }


  getAllProjectsId(): Promise<any[]> {
    this.log.setProcessViewverProperty();
    this.log.setlogProcess('Getting all projects');
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

  getAllEpics(myProjectsIds){ /* va parcourir tout les projets et récuperer les epics et les foutre dans un tableaux */
    this.log.setlogProcess('Getting all epics');
    return new Promise<any[]>((resolve,reject) => {
      let epics;
		  let epicsAdder = new Set();
		  let epicsArray;
      let compter = myProjectsIds.length;
      let promises:Promise<any>[] = [];
        for(let idProjet in myProjectsIds){
          let p = this.Angularget('https://www.pivotaltracker.com/services/v5/projects/'+myProjectsIds[idProjet].id+'/epics')
          .toPromise()
          .then((data : any[]) => {
           let tabNames = data.map(o => epicsAdder.add(o.name.toLowerCase()));
           myProjectsIds[idProjet].epicName = data.map(o => o.name.toLowerCase()); 
           epicsArray = Array.from(epicsAdder);
           epics = epicsArray.sort(function (a, b) {
             if (a.toLowerCase() < b.toLowerCase()) return -1;
             if (a.toLowerCase() > b.toLowerCase()) return 1;
             return 0;
           });
         });
         promises.push(p);
        }
        Promise.all(promises).then(() => {
          resolve(epics);
        })
		});
	}

}
