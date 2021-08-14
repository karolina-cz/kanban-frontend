import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanSystemColumnsComponent } from './kanban-system-columns.component';

describe('KanbanSystemColumnsComponent', () => {
  let component: KanbanSystemColumnsComponent;
  let fixture: ComponentFixture<KanbanSystemColumnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanSystemColumnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanSystemColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
