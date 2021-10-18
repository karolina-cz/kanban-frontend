import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {KanbanComponent} from './components/kanban/kanban.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'kanban-board/:id', component: KanbanComponent},
  {path: 'kanban-system/:id', component: KanbanComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
