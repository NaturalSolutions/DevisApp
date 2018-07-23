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


  ngOnInit() {
  }
 
}
