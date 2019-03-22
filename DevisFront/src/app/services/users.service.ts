import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    public http: HttpClient
  ) { }

  Angularget(configUrl) {
    return this.http.get(configUrl, {
      headers: {
        'X-TrackerToken': 'b4a752782f711a7c564221c2b0c2d5dc',
        'Content-Type': 'application/json'
      }
    });
  }

  getAllUsers(projects) {
    // this.log.setlogProcess('Getting Tasks from stories');
     return new Promise<any>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      let users: Array<any> = [];
      for (let i in projects) {
        let result = this.Angularget('https://www.pivotaltracker.com/services/v5/projects/'+ projects[i].id + '/memberships')
          .toPromise().then((result) => {
            console.log('result',result);
            for(let s in result){
              if(!users.find(o => o.id == result[s].person.id)){
                users.push(result[s].person);
              }
            }
          });
        promises.push(result);
       }
       Promise.all(promises).then(() => {
         let objectToSend: any = {};
         objectToSend = users;
         console.log('users',users);
    //     this.log.setlogProcess("Tasks have been parsed");
         resolve(objectToSend);
       })
     });
	 }
}
