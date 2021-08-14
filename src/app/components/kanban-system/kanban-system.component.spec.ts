import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanSystemComponent } from './kanban-system.component';

describe('KanbanSystemComponent', () => {
  let component: KanbanSystemComponent;
  let fixture: ComponentFixture<KanbanSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
