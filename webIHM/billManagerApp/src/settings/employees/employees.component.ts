import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';
import { ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AlertDialogService } from '../../services/alert-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'q';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(private toastr: ToastrService, private http: HttpClient, private modalService: NgbModal, private fb: FormBuilder, private alertSrv: AlertDialogService) {
    this.getEmployes();
    this.getTarification();
  }

  private employees;
  private tarifications;
  private FgTarificationData: FormControl[];
  public formAjoutRess: FormGroup;
  public formAjoutTar: FormGroup;
  private modalRessourceRef;
  private modalConfirmatioSupprRef;
  private modalRef: NgbModalRef;
  private modalAjoutTarificationRef : NgbModalRef;

  showError() {
    this.toastr.warning('Tout les champs doivent être remplie', 'Erreur d\'envoi de formulaire', {timeOut : 2000})
  }

  showSucess() {
    this.toastr.success('Sucessfully added ressource', 'Sucess', {timeOut : 1500})
  }

  createFormRes() {
    this.formAjoutRess = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      initial: ['', Validators.required],
      niveau: ['', Validators.required],
      tarificationForm: new FormArray(this.FgTarificationData)
    });
  };

  createFormTar() {
    this.formAjoutTar = this.fb.group({
      type: ['', Validators.required],
      tar3: ['', Validators.required],
      tar5: ['', Validators.required],
      isAmo: ['', Validators.required],
    });
  };

  ngOnInit() {
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
    this.FgTarificationData = this.tarifications.map(tarif => {
      return new FormControl(false);
    });
    this.createFormRes();
    this.setModalAjoutRessource().result.then(() => {
    }).catch(() => {
      console.log('annulation validé')
    })
  }


  validerRessource() {
    let data: any = this.formAjoutRess.getRawValue();
    let usersTarifications: boolean[] = data.tarificationForm;
    let selectedTarifications: Int16Array[] = [];
    usersTarifications.forEach((isSelected, index) => {
      if (isSelected)
        selectedTarifications.push(this.tarifications[index].ID);
    });
    if (data.name == '' || data.name == undefined
      || data.initial == ''
      || data.initial == undefined
      || data.email == ''
      || data.email == undefined
      || data.niveau == ''
      || data.niveau == undefined
      || selectedTarifications == undefined) {
      this.showError();
    } else {
      let nouvelle_ressource: any = {};
      nouvelle_ressource.name = data.name;
      nouvelle_ressource.initial = data.initial;
      nouvelle_ressource.mail = data.email;
      nouvelle_ressource.niveau = data.niveau;
      nouvelle_ressource.tarification = selectedTarifications;
      console.log(nouvelle_ressource);
      this.formAjoutRess.reset();
      this.post("http://localhost/DevisAPI/api/ressource", nouvelle_ressource).toPromise().then(() => {
        this.showSucess();
        this.getEmployes();
        this.modalRef.close();
      }).catch(() => {
        this.alertSrv.open({ title: "Une erreur est survenue", content: 'Le serveur à rencontré une erreur innatendue, le processus va redémarrer' }).result.then(() => {
          location.reload(true);
        }).catch(() => {
          location.reload(true);
        })
      })
    }
  }


  validerTarification() {
    let data: any = this.formAjoutTar.getRawValue();
    if (data.type == '' || data.type == undefined
      || data.tar3 == ''
      || data.tar3 == undefined
      || data.tar5 == ''
      || data.tar5 == undefined
      || data.isAmo == ''
      || data.isAmo == undefined) {
      this.showError();
    } else {
      let nouvelle_tarification: any = {};
      nouvelle_tarification.type = data.type;
      nouvelle_tarification.tar3 = data.tar3;
      nouvelle_tarification.tar5 = data.tar5;
      nouvelle_tarification.isAmo = data.isAmo;
      this.formAjoutTar.reset();
      this.post("http://localhost/DevisAPI/api/tarification", nouvelle_tarification).toPromise().then(() => {
        this.showSucess();
        this.getTarification();
        this.modalAjoutTarificationRef.close();
      }).catch(() => {
        this.alertSrv.open({ title: "Une erreur est survenue", content: 'Le serveur à rencontré une erreur innatendue, le processus va redémarrer' }).result.then(() => {
          location.reload(true);
        }).catch(() => {
          location.reload(true);
        })
      })
    }
  }

  post(url, objetAEnvoyer) {
    return this.http.post(url, objetAEnvoyer, {
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  }

  @ViewChild('confirmationSuppr') confirmation: NgbModalRef;

  setModalConfirmationsuppression() {
    let modalRef = this.modalService.open(this.confirmation, { backdrop: "static" });
    this.modalConfirmatioSupprRef = modalRef;
    return modalRef;
  }


  deleteRessource(id) {
    this.setModalConfirmationsuppression().result.then(() => {
      this.delete("http://localhost/DevisAPI/api/Ressource/" + id).toPromise().then((res) => {
        this.getEmployes();
      })
    }).catch(() => {
      this.modalConfirmatioSupprRef.close();
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

  @ViewChild('ressource') ajoutRessources: NgbModalRef;

  setModalAjoutRessource() {
    let modal = this.modalService.open(this.ajoutRessources, { backdrop: "static" });
    this.modalRef = modal;
    return modal;
  }

  @ViewChild('ajoutTarification') ajoutTarification : NgbModalRef;

  setModalAjoutTarification(){
    let modal = this.modalService.open(this.ajoutTarification,{backdrop : "static"});
    this.modalAjoutTarificationRef = modal;
    return modal;
  }

  addTarification() {
    this.createFormTar();
    this.setModalAjoutTarification().result.then(() => {
    }).catch(() => {
      console.log('annulation validé')
    })
  }

  deleteTarification(id) {
    this.setModalConfirmationsuppression().result.then(() => {
      this.delete('http://localhost/DevisAPI/api/Tarification/' + id).toPromise().then((res) => {
        this.getTarification();
      })
    });
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
