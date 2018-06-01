import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import {FileGeneratorComponent} from '../file-generator/file-generator.component';
import {EpicRecuperatorModule} from '../epic-recuperator/epic-recuperator.module';
import {DevisRequesterModule} from '../devis-requester/devis-requester.module';
import {TasksParserModule}  from '../tasks-parser/tasks-parser.module';
import {StructurerModule} from '../structurer/structurer.module';
import {PtConfModule} from '../pt-conf/pt-conf.module';
import {TransmuterModule} from '../transmuter/transmuter.module';
import {AlertDisplayerService} from '../alert-displayer.service';

@NgModule({
  declarations: [
    AppComponent, 
    FileGeneratorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [EpicRecuperatorModule,DevisRequesterModule,TasksParserModule,StructurerModule,PtConfModule,TransmuterModule,AlertDisplayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
