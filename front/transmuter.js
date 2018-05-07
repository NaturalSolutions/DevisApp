class transmuter{
	constructor(conf){
		this.self = this;
		this.Structurer = new Structurer();
		this.formatConf = conf;
	}

	transmuteTasks(TaskObject){    
		let tasksStructure;
		this.Structurer.getProjetStructure().then((res) => {
        	tasksStructure = JSON.parse(res)
      	});	
	}

	transmuteStories(StoryObject){
		let storyStructure;
		this.Structurer.getStoriesStructure().then((res) => {
        	storyStructure = JSON.parse(res);
      	});
	}

	transmuteProjects(ProjectsObjects){
		//obj bdd
		let projectStructure;
		this.Structurer.getTasksStructure().then((res) => {
        	projectStructure = JSON.parse(res);
        	console.log('projectStructure', projectStructure);
        	let finalObjects = {};
      	let finalListOfObjects;
      	console.log('ConverterProjet',ConverterProjet);
      	console.log('ProjectsObjects',ProjectsObjects);
      	//Boucle sur object config
		for(let i in ConverterProjet){	
      		console.log(i +' : '+ConverterProjet[i]);
      		 for(let u  in ProjectsObjects){
      			console.log('touyjours plus', i, projectStructure[i],ProjectsObjects[u],  ProjectsObjects[u][ConverterProjet[i]]  )
      			if(projectStructure[i] !== undefined && ProjectsObjects[u][ConverterProjet[i]] !== undefined){
      				finalObjects[i] = ProjectsObjects[u][ConverterProjet[i]];      			
      			}      			
      		}	
		}
		console.log('finaleObject', finalObjects)
      	});
	}
}
