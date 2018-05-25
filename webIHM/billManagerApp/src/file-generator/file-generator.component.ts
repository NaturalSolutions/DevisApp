import { Component, OnInit } from '@angular/core';
import {EpicRecuperatorModule} from '../epic-recuperator/epic-recuperator.module';

@Component({
  selector: 'app-file-generator',
  templateUrl: './file-generator.component.html',
  styleUrls: ['./file-generator.component.css'],
})
export class FileGeneratorComponent implements OnInit {

  private divVisibility;
  private DevisProcessLauched;
  constructor(private epicRecuperator : EpicRecuperatorModule) {
    this.divVisibility = false; 
    this.DevisProcessLauched = false;
   }

  ngOnInit() {
  }

  displayOptions () :void {
    let devisScope = document.getElementById('devis');
    let factureScope = document.getElementById('facture');
    if(this.divVisibility == false){
      devisScope.style.visibility = "visible";
      factureScope.style.visibility = "visible";
      this.divVisibility = true;
    }else{
      devisScope.style.visibility = "hidden";
      factureScope.style.visibility = "hidden";
      this.divVisibility = false;
    }
  } 

  lauchDevis() :void {
    let infoLogContext = document.getElementById('infoLog');
    if(this.DevisProcessLauched == false){      
      infoLogContext.style.visibility = "visible";
      infoLogContext.innerHTML = "<p> Devis process lauched </p>"
      setTimeout(function (){
        infoLogContext.style.visibility = "hidden";
      }, 2000);
      this.DevisProcessLauched = true;
      this.epicRecuperator.Angularget('https://www.pivotaltracker.com/services/v5/projects').subscribe(response => {
        console.log("response",response);
      });
      this.epicRecuperator.getAllProjectsId();
    }else{
      infoLogContext.innerHTML = "<p> Keep Calm and take a coffee, Devis process is already processing !"
      infoLogContext.style.visibility = "visible";
      setTimeout(function (){
        infoLogContext.style.visibility = "hidden";
      }, 2000);
    }
    
  }

}
