/*async function loadData(){
  let jose = fetch('https://www.pivotaltracker.com/services/v5/projects', {
    headers: {
      'X-TrackerToken': 'b4a752782f711a7c564221c2b0c2d5dc'
    }
  }).then(() => {return 'coucoucoucoucocu';});
}
*//*

let get = function(url,merde){
  let xhr  = new window.XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4){
      merde(xhr.responseText);  
    }    
  }
  xhr.open('GET',url,true);
  xhr.send();
}
*/
(() => {
	"use strict";

	$(document).ready(($) =>{
		  $('#devis').click(() => {
  		 	$('#processRecup').slideDown();
  		 	let myRecuperator = new epicRecuperator();
  		 	$('#div_selecteur').append('<select id="selector"></select>');
  		 	let projectsIds = myRecuperator.getAllProjectsId();
        alert("projectsIds : " + projectsIds);
  		 	let listID = myRecuperator.getAllEpics(projectsIds);
  		 	$('#selector').append('<option></option>');
  		 	for(let i in listID){
  		 		$('#selector').append('<option>'+listID[i]+'</option>');
  		 	}
  		 	$('#selector').on('change',() => {
            //alert($('#selector').val());
       			let devis = new DevisRequester($('#selector').val());
       			let result = devis.getProjectFromEpic(projectsIds);
       			let resultStories = devis.getProjectStories(result);
       			let resultTasks = devis.getTaks(result,resultStories);
            //console.log(result);
       			for(let i in result){    				
       				console.log(result[i]);
              $('#resultOption').append('<br><p>'+result[i].name+'<p><br>');
       			}
       			for(let u in resultStories){    				
       				$('#resultOptionStories').append('<br><p>'+resultStories[u].name+'<p><br>');
       			}

       			for(let z in resultTasks){    				
       				$('#resultOptionTasks').append('<br><p>'+resultTasks[z].description+'<p><br>');
       			}
  		 	});
		 });  
/*
    var couilles = function(){
       get('https://www.pivotaltracker.com/services/v5/projects/',function(response){
          var rep= JSON.parse(response);
          console.log(rep);
       })
    }

    let caller = new Caller();
    caller.executeQuerys(2,'https://www.pivotaltracker.com/services/v5/projects/');*/
	});	
})();
