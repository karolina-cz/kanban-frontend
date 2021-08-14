import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kanban-system-columns',
  templateUrl: './kanban-system-columns.component.html',
  styleUrls: ['./kanban-system-columns.component.css']
})
export class KanbanSystemColumnsComponent implements OnInit {
  columns: {name: string, tasks: any[]}[] = [{name: 'Zadania', tasks: []}, {name: 'Etap 1 - Podjęte', tasks: []}, {name: 'Etap 1 - W trakcie', tasks: []},
    {name: 'Etap 1 - Wykonane', tasks: []}, {name: 'Etap 2', tasks: []}, {name: 'Wykonane', tasks: []}];

  constructor() { }

  ngOnInit(): void {
  }

  drop(dropEvent): void {
    console.log('drop', dropEvent);
  }

}
