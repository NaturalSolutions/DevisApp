import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {Globals} from './services/globals'
import { HttpClientModule } from '@angular/common/http';
import { ModalesComponent } from './modales/modales.component';
import { SummaryComponent } from './summary/summary.component';
import { DevisComponent } from './devis/devis.component'; 

@NgModule({
  declarations: [
    AppComponent,
    ModalesComponent,
    SummaryComponent,
    DevisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UiModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  providers: [NgbActiveModal, Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
