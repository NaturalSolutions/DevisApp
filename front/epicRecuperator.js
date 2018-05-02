 class epicRecuperator{
 	constructor(){
 	}
	
	getAllProjectsId(){
		let myProjectsIds;
		//let result;
		$('#etape1').html('Initiate procedure to get all the Epics').css({
			"background-color" : "green",
			"width" : "400px",
			"border-radius" : "30px",
			"color" : "white",
			"margin" : "auto",
			"margin-bottom" : "10px",
			"text-align" : "center"
		});
		//let resultat;
		/*alert("avant requete");*/
		/*let jose = fetch('https://www.pivotaltracker.com/services/v5/projects', {
			headers: {
      			'X-TrackerToken': 'b4a752782f711a7c564221c2b0c2d5dc'
    		}
    	}).then(function(response){
       		result = response;
    	
    	});
    	Promise.all([jose]).then((values) => console.log(values));*/
		// let caller = new Caller();
		// console.log(caller.executeQuery('https://www.pivotaltracker.com/services/v5/projects'))
		// let resultat  = caller.executeQuery('https://www.pivotaltracker.com/services/v5/projects')
		// .then(function(result){
		// 	console.log('epicrecuperator', result);
		// })
		
		/*console.log('result obj', result);*/
		

		/*$('#etape2').html('I have all the projects').css({
			"background-color" : "green",
			"border-radius" : "30px",
			"width" : "400px",
			"color" : "white",
			"margin" : "auto",
			"margin-bottom" : "10px",
			"text-align" : "center"
		});
		result.sort(function (a, b) {
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1; // pas trop trop compris ce qu'étais les objets a et b
			if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
			return 0;
		});
		var toAdd = [];
		for (var i in result) {
			if (result[i].description == 'reneco') { // j'ajoutes les projets que si il font partie des projets reneco
			toAdd.push(result[i]);
			console.log("projet :  "+ result[i].name + "  | id  |  " + result[i].id);
			}
		}
		myProjectsIds = toAdd; // j'affecte ma valeur de retour*/

		$.ajax({
			url: "https://www.pivotaltracker.com/services/v5/projects",
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc'); // token de connexion pour recup les projets
			},
			async: false,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			processData: false,
			success: function (data) {
				$('#etape2').html('I have all the projects').css({
					"background-color" : "green",
					"border-radius" : "30px",
					"width" : "400px",
					"color" : "white",
					"margin" : "auto",
					"margin-bottom" : "10px",
					"text-align" : "center"
				});
				data.sort(function (a, b) {
					if (a.name.toLowerCase() < b.name.toLowerCase()) return -1; // pas trop trop compris ce qu'étais les objets a et b
					if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
					return 0;
				});
				var toAdd = [];
				for (var i in data) {
					if (data[i].description == 'reneco') { // j'ajoutes les projets que si il font partie des projets reneco
						toAdd.push(data[i]);
						console.log("projet :  "+ data[i].name + "  | id  |  " + data[i].id);
					}
				}
				myProjectsIds = toAdd; // j'affecte ma valeur de retour
			},
			error: function () {
				$('#erreurlog').html('Unable to get projects').css({
					"background-color" : "red",
					"width" : "400px",
					"border-radius" : "30px",
					"margin" : "auto",
					"margin-bottom" : "10px",
					"color" : "white",
					"text-align" : "center"
				})
			}
		});
		
		return myProjectsIds;
	}

	getAllEpics(myProjectsIds){ /* va parcourir tout les projets et récuperer les epics et les foutre dans un tableaux */
		let epics;
		let epicsAdder = new Set();
		let epicsArray;
		let compter = myProjectsIds.length;
		for(let idProjet in myProjectsIds){
			let tmp = JSON.parse(JSON.stringify(compter - 1));
			compter = compter-1;
			$.ajax({
				url: "https://www.pivotaltracker.com/services/v5/projects/"+myProjectsIds[idProjet].id+"/epics",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc'); // token de connexion pour recup les projets
				},
				async: false,
				type: 'GET',
				dataType: 'json',
				contentType: 'application/json',
				processData: false,
				success: function (info) {
					$('#etape3').html('I have all the epics').css({
					"background-color" : "green",
					"width" : "400px",
					"border-radius" : "30px",
					"color" : "white",
					"margin" : "auto",
					"margin-bottom" : "10px",
					"text-align" : "center"
					});
					let tabNames = info.map(o => epicsAdder.add(o.name.toLowerCase()));$
				},
				error: function () {
					$('#erreurlog').html('Unable to get epics').css({
					"background-color" : "red",
					"width" : "400px",
					"margin" : "auto",
					"margin-bottom" : "10px",
					"border-radius" : "30px",
					"color" : "white",
					"text-align" : "center"
				})
				},
				done : function(){
					--compter;
				}
			});
		}
		epicsArray = Array.from(epicsAdder);
		epics = epicsArray.sort(function (a, b) {
			if (a.toLowerCase() < b.toLowerCase()) return -1; // pas trop trop compris ce qu'étais les objets a et b
			if (a.toLowerCase() > b.toLowerCase()) return 1;
			return 0;
		});

		return epics;
	}
 }