import { Component } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  now = moment();

  private menuProperty;

  constructor(){
    this.menuProperty = true;
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
    let div = document.getElementById("apps");
    let x : HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("info") as HTMLCollectionOf<HTMLElement>;
    let billManager = document.getElementById('bill');
    if(this.menuProperty){
      menu.style.width = "5%";
      this.menuProperty = false;
      div.style.left = "30%";
      for (let i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
    }else{
      menu.style.width = "15%";
      this.menuProperty = true; 
      div.style.left = "35%";
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
}
