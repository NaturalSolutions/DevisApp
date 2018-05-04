(() => {
	"use strict";

	$(document).ready(($) =>{
		  $('#devis').click(() => {
  		 	$('#processRecup').slideDown();
  		 	let myRecuperator = new epicRecuperator();
  		 	$('#div_selecteur').append('<select id="selector"></select>');
  		 	let listID;
        let projectsIds = myRecuperator.getAllProjectsId();
  		 	
  		 	$('#selector').on('change',() => {
       			let devis = new DevisRequester($('#selector').val());
       			let result = devis.getProjectFromEpic(myRecuperator.getMemberIdProjets());
  		 	});
		  });
	});	
})();
