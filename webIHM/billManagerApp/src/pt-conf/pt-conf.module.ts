import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class PtConfModule { 
  public ConverterProjet = {"ID":"id","Nom" : "name","Description" : "description" , "Stories" : "listeStories"};
  public ConverterStories = {"Description" : "name","Labels" : "labels","OriginalId" : "id","Owners" : "owner_ids","StartDate" : "created_at","Type" : "story_type","URL" : "url","UpdatetDate" : "updated_at","isAMO" : "AMO","Fk_Project":"project_id", "Tasks" : "listeTaches", "Bonus" : "Bonus","nonEffetue" : "nonEffetue"};
  public ConverterTasks = {"description" : "Description","duree" : "Duration","initials" : "Initials","story_id":"FK_Stories", "isFerie" : "ferie","isWE" : "weekend"};
}
