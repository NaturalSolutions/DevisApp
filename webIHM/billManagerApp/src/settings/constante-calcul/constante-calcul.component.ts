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
import { BsModalService } from 'ngx-bootstrap/modal/bs-modal.service';


@Component({
  selector: 'app-constante-calcul',
  templateUrl: './constante-calcul.component.html',
  styleUrls: ['./constante-calcul.component.css']
})
export class ConstanteCalculComponent implements OnInit {

  constructor(private toastr: ToastrService,private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal) { }

  public parameters;
  ngOnInit() {
    this.parameters = {
      MultiplicationFE: 'loading..',
      MultiplicationWE: 'loading..',
      MultiplicationWEFE: 'loading..',
      NbJourCDP: 'loading..',
      NbJourDT: 'loading..',
      PrixSupport: 'loading..',
    }
    this.getParameters()
  }

  private formParam;
  private modalParamRef: NgbModalRef;

  @ViewChild('modificationParam') modalParam: NgbModalRef;


  lauchparamModal() {
    this.createFormParam();
    let modal = this.modalService.open(this.modalParam, { backdrop: "static" });
    this.modalParamRef = modal;
    return modal;
  }

  showError() {
    this.toastr.warning('Tout les champs doivent être remplie', 'Erreur d\'envoi de formulaire', {timeOut : 2000})
  }

  showSucess() {
    this.toastr.success('Sucessfully added ressource', 'Sucess', {timeOut : 1500})
  }


  createFormParam() {
    this.formParam = this.fb.group({
      CoefficientF: ['', Validators.required],
      CoefficientW: ['', Validators.required],
      CoefficientWF: ['', Validators.required],
      JourCDP: ['', Validators.required],
      JourDT: ['', Validators.required],
      Support: ['', Validators.required]
    });
  };

  modifierParam() {
    this.lauchparamModal();
  }

  validerParam(){
    let data: any = this.formParam.getRawValue();
    if (data.CoefficientF == '' || data.CoefficientF == undefined
      || data.CoefficientW == ''
      || data.CoefficientW == undefined
      || data.CoefficientWF == ''
      || data.CoefficientWF == undefined
      || data.JourCDP == ''
      || data.JourCDP == undefined
      || data.JourDT == ''
      || data.JourDT == undefined
      || data.Support == ''
      || data.Support == undefined) {
        this.showError();
    } else {
      let param : any = {};
      param.FE = data.CoefficientF;
      param.WE = data.CoefficientW;
      param.WEFE = data.CoefficientWF;
      param.cdp = data.JourCDP;
      param.dt = data.JourDT;
      param.support = data.Support;
      this.put('http://localhost/DevisAPI/api/parametres/',param).toPromise().then(() => {
        this.showSucess();
      }).catch(() => {
        alert('erreur connard')
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


  getParameters() {
    this.get('http://localhost/DevisAPI/api/parametres/').toPromise().then((res) => {
      this.parameters = res;
      console.log('parameters', res);
    });
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
