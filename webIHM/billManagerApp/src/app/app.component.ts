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
    if(this.menuProperty){
      menu.style.width = "10%";
      this.menuProperty = false;
    }else{
      menu.style.width = "20%";
      this.menuProperty = true;
    }
  });
}
