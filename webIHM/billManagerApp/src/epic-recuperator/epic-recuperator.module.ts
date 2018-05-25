import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],
  declarations: []
})
export class EpicRecuperatorModule { 
  constructor(private http: HttpClient) { }
  Angularget(configUrl){
    return this.http.get(configUrl,{
      headers : {
        'X-TrackerToken':'b4a752782f711a7c564221c2b0c2d5dc',
        'Content-Type':'application/json'
      }
    });
  }
}
