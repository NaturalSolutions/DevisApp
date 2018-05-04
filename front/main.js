(() => {
	"use strict";

	$(document).ready(($) =>{
		  $('#devis').click(() => {
  		 	$('#processRecup').slideDown();
  		 	let myRecuperator = new epicRecuperator();
  		 	$('#div_selecteur').append('<select id="selector"></select>');
  		 	let listID;
       // myRecuperator.recupResult();
        //getget();
        let projectsIds = myRecuperator.getAllProjectsId();
  		 	
  		 	$('#selector').on('change',() => {
       			let devis = new DevisRequester($('#selector').val());
       			let result = devis.getProjectFromEpic(myRecuperator.getMemberIdProjets());
  		 	});
		  }); 
      console.log("mes Structures");
      let s = new Structurer();
      
      s.getProjetStructure().then((res) => {
        console.log(res);
      });

      s.getStoriesStructure().then((res) => {
        console.log(res);
      });

      s.getTasksStructure().then((res) => {
        console.log(res);
      });
	});	
})();
