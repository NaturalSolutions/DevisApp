import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  summary: Array<any> = []
  projects: Array<any> = []

  public addAllToArray(array) {
    for (let s in array) {
      this.summary.push(array[s]);
      let projectIndex = this.projects.findIndex(o => o.id == array[s].project_id);
      console.log('AZRGNKAZRGPNKLZGENLPGEAZNLGEAZNLMGEML8888888', this.projects, projectIndex);
      if (projectIndex != -1) {
        if (array[s].initials.indexOf('+') == -1) {
          if (this.projects[projectIndex].summary) {
            let userIndex = this.projects[projectIndex].summary.findIndex(o => o.initials == array[s].initials);
            if (userIndex != -1) {
              this.projects[projectIndex].summary[userIndex].hours += parseInt(array[s].duree);
            } else {
              this.projects[projectIndex].summary.push({
                initials: array[s].initials,
                hours: parseInt(array[s].duree)
              });
            }
          } else {
            this.projects[projectIndex].summary = [];
            this.projects[projectIndex].summary.push({
              initials: array[s].initials,
              hours: parseInt(array[s].duree)
            });
          }
        } else {
          if (this.projects[projectIndex].summary) {
            let users = array[s].initials.split('+');
            for (let u in users) {
              let userIndex = this.projects[projectIndex].summary.findIndex(o => o.initials == users[u]);
              if (this.projects[projectIndex].summary) {
                if (userIndex != -1) {  
                  this.projects[projectIndex].summary[userIndex].hours += parseInt(array[s].duree.split('+')[u])
                } else {
                  this.projects[projectIndex].summary.push({
                    initials: users[u],
                    hours: parseInt(array[s].duree.split('+')[u])
                  });
                }
              } else {
                this.projects[projectIndex].summary = [];
                this.projects[projectIndex].summary.push({
                  initials: users[u],
                  hours: parseInt(array[s].duree.split('+')[u])
                });
              }
            }
          }
        }
      }
    }
  }

  public setProjects(array) {
    for (let s in array) {
      this.projects.push(array[s]);
    }
  }
}