import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { DevisComponent } from './devis/devis.component';

const routes: Routes = [
  { path: '', redirectTo: '/devis', pathMatch: 'full' },
  { path: 'summary', component: SummaryComponent },
  { path: 'devis', component: DevisComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
