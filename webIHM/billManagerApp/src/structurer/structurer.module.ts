import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class StructurerModule {
	constructor(private http : HttpClient){
	}

  public Angularget(configUrl) {
    return this.http.get(configUrl);
  }
	
	public getProjetStructure(){
		return new Promise((resolve,reject) => {
			this.Angularget("http://localhost/DevisAPI/api/Projet/getStructure").toPromise().then((res) => {
				resolve(res);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	public getStoriesStructure(){
		return new Promise((resolve,reject) => {
			this.Angularget("http://localhost/DevisAPI/api/Stories_d/getStructure").toPromise().then((res) => {
				resolve(res);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	public getTasksStructure(){
		return new Promise((resolve,reject) => {
			this.Angularget("http://localhost/DevisAPI/api/Tasks_d/getStructure").toPromise().then((res) => {
				resolve(res);
			}).catch((error) => {
				reject(error);
			});
		});
	}

 }
