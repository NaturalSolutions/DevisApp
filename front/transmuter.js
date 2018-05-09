class transmuter{
	constructor(conf){
		this.self = this;
		this.Structurer = new Structurer();
		this.formatConf = conf;
	}

	transmuteTasks(TaskObject){    
		let tasksStructure;
		this.Structurer.getTasksStructure().then((res) => {
        	tasksStructure = JSON.parse(res);
      		let finalListOfObjects = [];
      		//Boucle sur object configConverterTasks
			for(let u in TaskObject){	
				let finalObjects = {};
				//console.log(TaskObject[u].description);
      			 for(let i  in ConverterTasks){
      				/*console.log('touyjours plus', i, tasksStructure[i],TaskObject[u],  TaskObject[u][ConverterProjet[i]]  )*/
      				if(tasksStructure[i] !== undefined && TaskObject[u][ConverterProjet[i]] !== undefined){
      					finalObjects[i] = TaskObject[u][ConverterProjet[i]];      			
      				}      			
      			}	
      			finalListOfObjects.push(finalObjects);
			}
			console.log('finalListOfObjects taches', finalListOfObjects)
      	});	
	}

	transmuteStories(StoryObject){
		let storyStructure;
		this.Structurer.getStoriesStructure().then((res) => {
        	storyStructure = JSON.parse(res);
      		let finalListOfObjects = [];
      		// TO DO PRENDRE EN COMPTE IS AMO AVEC ALGO DE VERIFICATION  DANS LABELS
      		//console.log(storyStructure);
      		//Boucle sur object config
			for(let u in StoryObject){
				let finalObjects = {};
      			for(let i in ConverterStories){
      			 	//console.log('toujours plus', i, storyStructure[i],StoryObject[u],  StoryObject[u][ConverterProjet[i]]  )
      				if(storyStructure[i] !== undefined && StoryObject[u][ConverterStories[i]] !== undefined){
      					finalObjects[i] = StoryObject[u][ConverterStories[i]];      			
      				}      			
      			}
      			finalListOfObjects.push(finalObjects);	
			}
			console.log('finalListOfObjects stories', finalListOfObjects)
      	});
	}

	transmuteProjects(ProjectsObjects){
		//obj bdd
		let projectStructure;
		this.Structurer.getProjetStructure().then((res) => {
        	projectStructure = JSON.parse(res);
      		let finalListOfObjects = [];
      		//Boucle sur object config
			for(let u in ProjectsObjects){
				let finalObjects = {};
      			for(let i  in ConverterProjet){
      				/*console.log('touyjours plus', i, projectStructure[i],ProjectsObjects[u],  ProjectsObjects[u][ConverterProjet[i]]  )*/
      				if(projectStructure[i] !== undefined && ProjectsObjects[u][ConverterProjet[i]] !== undefined){
      					finalObjects[i] = ProjectsObjects[u][ConverterProjet[i]];      			
      				}      			
      			}
      			finalListOfObjects.push(finalObjects);	
			}
			console.log('finalListOfObjects projet', finalListOfObjects)
      	});
	}
}
