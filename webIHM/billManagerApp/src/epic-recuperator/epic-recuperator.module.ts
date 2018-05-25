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


  // async getAllProjectsId(){
	// 	let myProjectsIds;
	// 	let _this = this;
	// 	$('#etape1').html('Initiate procedure to get all the Epics').css({
	// 		"background-color" : "green",
	// 		"width" : "400px",
	// 		"border-radius" : "30px",
	// 		"color" : "white",
	// 		"margin" : "auto",
	// 		"margin-bottom" : "10px",
	// 		"text-align" : "center"
	// 	});

	// 	await _this.get('https://www.pivotaltracker.com/services/v5/projects').then((res) => {
	// 		$('#etape2').html('I have all the projects').css({
	// 			"background-color" : "green",
	// 			"border-radius" : "30px",
	// 			"width" : "400px",
	// 			"color" : "white",
	// 			"margin" : "auto",
	// 			"margin-bottom" : "10px",
	// 			"text-align" : "center"
	// 		});	
	// 		//console.log("testComplet",res);
	// 		let toAdd = [];
	// 		let projects = res//.filter(o => o.description == 'reneco');
	// 		for(let i in projects) {
	// 				projects.sort(function (a, b) {
	// 				if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
	// 				if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
	// 				return 0;
	// 			});	
	// 			toAdd.push(res[i]);
	// 		}
	// 		this.idProjets = toAdd;
	// 		let c = _this.getAllEpics(toAdd).then((r) => {
	// 			$('#etape3').html('I have all the epics').css({
	// 				"background-color" : "green",
	// 				"width" : "400px",
	// 				"border-radius" : "30px",
	// 				"color" : "white",
	// 				"margin" : "auto",
	// 				"margin-bottom" : "10px",
	// 				"text-align" : "center"
	// 			});
	// 			//console.log('epics ',r);
	// 			$('#selector').append('<option></option>');
  // 		 		for(let i in r){
  // 		 			$('#selector').append('<option>'+r[i]+'</option>');
  // 		 		}
	// 		});
			
	// 	}).catch((error) => {
	// 		alert(error.code);
	// 		$('#erreurlog').html(error.message).css({
	// 			"background-color" : "red",
	// 			"width" : "800px",
	// 			"border-radius" : "30px",
	// 			"margin" : "auto",
	// 			"margin-bottom" : "10px",
	// 			"color" : "white",
	// 			"text-align" : "center"
	// 		});
	// 	});
	// };


}
