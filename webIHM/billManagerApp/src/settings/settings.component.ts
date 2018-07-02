import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor() { }


  appendRequestedApp(idElement){
    let elemclassapp : HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('current') as HTMLCollectionOf<HTMLElement>;
    for(var i = 0; i < elemclassapp.length; i++){
      elemclassapp[i].style.display = "none"; // depending on what you're doing
    }
    let elementToShow = document.getElementById(idElement);
    elementToShow.style.display = "inline-block";
  }

  ngOnInit() {
  }

}
