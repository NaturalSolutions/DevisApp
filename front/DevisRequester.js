class DevisRequester{
	constructor(epic){
		this.epic = epic;
		this.myValableProjets = 0;
		this.myStories = 0;
		this.myFuckingTasks = 0;
		this.transMuter = new transmuter();
	}

	getmyValableProjets(){return this.myValableProjets;}
	getmyStories(){return this.myStories;}
	getmyFuckingTasks(){return this.myFuckingTasks;}

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


	/* va récupérer tout les projets concernant un epic */
	async getProjectFromEpic(myProjectsIds){
		let _this = this;
		let epics;
		let projectvalable = [];
		let epicsAdder = new Set();
		let epicsArray;
		let caller = new Caller();
		for(let idProjet in myProjectsIds){
			let result = await _this.get("https://www.pivotaltracker.com/services/v5/projects/"+myProjectsIds[idProjet].id+"/epics").then((res) => {
				for(let u in res){
					if(res[u].name.toLowerCase() === _this.epic.toLowerCase()){
						projectvalable.push(myProjectsIds[idProjet]);
						 $('#resultOption').append('<br><p>'+myProjectsIds[idProjet].name+'<p><br>');
					}	
				}
			});
		}
		$('#projets').show();
		_this.getProjectStories(projectvalable);
		this.transMuter.transmuteProjects(projectvalable);
	}





	///Récupère l'ensemble des stories d'un projet.
	///Param : projectId -> id du projet dans PT
	///Return : [objects] repésentant les personnes impliquées dans le projet

	checkifBonus(labels){
		for(let i in labels){
			//console.log("label",labels[i]);
			if(labels[i].name == "bonus"){
				return true;
			}
			return false;
		}
	}

	async getProjectStories(projectIds) {
		let _this = this;
		let stories = [];
		for(let i in projectIds){
			let result = await _this.get("https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories"+"?with_label="+this.epic).then((r) => {
				for(let i in r){
						if(r[i].story_type.toLowerCase() != 'release' && _this.checkifBonus(r[i].labels) == false){
							stories.push(r[i]); // renvoie les stories d'un projet correspondant a un epic 
							$('#resultOptionStories').append('<br><p>'+r[i].name+'<p><br>');
						}
				}
			})
		}
		$('#stories').show();
		_this.getTaks(projectIds,stories);
		this.transMuter.transmuteStories(stories);
	}


	async getTaks(projectIds,storiesIds){
		let tasks = [];
		let _this = this;
		for(let i in projectIds){
			let relatedStories = storiesIds.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
			for(let s in relatedStories){
				let result = await _this.get("https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories/" + relatedStories[s].id + "/tasks").then((res) => {
					for(let i in res){
						tasks.push(res[i]);
						$('#resultOptionTasks').append('<br><p>'+res[i].description+'<p><br>');
					}
				})
			}
		}
		$('#taks').show();
		let projetid =  projectIds.map(o => o.id);
		let storiesid = storiesIds.map(o => o.id);
		let parser = new TasksParser();
		this.transMuter.transmuteTasks(tasks);
		console.log(parser.getInfoFromTasks(tasks,storiesid,projetid,false));	
	}	

}

	///Récupère l'ensemble des epics d'un projet.
	///Param : projectId -> id du projet dans PT
	///Return : [objects] repésentant les epics du projets
	/*function getProjectsFromEpics(Epic) {
		var projects; // objet de renvoi
		$.ajax({
			url: "https://www.pivotaltracker.com/services/v5/projects/" + projectId + "/epics",
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc');
			},
			async: false,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			processData: false,
			success: function (data) {
				epics = data;
			},
			error: function () {
				alert("Cannot get data");
			}
		});
		return projects;
	}
	




	///Récupère l'ensemble des epics d'un projet.
	///Param : projectId -> id du projet dans PT
	///Return : [objects] repésentant les epics du projets
	/*getEpics(projectId) {
		var epics;
		$.ajax({
			url: "https://www.pivotaltracker.com/services/v5/projects/" + projectId + "/epics",
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc');
			},
			async: false,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			processData: false,
			success: function (data) {
				epics = data; // j'affecte ma valeur de retour 
			},
			error: function () {
				alert("Cannot get data");
			}
		});
		return epics;
	}*/

