import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common/src/dom_tokens';

@Component({
  selector: 'app-log-message',
  templateUrl: './log-message.component.html',
  styleUrls: ['./log-message.component.css']
})
export class LogMessageComponent implements OnInit {

  private loaderState: boolean;
  private processViewverState: boolean
  constructor() {
    this.loaderState = false;
    this.processViewverState = false;
  }

  ngOnInit() {
  }

  setLoadingProperty() {
    let loader = document.getElementById('loader');
    if (this.loaderState == false) {
      loader.style.visibility = "visible";
      this.loaderState = true;
    } else {
      this.loaderState = false;
      loader.style.visibility = "hidden";
    }
  }

  setlogMessage(message: any) {
    let infolog = document.getElementById("infoLog");
    let blur = document.getElementById("blur-background");
    infolog.innerHTML = message;
    infolog.style.visibility = "visible";
    blur.style.visibility = "visible";
    setTimeout(() => {
      infolog.style.visibility = "hidden";
      blur.style.visibility = "hidden";
    }, 2000);
  }

  setBlur(isActiv){
    let blur = document.getElementById("blur-background");
    if(!isActiv){
      blur.style.visibility = "hidden";
    }else {
      blur.style.visibility = "visible";
    }
  }

  setClosableAlert(innerElement){
    let closableAlertContext = document.getElementById('closableAlert');
    closableAlertContext.style.visibility = "visible";

    let contentClosableAlert = document.getElementById('content');
    contentClosableAlert.appendChild(innerElement);
  }

  setlogProcess(message: any) {
    let processLog = document.getElementById('consoleProcess');
    let newMessage = document.createElement('p');
    newMessage.innerHTML = message;
    newMessage.style.color = "black";
    newMessage.style.borderRadius = "15px";
    newMessage.style.backgroundColor = "white";
    newMessage.style.width = "70%";
    newMessage.style.margin = "auto";
    newMessage.style.padding = "5px";
    newMessage.style.marginBottom = "10px";
    newMessage.style.marginTop = "10px";
    processLog.appendChild(newMessage);
  }

  setProcessViewverProperty() {
    let process = document.getElementById('processState');
    if (this.processViewverState == false) {
      process.style.visibility = "visible";
      this.processViewverState = true;
    } else {
      this.processViewverState = false;
      process.style.visibility = "hidden";
    }
  }

  hideClosableAlert(){
    let ClosableAlert = document.getElementById('closableAlert');
    ClosableAlert.style.visibility = 'hidden';
  }

  hideProcessViewver() {
    let process = document.getElementById('processState');
    process.style.visibility = "hidden";
  }

}
