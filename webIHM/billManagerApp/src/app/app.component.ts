import { Component } from '@angular/core';
import * as moment from 'moment';
import { element } from 'protractor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import {TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgModule } from '@angular/core';
import {OnInit} from '@angular/core';
import {AfterViewInit, Directive, ViewChild} from '@angular/core';
import { AlertDialogService } from 'src/services/alert-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@NgModule({
  providers: [ 
    BsModalService
  ]
})

export class AppComponent {
  title = 'app';
  now = moment();

  private menuProperty;

  modalRef: BsModalRef;
 
  constructor(private modalService : BsModalService, private alertSrv: AlertDialogService){
    this.menuProperty = true;
  }

  ngOnInit(){
  }


  appendApps(){
    let appsMenu = document.getElementById('apps');
    appsMenu.style.display = "block";
    let elemclassapp : HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('currentApps') as HTMLCollectionOf<HTMLElement>;
    for(var i = 0; i < elemclassapp.length; i++){
      elemclassapp[i].style.display = "none"; // depending on what you're doing
    }
  }
  retractMenu = (() =>{
    let menu = document.getElementById("menu");
    let div = document.getElementById("centerdiv");
    let x : HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("info") as HTMLCollectionOf<HTMLElement>;
    let billManager = document.getElementById('bill');
    if(this.menuProperty){
      menu.style.width = "5%";
      this.menuProperty = false;
      div.style.width = "95%";
      for (let i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
    }else{
      menu.style.width = "15%";
      this.menuProperty = true;
      div.style.width = "85%"; 
      for (let i = 0; i < x.length; i++) {
        x[i].style.display = "block";
      }
    }
  });

  

  appendBillApp (){
    let appsMenu = document.getElementById('apps');
    appsMenu.style.display = "none";
    let billApp : HTMLElement = document.getElementById('billApp') as HTMLElement;
    billApp.style.display = "block";      
  };

  appendRequestedApp(idElement){
    let elemclassapp : HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('currentApps') as HTMLCollectionOf<HTMLElement>;
    for(var i = 0; i < elemclassapp.length; i++){
      elemclassapp[i].style.display = "none"; // depending on what you're doing
    }
    let elementToShow = document.getElementById(idElement);
    elementToShow.style.display = "block";
  }
}
