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
			xhr.setRequestHeader('Content-Type','application/json');
			xhr.send();
		});
	}
	
	getProjetStructure(){
		return new Promise((resolve,reject) => {
			this.get("http://localhost/DevisAPI/api/Projet/getStructure").then((res) => {
				resolve(res);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	getStoriesStructure(){
		return new Promise((resolve,reject) => {
			this.get("http://localhost/DevisAPI/api/Stories_d/getStructure").then((res) => {
				resolve(res);
			}).catch((error) => {
				reject(error);
			});
		});
	}

	getTasksStructure(){
		return new Promise((resolve,reject) => {
			this.get("http://localhost/DevisAPI/api/Tasks_d/getStructure").then((res) => {
				resolve(res);
			}).catch((error) => {
				reject(error);
			});
		});
	}
}
