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

  retractMenu = (() =>{
    let menu = document.getElementById("menu");
    let div = document.getElementById("apps");
    var x = document.getElementsByClassName("info");

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
}
