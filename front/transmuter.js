class transmuter{
	constructor(conf){
		this.self = this;
		this.Structurer = new Structurer();
		this.formatConf = conf;
		this.listeTaches = undefined;
		this.listeStories = undefined;
		this.listeProjets = undefined;
	}
	// TO DO prendre en compte initials et duration pour les taches 
	transmuteTasks(TaskObject){
    console.log("Transmuting Tasks");    
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
      				if(tasksStructure[i] !== undefined && TaskObject[u][ConverterTasks[i]] !== undefined){
      					finalObjects[i] = TaskObject[u][ConverterTasks[i]];      			
      				}      			
      			}	
      			finalListOfObjects.push(finalObjects);
			}
			this.listeTaches = finalListOfObjects;
      	});	
	}

	transmuteStories(StoryObject){
    console.log("Transmuting Stories");
		let storyStructure;
		this.Structurer.getStoriesStructure().then((res) => {
        	storyStructure = JSON.parse(res);
      		let finalListOfObjects = [];
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
			this.listeStories = finalListOfObjects;
      	});
	}

	transmuteProjects(ProjectsObjects){
		//obj bdd
    console.log("Transmuting Projects");
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
			//console.log("projets" ,finalListOfObjects);
			this.listeProjets = finalListOfObjects;
      this.encapsulateObjects();
      	});
	}

	encapsulateObjects(){
    let GeneralObject = {};
    	if(this.listeTaches != undefined && this.listeStories != undefined && this.listeProjets != undefined){
    		GeneralObject.projets = this.listeProjets;
    		for(let p in GeneralObject.projets){
          GeneralObject.projets[p].Stories = this.listeStories.filter(o => o.Fk_Project == GeneralObject.projets[p].ID);
          for(let t in GeneralObject.projets[p].listeStories){
            GeneralObject.projets[p].listeStories[t].Tasks = this.listeTaches[t].filter(o => o.story_id == GeneralObject.projets[p].listeStories[t].OriginalId);
          }
        }
        console.log("GeneralObject to send ",GeneralObject);
    	}
  }
}
