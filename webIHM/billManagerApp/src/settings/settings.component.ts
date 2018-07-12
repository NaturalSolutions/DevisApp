import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { LogMessageComponent } from '../log-message/log-message.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private employeVisible: boolean;
  public employees = [];
  public tarifications: any;
  constructor(private http: HttpClient, private log: LogMessageComponent) {
    this.employeVisible = false;
  }


  // appendRequestedApp(idElement) {
  //   let elemclassapp: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('current') as HTMLCollectionOf<HTMLElement>;
  //   for (var i = 0; i < elemclassapp.length; i++) {
  //     elemclassapp[i].style.visibility = "hidden"; // depending on what you're doing
  //   }
  //   let elementToShow = document.getElementById(idElement);
  //   if (idElement == "employes") {
  //     this.employeVisible = true;
  //   }
  //   elementToShow.style.visibility = "visible";
  // }

  ngOnInit() {
  }
  getEmployes() {
    this.get("http://localhost/DevisAPI/api/Ressource/").toPromise().then((res : Array<any>) => {
      this.employees = res;
    });
  }

  getTarification() {
    this.get("http://localhost/DevisAPI/api/Tarification/").toPromise().then((res) => {
      this.tarifications = res;
    });
  }

  addRessource() {
    alert('on va ajouter une ressource tkt');
  }

  deleteRessource(id) {
    this.delete("http://localhost/DevisAPI/api/Ressource/"+id).toPromise().then((res) => {
      this.getEmployes();
      this.log.setlogMessage('ressource')
    })
  }

  delete(url) {
    return this.http.delete(url, {
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      },
    });
  }
  modifyRessource(emp) {
    alert('ressource mise à jour');
  }




  addTarification() {
    alert('on va ajouter une tarification tkt');
  }

  deleteTarification() {
    alert('tarification supprimé');
  }

  modifyTarification() {
    alert('Tarification mise à jour');
  }

  get(url) {
    return this.http.get(url, {
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  }
}
