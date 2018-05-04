class Structurer{
	constructor(){
		this.self = this;
	}

	get(url){
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
			xhr.setRequestHeader('Content-Type','application/json','Allow','getStructure');
			xhr.send();
		});
	}

	async getBddObjectStructure(){
		await this.getProjetStructure().then((res) => { console.log('Projet structure',res)}); 
		await this.getStoriesStructure().then((res) => {console.log('Story structure',res)});
		await this.getTasksStructure().then((res) => {console.log('Task structure',res)});
	}

	async getProjetStructure(){
		return this.get("http://localhost/DevisAPI/api/Projet/getStructure").then((res) => {
			return res;	
		});
	}

	async getStoriesStructure(){
		return this.get("http://localhost/DevisAPI/api/Stories_d/getStructure").then((res) => {
			return res;	
		});
	}

	async getTasksStructure(){
		return this.get("http://localhost/DevisAPI/api/Tasks_d/getStructure").then((res) => {
			return res;	
		});
	}
}
