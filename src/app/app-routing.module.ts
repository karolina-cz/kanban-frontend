import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {KanbanBoardComponent} from './components/kanban-board/kanban-board.component';
import {HomeComponent} from './components/home/home.component';
import {KanbanSystemComponent} from './components/kanban-system/kanban-system.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'kanban-board/:id', component: KanbanBoardComponent},
  {path: 'kanban-system/:id', component: KanbanSystemComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
