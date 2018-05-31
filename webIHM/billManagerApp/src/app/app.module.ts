import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import {FileGeneratorComponent} from '../file-generator/file-generator.component';
import {EpicRecuperatorModule} from '../epic-recuperator/epic-recuperator.module';
import {DevisRequesterModule} from '../devis-requester/devis-requester.module';
import {TasksParserModule}  from '../tasks-parser/tasks-parser.module';

@NgModule({
  declarations: [
    AppComponent, 
    FileGeneratorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [EpicRecuperatorModule,DevisRequesterModule,TasksParserModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
