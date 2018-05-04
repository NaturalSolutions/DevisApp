class transmuterPT{
	constructor(){
		this.self = this;
		this.Structurer = new Structurer();
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

	transmuteProjects(ProjectObject){
		let projectStructure;
		this.Structurer.getTasksStructure().then((res) => {
        	projectStructure = JSON.parse(res);
      	});
	}
}
