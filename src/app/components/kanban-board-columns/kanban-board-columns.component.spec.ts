import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardColumnsComponent } from './kanban-board-columns.component';

describe('KanbanBoardColumnsComponent', () => {
  let component: KanbanBoardColumnsComponent;
  let fixture: ComponentFixture<KanbanBoardColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanBoardColumnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanBoardColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
