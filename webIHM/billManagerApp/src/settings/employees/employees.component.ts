import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(private http : HttpClient) {
  }

  private employees;
  private tarifications;

  ngOnInit() {
    this.getEmployes();
    this.getTarification();
  }


  getEmployes() {
    this.get("http://localhost/DevisAPI/api/Ressource/").toPromise().then((res: Array<any>) => {
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
    this.delete("http://localhost/DevisAPI/api/Ressource/" + id).toPromise().then((res) => {
      this.getEmployes();
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
