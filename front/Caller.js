class Caller{
	constructor(){
		this.self = this;
	}

	async executeQuery(urlRequest){
  		let resp = await fetch(urlRequest,{
  			'X-TrackerToken': 'b4a752782f711a7c564221c2b0c2d5dc'
  		})
  		.then(function(data) {
    		return data.JSON();
  		})
  		.catch(function(error) {
    		console.log(JSON.stringify(error));
		});   
	}

	async executeQuerys(nbQuerys,urlRequest){
		let listeResult = [];
		for(let i = 0 ; i < nbQuerys ; i++){
			let result = await this.self.executeQuery(urlRequest);
			result.then((resp) => {
				listeResult.push(result);	
			});
		}
		return listeResult;
	};

/*	executeQuery(urlRequest){
			var apiRequest1 = fetch(urlRequest).then(function(response){ 
       		return response.json()
    	});
	}*/
}
