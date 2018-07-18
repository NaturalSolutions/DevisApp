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
  }

  private employees;
  private tarifications;
  private FgTarificationData: FormControl[];
  public formAjoutRess: FormGroup;
  public formAjoutTar: FormGroup;
  private modalRessourceRef;
  private modalConfirmatioSupprRef;
  private modalRef: NgbModalRef;
  private modalAjoutTarificationRef: NgbModalRef;
  private currentRessource;
  private currentTarif = { IsAmo : false};
  private Action;

  showError() {
    this.toastr.warning('Tout les champs doivent être remplie', 'Erreur d\'envoi de formulaire', { timeOut: 2000 })
  }

  showSucess() {
    this.toastr.success('Sucessfully added ressource', 'Sucess', { timeOut: 1500 })
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
      isAmo: [this.currentTarif.IsAmo == undefined ? false : this.currentTarif.IsAmo, Validators.required],
    });
  };

  ngOnInit() {
    this.getEmployes();
    this.getTarification();
  }


  getEmployes() {
    this.get("http://localhost/DevisAPI/api/Ressource/").toPromise().then((res: Array<any>) => {
      for (let emp of res) {
        emp.tarif = '';
        for (let tarif of emp.Tarification_Ressource) {
          emp.tarif += tarif.Tarification.Type + " ; ";
        }
      }
      this.employees = res;
    });
  }

  getTarification() {
    this.get("http://localhost/DevisAPI/api/Tarification/").toPromise().then((res) => {
      this.tarifications = res;
    });
  }

  addRessource() {
    this.currentRessource = {};
    this.FgTarificationData = this.tarifications.map(tarif => {
      return new FormControl(false);
    });
    this.Action = 'Ajout ';
    this.createFormRes();
    this.setModalAjoutRessource().result.then(() => {
    }).catch(() => {
      console.log('annulation validé')
    })
  }


  validerRessource() {
    if (this.Action.trim() == 'Ajout') {
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
    } else {
      let data: any = this.formAjoutRess.getRawValue();
      let usersTarifications: boolean[] = data.tarificationForm;
      let selectedTarifications: Int16Array[] = [];
      usersTarifications.forEach((isSelected, index) => {
        if (isSelected)
          selectedTarifications.push(this.tarifications[index].ID);
      });
      let ressMAJ: any = {};
      ressMAJ.id = this.currentRessource.ID;
      ressMAJ.name = data.name == undefined || data.name == '' ? this.currentRessource.Name : data.name;
      ressMAJ.initial = data.initial == undefined || data.initial == '' ? this.currentRessource.Initial : data.initial;
      ressMAJ.mail = data.email == undefined || data.email == '' ? this.currentRessource.Mail : data.email;
      ressMAJ.niveau = data.niveau == undefined || data.niveau == '' ? this.currentRessource.Niveau : data.niveau;
      ressMAJ.tarification = selectedTarifications;
      console.log(ressMAJ);
      this.formAjoutRess.reset();
      this.put("http://localhost/DevisAPI/api/ressource/", ressMAJ).toPromise().then(() => {
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

  put(url, objet) {
    return this.http.put(url, objet, {
      headers: {
        "dataType": "json",
        "Content-Type": "application/json; charset=UTF-8"
      }
    });
  }


  validerTarification() {
    if (this.Action.trim() == 'Ajout') {
      let data: any = this.formAjoutTar.getRawValue();
      if (data.type == '' || data.type == undefined
        || data.tar3 == ''
        || data.tar3 == undefined
        || data.tar5 == ''
        || data.tar5 == undefined) {
        this.showError();
      } else {
        if (data.isAmo == '' || data.isAmo == undefined) {
          data.isAmo = false;
        }
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
    } else {
      let data: any = this.formAjoutTar.getRawValue();
      let majTarification: any = {};
      majTarification.id = this.currentTarif.ID;
      majTarification.type = data.type == undefined || data.type == '' ? this.currentTarif.Type : data.type;
      majTarification.tar3 = data.tar3 == undefined || data.tar3 == '' ? this.currentTarif.Tar3 : data.tar3;
      majTarification.tar5 = data.tar5 == undefined || data.tar5 == '' ? this.currentTarif.Tar5 : data.tar5;
      majTarification.isAmo = data.isAmo == undefined || data.isAmo == '' ? false : data.isAmo;
      this.put("http://localhost/DevisAPI/api/tarification/", majTarification).toPromise().then(() => {
        this.showSucess();
        this.getTarification();
        this.formAjoutTar.reset();
        this.modalAjoutTarificationRef.close();
      }).catch(() => {

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
    this.Action = 'Modification ';
    this.currentRessource = emp;
    this.FgTarificationData = this.tarifications.map(tarif => {
      for (let tarification of this.currentRessource.Tarification_Ressource) {
        if (tarif.ID == tarification.Tarification.ID) {
          return new FormControl(true);
        }
      }
      return new FormControl(false);
    });
    this.createFormRes();
    this.setModalAjoutRessource().result.then(() => {
    }).catch(() => {
      console.log('annulation validé')
    })
  }



  @ViewChild('ressource') ajoutRessources: NgbModalRef;

  setModalAjoutRessource() {
    let modal = this.modalService.open(this.ajoutRessources, { backdrop: "static" });
    this.modalRef = modal;
    return modal;
  }

  @ViewChild('ajoutTarification') ajoutTarification: NgbModalRef;

  setModalAjoutTarification() {
    let modal = this.modalService.open(this.ajoutTarification, { backdrop: "static" });
    this.modalAjoutTarificationRef = modal;
    return modal;
  }

  addTarification() {
    this.Action = 'Ajout ';
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
  modifyTarification(tarif) {
    this.Action = 'Modification ';
    this.currentTarif = tarif;
    console.log(this.currentTarif.IsAmo);
    this.createFormTar();
    this.setModalAjoutTarification().result.then(() => {
    }).catch(() => {
      console.log('annulation validé')
    })
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
