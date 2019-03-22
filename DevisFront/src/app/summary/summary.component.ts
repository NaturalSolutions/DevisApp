import { Component, OnInit, ViewChild } from '@angular/core';
import { EpicService } from '../services/epic.service';
import { FormatterService } from '../services/formatter.service';
import { StoryService } from '../services/story.service';
import { TaskService } from '../services/task.service';
import { UsersService } from '../services/users.service';
import { HttpClient} from '@angular/common/http';
import * as moment from 'moment';

import { environment } from '../../environments/environment';
import { NgbModal, NgbModalRef,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormControl, FormArray, Form } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Globals } from '../services/globals'


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  projects : Array<any> = [];
  selectedProject: Array<any> = [];
  beginDate: any;
  endDate: any;
  allStoriesUnsorted: Array<any>;
  allTasksUnsorted: Array<any>;
  allUsers: Array<any>;
  summary: Array<any>;
  summaryProjects: Array<any>;

  constructor( 
    private epicservice : EpicService,
    private formatterservice: FormatterService,
    private storyservice: StoryService,
    private userservice: UsersService,
    private taskservice: TaskService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient,
    private globals: Globals
    )
    {
      this.summary = globals.summary;
      this.summaryProjects = globals.projects;
    }

  ngOnInit() {
    this.epicservice.fetchAllProjects().then(results =>{
      this.projects = results;
      this.selectedProject = JSON.parse(JSON.stringify(results));
      this.globals.projects = this.selectedProject;
      console.log('azlùkefn', this.projects)
    }).then(() => {
      this.userservice.getAllUsers(this.projects).then(result => {
        console.log('users',result);
        this.allUsers = result;
      });
    });
  }

  manageCheck(event:any){
    console.log('event',event);
    let id = event.target.id;
    if(!event.target.checked){
      this.selectedProject.splice(this.selectedProject.findIndex(o => o.id == id), 1);
    }else{
      this.selectedProject.push(this.projects.find(o => o.id == id));
    }
  }
  //Fonction créé a cause d'un soucis de conversion des date dupicker bootstrap et momentjs
  formatDate(date){
    let finalDate = '';
    if(date.year.toString().length < 4){
      finalDate += '20' + date.year;
    }else{
      finalDate += '' + date.year;
    }
    if(date.month.toString().length < 2){
      finalDate += '-0' + date.month
    }else{
      finalDate += '-' + date.month;
    }
    if(date.day.toString().length < 2){
      finalDate += '-0' + date.day
    }else{
      finalDate += '-' + date.day
    }
    return finalDate + 'T23:00:00.00'
  }

  
  go(){
    let result: Array<any> = [];
    return new Promise<any>((resolve, reject) => {
      
      resolve(result);
    });
  }

  sumTasksByProject(index){
    let proj = this.selectedProject[index];
    let sumByUser = [];

    for(let t in proj.tasks){

    }
  }

  setSummary(){
    for(let s in this.selectedProject){

    }
  }


  runExport(event){
    console.log('run export', this.selectedProject.length);
    console.log('run export', this.beginDate, this.endDate);
    let date1 = this.formatDate(this.beginDate);
    let date2 = this.formatDate(this.endDate);
    // console.log('formattage',this.formatDate(date1));
    // console.log('formattage',this.formatDate(date2));
    // // let date1 = moment(this.beginDate).toISOString();
    // date1 = moment(date1).toISOString();
    // date2 = moment(date2).toISOString();
    // let mescouilles = moment(date2).toISOString();
    // let date2 = moment(this.endDate).toISOString();
    // console.log('les dates formatées', date1, 'zgueg', date2, 'mescouilles', mescouilles);
    this.storyservice.getSimpleProjectStories(this.selectedProject, date1, date2).then(result => {
      console.log('suite', result);
      this.allStoriesUnsorted = result.stories;
      console.log('allstroeis',this.allStoriesUnsorted);
    }).then(() => {
      this.taskservice.getTasksSummary(this.allStoriesUnsorted, this.projects, false, this.allUsers)
      .then(result => {
        // console.log('789987987987987987987897897897987987987987',this.allTasksUnsorted.map(o => o.project_id));
        this.allTasksUnsorted = result.Taches;
        console.log('DFVBHJNK?HJCBNKM%OHMIUYGMPIYFMIYFV',this.allTasksUnsorted);
        for(let project in this.projects){
          if(this.selectedProject[project]){
            console.log('project',project);
            this.selectedProject[project].tasks = this.summary.filter(o => o.project_id == this.selectedProject[project].id )
          }
        }
        // console.log('ca mere ', this.globals.project);
        console.log('final',this.selectedProject.filter(o => o.tasks.length > 0).map(o => ( {project_name : o.name, summmary: o.summary})));
      })
    })
  }
}
