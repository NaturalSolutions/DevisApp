class TasksParser{
	constructor(){
	}

	setError(url, tasksId) {
		//console.log('errors', arguments)
		$('#errorLink').append('<a href="' + url + '">' + tasksId + '</a><br>')
	}


	fillUserTab(tab, initiales, value) {
		if (!tab.find(x => x.initials == initiales)) {
			tab.push({ initials: initiales, value: parseInt(value) });
		} else {
			var index = tab.findIndex(x => x.initials == initiales);
				tab[index].value += parseInt(value);
		}
		return tab;
	}

	getInfoFromTasks(tasks, storyId, projectId, isFactu) {
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
								alert('Probleme d\'estimation et initiales dans la tâche : ' + this.id + ' de la storie n° : ' + this.story_id + ' n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id)
								_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id,this.id);
							} else {
								for (var i in owners) {
									ressource = _this.fillUserTab(ressource, owners[i], tabDuree[i], bonusState);
								}
							}
							//this.description = this.description.trim().replace(regex, "");
						} else {
							this.duree = null;
						}
						alert('Probleme d\'estimation dans la tâche : ' + this.id + ' de la storie n° : ' + this.story_id + ' n\'est attribué et/ou n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id +'/tasks/' + this.id)
					} else {
						alert('Probleme d\'initales dans la tâche : ' + this.id + ' de la storie n° : ' + this.story_id + ' n\'est attribué.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id)
						_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id,this.id);
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
							alert('Probleme d\'estimation dans la tâche : ' + this.id + ' de la storie n° : ' + this.story_id + ' n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id)
							_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id,this.id);
						}
					} else {
						alert('Probleme d\'initales dans la tâche : ' + this.id + ' de la storie n° : ' + this.story_id + ' n\'est attribué.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id)
						_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id,this.id);
					}
					}
			} else { //Si la story ne peut pas etre découpée alors elle n'est pas estimée et ou attribuée
				alert('La tâche : ' + this.id + ' de la storie n° : ' + this.story_id + ' n\'est pas attribué et/ou n\'est pas estimée.\r\n https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id);
				_this.setError('https://www.pivotaltracker.com/n/projects/' + projectId + '/stories/' + this.story_id + '/tasks/' + this.id,this.id);
			}
		});
		return ressource;
	}



} // TasksParser
