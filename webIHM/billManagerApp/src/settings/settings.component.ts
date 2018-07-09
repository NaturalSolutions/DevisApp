import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private employeVisible : boolean;
  public employees : any;
  public tarifications : any;
  constructor(private http : HttpClient) {
    this.employeVisible = false;
   }


  appendRequestedApp(idElement){
    let elemclassapp : HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('current') as HTMLCollectionOf<HTMLElement>;
    for(var i = 0; i < elemclassapp.length; i++){
      elemclassapp[i].style.display = "none"; // depending on what you're doing
    }
    let elementToShow = document.getElementById(idElement);
    if(idElement == "employes"){
      this.employeVisible = true;
    }
    elementToShow.style.display = "inline-block";
  }

  ngOnInit() {
  }
  getEmployes(){
    this.get("http://localhost/DevisAPI/api/Ressource/").toPromise().then((res) => {
      this.employees = res;
    });
  }

  getTarification(){
    this.get("http://localhost/DevisAPI/api/Tarification/").toPromise().then((res) => {
      this.tarifications = res;
    });
  }

  get(url){
    return this.http.get(url,{
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  }
}
