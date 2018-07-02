import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private http : HttpClient) { }


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

  get(url){
    return this.http.get(url,{
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  }

  getEmployes(){
    this.get("http://localhost/DevisAPI/api/Ressource/").toPromise().then((res) => {
      console.log("resultat des ressources",res);
    })
  }

}
