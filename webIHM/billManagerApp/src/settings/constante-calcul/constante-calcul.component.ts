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
  selector: 'app-constante-calcul',
  templateUrl: './constante-calcul.component.html',
  styleUrls: ['./constante-calcul.component.css']
})
export class ConstanteCalculComponent implements OnInit {

  constructor(private http: HttpClient,private fb : FormBuilder) { }

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

  @ViewChild('modificationParam') modalParam : NgbModalRef;

  createFormTar() {
    this.formParam = this.fb.group({
      CoefficientF: ['', Validators.required],
      CoefficientW: ['', Validators.required],
      CoefficientWF: ['', Validators.required],
      JourCDP: ['', Validators.required],
      JourDT: ['', Validators.required],
      Support : ['',Validators.required]
    });
  };

  modifierParam(){
    
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
