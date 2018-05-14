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
			let myCurrentProject = {};
			let result = await _this.get("https://www.pivotaltracker.com/services/v5/projects/"+myProjectsIds[idProjet].id+"/epics").then((res) => {
				for(let u in res){
					if(res[u].name.toLowerCase() === _this.epic.toLowerCase()){
						myCurrentProject = myProjectsIds[idProjet];
						myCurrentProject.listeStories = [];
						projectvalable.push(myCurrentProject);
						 $('#resultOption').append('<br><p>'+myProjectsIds[idProjet].name+'<p><br>');
					}	
				}
				$('#projets').show();
				_this.getProjectStories(projectvalable).then((res) => {
				//console.log('projectIds tout complet',projectvalable);
				_this.transMuter.transmuteProjects(projectvalable);			
				})
			});
		}
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
		//console.log("projectIds",projectIds);
		//console.log(projectIds);
		let _this = this;
		let stories = [];
		for(let i in projectIds){
			let result = _this.get("https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories"+"?with_label="+this.epic)
			.then((r) => {
			let myCurrentStory = {};
			let cpt = 0;
				for(let u in r){
						if(r[u].story_type.toLowerCase() != 'release' && _this.checkifBonus(r[u].labels) == false){
							myCurrentStory = r[u];
							myCurrentStory.listeTaches = [];
							stories.push(myCurrentStory); // renvoie les stories d'un projet correspondant a un epic 	
							//console.log("liste stories existe dans ce projet ",projectIds[i].listeStories);
							if(!(projectIds[i].listeStories == undefined) && !(myCurrentStory == undefined)){
								projectIds[i].listeStories.push(myCurrentStory);	
							}
							for(let o in r[u].labels){
								//alert(r[i].labels[o].name.toLowerCase());
								if(r[u].labels[o].name == "amo"){
									r[u].AMO = true;
									//console.log("true" , r[i].name);
									//console.log("isAMO actuel ",r[i].isAMO);
								}
							}
							if(r[u].AMO == undefined){
								r[u].AMO = false;
							}
							$('#resultOptionStories').append('<br><p>'+r[u].name+'<p><br>');
						}
						$('#stories').show();
						//console.log("projectIds debug",projectIds)
				}
				this.getTaks(stories,projectIds).then((tasks) => {
					_this.transMuter.transmuteTasks(tasks);
				});

				this.transMuter.transmuteStories(stories);
				//this.transMuter.transmuteStories(stories);
			})
		}
	}





/*

	async getTaks(projectIds,storiesIds){
		let tasks = [];
		console.log("getTasks(): ", projectIds);
		let _this = this;
		projectIds.map(p => p.listeStories)
				  .map(s => {
				  	let result = await _this.get("https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories/" + projectIds.listeStories[s].id + "/tasks")
				  })
		/*for(let i=0; i < projectIds.length; i++){
			//let storiesIds;//.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
			//console.log("storiesIds",storiesIds);

			console.debug(projectIds[i].id)

			for(let s in projectIds[i].listeStories){
				alert('il ne veut pas passer la dedans');
				projectIds.listeStories[s].listeTaches = new Array();
				let result = await _this.get("https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories/" + projectIds.listeStories[s].id + "/tasks").then((res) => {
					for(let u in res){
						tasks.push(res[u]);
						projectIds.listeStories[s].listeTaches.push(res[u]);
						$('#resultOptionTasks').append('<br><p>'+res[u].description+'<p><br>');
					}
				})
			}
		}*/
	
	/*	$('#taks').show();
		let projetid =  projectIds.map(o => o.id);
		let storiesid = [];
		for(let k in projectIds){
			storiesid.push(projectIds[k].id); 
		}
		let parser = new TasksParser();
		this.transMuter.transmuteTasks(parser.getInfoFromTasks(tasks,storiesid,projetid,false));
		//this.transMuter.sendToServer();
	}	
*/
/*
	async getTaks(projectIds,storyId){
		let tasks = [];
		//console.log("c'est vide ???? ",projectIds);
		let _this = this;
		for(let i in projectIds){
			//let storiesIds;//.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
			//console.log("storiesIds",storiesIds);
			i = parseInt(i);
			for(let s in projectIds[i].listeStories){
				alert('il ne veut pas passer la dedans');
				projectIds[i].listeStories[s].listeTaches = new Array();
				let result = await _this.get("https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories/" + projectIds[i].listeStories[s].id + "/tasks").then((res) => {
					for(let u in res){
						tasks.push(res[u]);
						projectIds[i].listeStories[s].listeTaches.push(res[u]);
						$('#resultOptionTasks').append('<br><p>'+res[u].description+'<p><br>');
					}
				})
			}
		}
		$('#taks').show();
		let projetid =  projectIds.map(o => o.id);
		let storiesid = [];
		for(let k in projectIds){
			storiesid.push(projectIds[k].id); 
		}
		let parser = new TasksParser();
		this.transMuter.transmuteTasks(parser.getInfoFromTasks(tasks,storiesid,projetid,false));
		console.log('projectIds tout complet',projectIds);		//this.transMuter.sendToServer();
	}	*/




	getTaks(storiesIds,projectIds){
		let tasks = [];
		//console.log("c'est vide ???? ",projectIds);
		let _this = this;
		//console.log("story",story);
		for(let i in projectIds){
			let strfiltered = storiesIds.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
			console.log("strfiltered",strfiltered);
			i = parseInt(i);
			return new Promise((resolve,reject) => {
				for(let s in strfiltered){
					/*alert('il ne veut pas passer la dedans');*/
					projectIds[i].listeStories[s].listeTaches = new Array(); 
					let result = _this.get("https://www.pivotaltracker.com/services/v5/projects/" + strfiltered[s].project_id + "/stories/" + strfiltered[s].id + "/tasks").then((res) => {
					for(let u in res){
						tasks.push(res[u]);
						strfiltered[s].listeTaches.push(res[u]);
						$('#resultOptionTasks').append('<br><p>'+res[u].description+'<p><br>');
					}
					resolve(tasks);	
					$('#taks').show();
					let projetid =  projectIds.map(o => o.id);
					let storiesid = [];
					for(let k in projectIds){
						storiesid.push(projectIds[k].id); 
					}
					let parser = new TasksParser();
					if(strfiltered[s].id != undefined && tasks != undefined && strfiltered[s].project_id != undefined){
						parser.getInfoFromTasks(tasks,strfiltered[s].id,strfiltered[s].project_id,false);
					}
					//console.log('projectIds tout complet',projectIds);		//this.transMuter.sendToServer();
				})
				}				
			})
		}
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