class FactuRequester{
	constructor(){

	}

	/*	// return un objet qui contient une liste de stories accepted et une liste de stories non fini / pas accepté 
	sortAcceptedStories(stories) { // renvoie toute les stories accepté 
		var finishedTab = [];
		var unfinishedTab = [];
		for (var i in stories) {
			if (stories[i].current_state == "accepted") {
				finishedTab.push(stories[i]);
			} else {
				unfinishedTab.push(stories[i]);
			}
		}
		return { finished: finishedTab, unfinished: unfinishedTab };
	}
*/



/*

	getAcceptedStoriesAtDate(projectId, leftDate, rightDate, epic) {
		var stories = {
			amo: [],
			des: [],
			dev: []
		};
		var storiesBonus = {
			amo: [],
			des: [],
			dev: []
		};
		var storiesContainer = $('#stories');
		var amoCont = storiesContainer.find('#amo');
		amoCont.html('');
		var desCont = storiesContainer.find('#des');
		desCont.html('');
		var devCont = storiesContainer.find('#dev');
		devCont.html('');
		//https://www.pivotaltracker.com/services/v5/projects/1621131/stories?with_label=commande 1 - 31 janvier 2018&with_state=accepted	
		//https://www.pivotaltracker.com/services/v5/projects/720865/stories?accepted_after=2017-12-31T00:00:00.000Z&accepted_before=2018-02-01T00:00:00.000Z
		$.ajax({
			url: "https://www.pivotaltracker.com/services/v5/projects/" + projectId + "/stories?with_label=" + epic + "&accepted_after=" + leftDate.add(-1, "days").toISOString() + "&accepted_before=" + rightDate.toISOString(),
			//url: 'https://www.pivotaltracker.com/services/v5/projects/720865/stories?accepted_after=2017-12-31T00:00:00.000Z&accepted_before=' +rightDate.toISOString(),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc');
			},
			async: false,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			processData: false,
			success: function (data) {
				temp_stories = manageResult(data);
				$.each(temp_stories, function () {
					var labels = this.labels.map(o => o.name);
					if (labels.indexOf('bonus') != -1) {
						this.isBonus = true;
					} else {
						this.isBonus = false;
					}
					for (var i in labels) {
						if (labels[i] == 'amo') {
							if (this.isBonus) {
								storiesBonus.amo.push(this);
							} else {
								stories.amo.push(this);
							}
							amoCont.append('<li>' + this.name + '</li>');
						} else if (labels[i] == 'des') {
							if (this.isBonus) {
								storiesBonus.des.push(this);
							} else {
								stories.des.push(this);
							}
							desCont.append('<li>' + this.name + '</li>');
						} else if (labels[i] == 'dev') {
							if (this.isBonus) {
								storiesBonus.dev.push(this);
							} else {
								stories.dev.push(this);
							}
							devCont.append('<li>' + this.name + '</li>');
						}

					}
				})
			},
			error: function () {
				alert("Cannot get data");
			}
		});

		return { stories: stories, bonus: storiesBonus };
	}





	getUnfinishedStories(projectId, epic) {
		var unfinishedStories = []
		$.ajax({
			url: 'https://www.pivotaltracker.com/services/v5/projects/' + projectId + '/stories?with_label=' + epic,
			//url: 'https://www.pivotaltracker.com/services/v5/projects/720865/stories?accepted_after=2017-12-31T00:00:00.000Z&accepted_before=' +rightDate.toISOString(),
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-TrackerToken', 'b4a752782f711a7c564221c2b0c2d5dc');
			},
			async: false,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			processData: false,
			success: function (data) {
				for (var i in data) {
					if (data[i].current_state != 'accepted' && data[i].story_type != 'release') {
						unfinishedStories.push(data[i]);
					}
				}

			}
		});
		return unfinishedStories;
	}

}
*/

}