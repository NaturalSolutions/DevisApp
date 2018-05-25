import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';

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
  Angularget(configUrl){
    return this.http.get(configUrl,{
      headers : {
        'X-TrackerToken':'b4a752782f711a7c564221c2b0c2d5dc',
        'Content-Type':'application/json'
      }
    });
  }


  async getAllProjectsId(){
		let myProjectsIds;
		let $this = this;

		await $this.Angularget('https://www.pivotaltracker.com/services/v5/projects').subscribe((res : any[]) => {
			//console.log("testComplet",res);
			let toAdd = [];
			console.log('result', res);
			console.log('schtroudel',res.filter(o => o.description == 'reneco'))
			//let projects = res.filter(o => o.description == 'reneco');
			// let projects = [];
			// for(let i in projects) {
			// 		projects.sort(function (a, b) {
			// 		if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
			// 		if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
			// 		return 0;
			// 	});	
			// 	toAdd.push(res[i]);
			// }
			// this.idProjets = toAdd;
			// let c = $this.getAllEpics(toAdd).then((r) => {
			// 	$('#etape3').html('I have all the epics').css({
			// 		"background-color" : "green",
			// 		"width" : "400px",
			// 		"border-radius" : "30px",
			// 		"color" : "white",
			// 		"margin" : "auto",
			// 		"margin-bottom" : "10px",
			// 		"text-align" : "center"
			// 	});
			// 	//console.log('epics ',r);
			// 	$('#selector').append('<option></option>');
  		//  		for(let i in r){
  		//  			$('#selector').append('<option>'+r[i]+'</option>');
  		//  		}
			// });
			
		})
		// .catch((error) => {
		// 	alert(error.code);
		// 	$('#erreurlog').html(error.message).css({
		// 		"background-color" : "red",
		// 		"width" : "800px",
		// 		"border-radius" : "30px",
		// 		"margin" : "auto",
		// 		"margin-bottom" : "10px",
		// 		"color" : "white",
		// 		"text-align" : "center"
		// 	});
		// });
	};


}
