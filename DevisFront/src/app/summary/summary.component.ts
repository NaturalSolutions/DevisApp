import { Component, OnInit, ViewChild } from '@angular/core';
import { EpicService } from '../services/epic.service';
import { FormatterService } from '../services/formatter.service';
import { StoryService } from '../services/story.service';
import { TaskService } from '../services/task.service';
import { HttpClient} from '@angular/common/http';
import * as moment from 'moment';

import { environment } from '../../environments/environment';
import { NgbModal, NgbModalRef,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormControl, FormArray, Form } from '@angular/forms';

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

  constructor( 
    private epicservice : EpicService,
    private formatterservice: FormatterService,
    private storyservice: StoryService,
    private taskservice: TaskService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpClient
    )
    {}

  ngOnInit() {
    this.epicservice.fetchAllProjects().then(results =>{
      this.projects = results;
      this.selectedProject = JSON.parse(JSON.stringify(results));
      console.log('azlùkefn', this.projects)
    })
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

  runExport(event){
    console.log('run export', this.selectedProject.length);
    console.log('run export', this.beginDate, this.endDate);
    let date1 = JSON.parse(JSON.stringify(this.beginDate))
    let date2 = JSON.parse(JSON.stringify(this.endDate))
    
    // let date1 = moment(this.beginDate).toISOString();
    date1 = moment(date1).toISOString();
    date2 = moment(date2).toISOString();
    let mescouilles = moment(date2).toISOString();
    // let date2 = moment(this.endDate).toISOString();
    console.log('les dates formatées', date1, 'zgueg', date2, 'mescouilles', mescouilles);
    this.storyservice.getSimpleProjectStories(this.selectedProject, date1, date2).then(result => {
      console.log('suite', result);
      
    })
  }
}
