import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSystemComponent } from './task-system.component';

describe('TaskSystemComponent', () => {
  let component: TaskSystemComponent;
  let fixture: ComponentFixture<TaskSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
