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

@NgModule({
  declarations: [
    AppComponent,
    FileGeneratorComponent, LogMessageComponent, DashboardComponent, SettingsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    RouterModule.forRoot([
      {path : 'billManager', component: FileGeneratorComponent},
      {path : 'parmeters', component: SettingsComponent}
    ])
  ],
  providers: [EpicRecuperatorModule, DevisRequesterModule, TasksParserModule, StructurerModule, PtConfModule, TransmuterModule, AlertDisplayerService, LogMessageComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
