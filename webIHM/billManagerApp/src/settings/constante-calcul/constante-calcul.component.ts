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

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal) { }

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
  private modalParamRef : NgbModalRef;

  @ViewChild('modificationParam') modalParam: NgbModalRef;


  lauchparamModal() {
    this.createFormParam();
    let modal = this.modalService.open(this.modalParam, { backdrop: "static" });
    this.modalParamRef = modal;
    return modal;
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
    this.lauchparamModal().result.then(() => {
      alert('paramètres modifier');
    }).catch(() => {
      this.modalParamRef.close();
    })
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
