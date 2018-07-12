import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FileGeneratorComponent } from '../file-generator/file-generator.component';
import { EpicRecuperatorModule } from '../epic-recuperator/epic-recuperator.module';
import { DevisRequesterModule } from '../devis-requester/devis-requester.module';
import { TasksParserModule } from '../tasks-parser/tasks-parser.module';
import { StructurerModule } from '../structurer/structurer.module';
import { PtConfModule } from '../pt-conf/pt-conf.module';
import { TransmuterModule } from '../transmuter/transmuter.module';
import { AlertDisplayerService } from '../alert-displayer.service';
import { LogMessageComponent } from '../log-message/log-message.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SettingsComponent } from '../settings/settings.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertDialogService, NgbdModalContent } from 'src/services/alert-dialog.service';
import { ReactiveFormsModule } from '@angular/forms';  

@NgModule({
  declarations: [
    AppComponent,
    FileGeneratorComponent, LogMessageComponent, DashboardComponent, SettingsComponent, NgbdModalContent
  ],
  entryComponents: [NgbdModalContent],
  imports: [
    AlertModule.forRoot(),
    NgbModule.forRoot(),
    BrowserModule,
    AccordionModule.forRoot(),
    HttpClientModule,
    AngularFontAwesomeModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path : 'billManager',
      component: FileGeneratorComponent,
        children: [{
          path: 'orders',
          component: FileGeneratorComponent
        }]
    },
      {path : 'parmeters', component: SettingsComponent}
    ])
  ],
  exports: [
    ModalModule
 ],
  providers: [AlertDialogService, EpicRecuperatorModule, DevisRequesterModule, TasksParserModule, StructurerModule, PtConfModule, TransmuterModule, AlertDisplayerService, LogMessageComponent,AccordionModule,AlertModule,ModalModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
