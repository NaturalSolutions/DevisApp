import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-message',
  templateUrl: './log-message.component.html',
  styleUrls: ['./log-message.component.css']
})
export class LogMessageComponent implements OnInit {

  private loaderState : boolean;
  constructor() { 
    this.loaderState =  false;
  }

  ngOnInit() {
  }

  setLoadingProperty(){
    let loader = document.getElementById('loader');
    if(this.loaderState == false){
      loader.style.visibility = "visible";
      this.loaderState =  true;
    }else{
      this.loaderState = false;
      loader.style.visibility = "hidden";
    }
  }

  setlogMessage(message : any){
    let infolog = document.getElementById("infoLog");
    infolog.innerHTML = message;
    infolog.style.visibility = "visible";
    setTimeout(() => {
      infolog.style.visibility = "hidden";
    },2000);
  }

}
