import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-generator',
  templateUrl: './file-generator.component.html',
  styleUrls: ['./file-generator.component.css']
})
export class FileGeneratorComponent implements OnInit {

  private divVisibility;
  constructor() {
    this.divVisibility = false; 
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

}
