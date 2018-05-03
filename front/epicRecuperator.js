 class epicRecuperator{
 	constructor(){
 		this.idProjets = 0;
 	}
 	get(url) {
		var xhr = new window.XMLHttpRequest();
		return new Promise((resolve,reject) => {
			xhr.onreadystatechange = function(){
			if(xhr.readyState === 4){
				if(xhr.status === 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject(xhr);
					}
				}
			}
			xhr.open('GET',url,true);
			xhr.setRequestHeader('X-TrackerToken','b4a752782f711a7c564221c2b0c2d5dc','Content-Type','application/json');
			xhr.send();
		});
	};

	getMemberIdProjets(){
		return this.idProjets;
	}
	
	async getAllProjectsId(){
		let myProjectsIds;
		let _this = this;
		$('#etape1').html('Initiate procedure to get all the Epics').css({
			"background-color" : "green",
			"width" : "400px",
			"border-radius" : "30px",
			"color" : "white",
			"margin" : "auto",
			"margin-bottom" : "10px",
			"text-align" : "center"
		});

		await _this.get('https://www.pivotaltracker.com/services/v5/projects').then((res) => {
			$('#etape2').html('I have all the projects').css({
				"background-color" : "green",
				"border-radius" : "30px",
				"width" : "400px",
				"color" : "white",
				"margin" : "auto",
				"margin-bottom" : "10px",
				"text-align" : "center"
			});	
			console.log("testComplet",res);
			let toAdd = [];
			let projects = res.filter(o => o.description == 'reneco');
			for(let i in projects) {
					projects.sort(function (a, b) {
					if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
					if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
					return 0;
				});	
				toAdd.push(res[i]);
			}
			this.idProjets = toAdd;
			let c = _this.getAllEpics(toAdd).then((r) => {
				$('#etape3').html('I have all the epics').css({
					"background-color" : "green",
					"width" : "400px",
					"border-radius" : "30px",
					"color" : "white",
					"margin" : "auto",
					"margin-bottom" : "10px",
					"text-align" : "center"
				});
				console.log('epics ',r);
				$('#selector').append('<option></option>');
  		 		for(let i in r){
  		 			$('#selector').append('<option>'+r[i]+'</option>');
  		 		}
			});
			
		}).catch((error) => {
			$('#erreurlog').html('Unable to get projects').css({
					"background-color" : "red",
					"width" : "400px",
					"border-radius" : "30px",
					"margin" : "auto",
					"margin-bottom" : "10px",
					"color" : "white",
					"text-align" : "center"
				});
		});
	};


	async getAllEpics(myProjectsIds){ /* va parcourir tout les projets et récuperer les epics et les foutre dans un tableaux */
		let epics;
		let epicsAdder = new Set();
		let epicsArray;
		let _this = this;
		let compter = myProjectsIds.length;
		for(let idProjet in myProjectsIds){
			await _this.get('https://www.pivotaltracker.com/services/v5/projects/'+myProjectsIds[idProjet].id+'/epics').then((data) => {
				let tabNames = data.map(o => epicsAdder.add(o.name.toLowerCase()));
			}).catch((error) => {
				$('#erreurlog').html('Unable to get epics').css({
					"background-color" : "red",
					"width" : "400px",
					"margin" : "auto",
					"margin-bottom" : "10px",
					"border-radius" : "30px",
					"color" : "white",
					"text-align" : "center"
				});
			});
		}
		epicsArray = Array.from(epicsAdder);
		epics = epicsArray.sort(function (a, b) {
			if (a.toLowerCase() < b.toLowerCase()) return -1; // pas trop trop compris ce qu'étais les objets a et b
			if (a.toLowerCase() > b.toLowerCase()) return 1;
			return 0;
		});
		console.log(epics);
		return epics;
	}
 }