/*

	/*A REDEFINIR*/







/*

	getTasksInfos(projectId, storyId, toFactu = false) {
		var myTempTasks = [];
		$.ajax({
			url: "https://www.pivotaltracker.com/services/v5/projects/" + projectId + "/stories/" + storyId + "/tasks",
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc');
			},
			async: false,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			processData: false,
			success: function (data) {
				myTempTasks = data;
			},
			error: function () {
				alert("Cannot get data");
			}
		});
		var ressource = [];
			//On assigne les différentes informations aux taches (durée, éxecutant, imgCllass)
			if (!toFactu) {
				var ressource = this.parseAndFillTasks(myTempTasks, storyId, projectId, false);
			} else {
				var ressource = this.parseAndFillTasks(myTempTasks, storyId, projectId, true);
			}
			
		return ressource;
	}




	manageResult(result, newInfos) {
		for (var i in newInfos) {
			if (newInfos[i]) {
				var index = result.findIndex(x => x.initials == newInfos[i].initials);
				if (result.find(x => x.initials == newInfos[i].initials)) {
					if (newInfos[i].value) {
						if (result[index].value) {
							result[index].value += parseInt(newInfos[i].value);
						}else {
							result[index].value = parseInt(newInfos[i].value);
						}
					}
					if (newInfos[i].valueWE) {
						if (result[index].valueWE) {
							result[index].valueWE += parseInt(newInfos[i].valueWE);
						} else {
							result[index].valueWE = parseInt(newInfos[i].valueWE);
						}
					}
					if (newInfos[i].valueF) {
						if (result[index].valueF) {
							result[index].valueF += parseInt(newInfos[i].valueF);
						} else {
							result[index].valueF = parseInt(newInfos[i].valueF);
						}
					}
				} else {
					result.push(newInfos[i]);
				}
			}
		}
		return result;
	}



	calculateTasks(stories, projectId, toFactu = false) {
		//amo part
		var result = {
			amo: [],
			des: [],
			dev: []
		};
		if (stories) {
			for (var i in stories.amo) {
				result.amo = manageResult(result.amo, getTasksInfos(projectId, stories.amo[i].id, toFactu));
			}
			for (var j in stories.des) {
				result.des = manageResult(result.des, getTasksInfos(projectId, stories.des[j].id, toFactu))
			}
			for (var k in stories.dev) {
				result.dev = manageResult(result.dev, getTasksInfos(projectId, stories.dev[k].id, toFactu))
			}
		}
		if (!toFactu) {
			Backbone.trigger('returnProcess', result);
		} else {
			//Backbone.trigger('returnFactuProcess', result);
			return result;
		}
	}





fillUserTab(tab, initiales, value, bonusState) {
		if (bonusState == '' || bonusState === undefined || bonusState == null) { // si c'est pas bonus
			if (!tab.find(x => x.initials == initiales)) {
				tab.push({ initials: initiales, value: parseInt(value) });
			} else {
				var index = tab.findIndex(x => x.initials == initiales);
				if (tab[index].value) {
					
					tab[index].value += parseInt(value);
				} else {
					
					tab[index].value = parseInt(value);
				}
			}
		} else if (bonusState == 'we') {
			if (!tab.find(x => x.initials == initiales)) {
				tab.push({ initials: initiales, valueWE: parseInt(value) });
			} else {
				var index = tab.findIndex(x => x.initials == initiales);
				if (tab[index].valueWE) {				
					tab[index].valueWE += parseInt(value);
				} else {
					tab[index].valueWE = parseInt(value);
				}
			}
		} else if (bonusState == 'f') {
			if (!tab.find(x => x.initials == initiales)) {
				tab.push({ initials: initiales, valueF: parseInt(value) });
			} else {
				var index = tab.findIndex(x => x.initials == initiales);
				if (tab[index].valueF) {				
					tab[index].valueF += parseInt(value);
				} else {
					tab[index].valueF = parseInt(value);
				}
			}
		}
		return tab;
	}

*/