class DevisRequester{
	constructor(epic){
		this.epic = epic;
		this.caller = new Caller();
	}


	/*TO DO */
	getProjectFromEpic(myProjectsIds){
		 /* va récupérer tout les projets concernant un epic */
		let epics;
		let projectvalable = [];
		let epicsAdder = new Set();
		let epicsArray;
		let _this = this;
		let caller = new Caller();
		for(let idProjet in myProjectsIds){
			//let result = await caller.executeQuery(myProjectsIds.length,"test");
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
					for(let u in info){
						if(info[u].name.toLowerCase() === _this.epic.toLowerCase()){
							projectvalable.push(myProjectsIds[idProjet]);
						}	
					}
				},
				error: function () {
					alert("cannot access data")
				}
			});
/*			if(myProjectsIds[idProjet].name.toLowerCase() == this.epic.toLowerCase()){
				projectvalable.push(myProjectsIds[idProjet]);
			}
*/		}
		
		$('#projets').show();
		//console.log('projet : '+ projectvalable);
		return projectvalable;
	}



	///Récupère l'ensemble des stories d'un projet.
	///Param : projectId -> id du projet dans PT
	///Return : [objects] repésentant les personnes impliquées dans le projet

	checkifBonus(labels){
		for(let i in labels){
			console.log("label",labels[i]);
			if(labels[i].name == "bonus"){
				return true;
			}
			return false;
		}
	}
	getProjectStories(projectIds) {
		let stories = [];
		let _this = this;
		for(let i in projectIds){
			/*alert(projectIds[i].id);*/
			$.ajax({
				url: "https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories"+"?with_label="+this.epic,
				beforeSend: function (xhr) {
					xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc');
				},
				async: false,
				type: 'GET',
				dataType: 'json',
				contentType: 'application/json',
				processData: false,
				success: function (data) {
					for(let i in data){
						if(data[i].story_type.toLowerCase() != 'release' && _this.checkifBonus(data[i].labels) == false){
							stories.push(data[i]); // renvoie les stories d'un projet correspondant a un epic 
						}
					}
				},
				error: function () {
					alert("Cannot get data");
				}
			});
		}
		$('#stories').show();
		alert(stories.length)
		return stories; 
	}

	getTaks(projectIds,storiesIds){
		
		let tasks = [];
		for(let i in projectIds){
			
			console.log('gettasks argyuments', projectIds[i], storiesIds);

			let relatedStories = storiesIds.filter(o => o.project_id == projectIds[i].id && o.story_type != 'release');
			

			console.log('relatedStories', relatedStories , "storiesIds" ,storiesIds )
			
			for(let s in relatedStories){
				$.ajax({
					url: "https://www.pivotaltracker.com/services/v5/projects/" + projectIds[i].id + "/stories/" + relatedStories[s].id + "/tasks",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc');
					},
					async: false,
					type: 'GET',
					dataType: 'json',
					contentType: 'application/json',
					processData: false,
					success: function (data) {
						for(let i in data){
							tasks.push(data[i]);
						}
					},
					error: function () {
						console.log('ça marche pas');
					}
				});
			}
		}
		$('#taks').show();
		return tasks; 
	}


	// fonction de parse
	fillAndGetRessourcesFromTasks(tasks, storyId, projectId, isFactu) {
		var ressource = []; 									//initialisation tableaux vide
		var _this = this;  										// récupération contexte
		$.each(tasks, function () {
			var tabDescrInfo = this.description.split('.-');
			if (tabDescrInfo.length <= 1) {
				tabDescrInfo = this.description.split('. -');
			}
			var isWE = false;
			var bonusState = null;
			if (isFactu) {
				var regexWE = /(\@[wW])$/;
				if (tabDescrInfo[1].trim().match(regexWE)) {				
					isWE = true;
					bonusState = 'we';
					tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regexWE, "");
				} else {
					var regexF = /(\@[fF])$/;
					if (tabDescrInfo[1].trim().match(regexF)) {
						bonusState = 'f';
						tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regexF, "");
					}
				}
			}
			if (tabDescrInfo.length > 1) {
				var regex = /\+/; //cherche "+" dans le text , Si n programming
				//TODO tester le + sur la partie splité de la description
				if (tabDescrInfo[1].trim().match(regex)) {
					//cherche les initals dans le text
					//regex = /[A-Z]+(\+[A-Z]+)+/
					regex = /[A-Z]{2,}(\+[A-Z]{2,})+$/
					if (tabDescrInfo[1].trim().match(regex)) {
						var ownerBrut = regex.exec(tabDescrInfo[1].trim());
						var owners = ownerBrut[0].split("+");
						tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regex, "");
						regex = /\(?\d+(\+\d+)+\)?/; //Cherche les durees dans le text
						if (tabDescrInfo[1].trim().match(regex)) {
							var duree = 0;
							var regexParenth = /\)$/;
							var tabDureeBrut;
							tabDureeBrut = regex.exec(tabDescrInfo[1].trim());
							tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regex, "");
							var tabDuree = tabDureeBrut[0].split('+');
							if (tabDuree.length != owners.length) {
								alert('Probleme d\'estimation et initiales dans la tâche : ' + this.id + ' de la storie n° : ' + storyId + ' n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id)
								_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id, this.id)
							} else {
								for (var i in owners) {
									ressource = _this.fillUserTab(ressource, owners[i], tabDuree[i], bonusState);
								}
							}
							//this.description = this.description.trim().replace(regex, "");
						} else {
							this.duree = null;
						}
						//alert('Probleme d\'estimation dans la tâche : ' + this.id + ' de la storie n° : ' + storyId + ' n\'est attribué et/ou n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId +'/tasks/' + this.id)
					} else {
						alert('Probleme d\'initales dans la tâche : ' + this.id + ' de la storie n° : ' + storyId + ' n\'est attribué.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id)
						_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id, this.id)
					}
				}
				//Tache solo
				else {
					//CHerche l'owner de la tache
					regex = /[A-Z]{2,}$/;
					var owner_initial;
					if (tabDescrInfo[1].trim().match(regex)) {
						var taskMemeber = regex.exec(tabDescrInfo[1].trim())[0];
						owner_initial = taskMemeber;
						tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regex, "");
						//La duree
						regex = /\(?(\d)+\)?$/;
						if (regex.exec(tabDescrInfo[1].trim())) {
							var regexParenth = /\)$/
							var duree = 0;
							duree = regex.exec(tabDescrInfo[1].trim())[0];
							tabDescrInfo[1] = tabDescrInfo[1].trim().replace(regex, "");
							ressource = _this.fillUserTab(ressource, owner_initial, duree, bonusState)
							}
						else {
							alert('Probleme d\'estimation dans la tâche : ' + this.id + ' de la storie n° : ' + storyId + ' n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id)
							_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id, this.id)
						}
					} else {
						alert('Probleme d\'initales dans la tâche : ' + this.id + ' de la storie n° : ' + storyId + ' n\'est attribué.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id)
						_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id, this.id)
					}
					}
			} else { //Si la story ne peut pas etre découpée alors elle n'est pas estimée et ou attribuée
				alert('La tâche : ' + this.id + ' de la storie n° : ' + storyId + ' n\'est pas attribué et/ou n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id);
				_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + storyId + '/tasks/' + this.id, this.id)
			}
		});
		return ressource;
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
	*/




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
	function setError(url, tasksId) {
		$('#errorLink').append('<a href="' + url + '">' + tasksId + '</a>')
	}*/



	// je sais pas a quoi elle sert cette fonction
/*
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







*/