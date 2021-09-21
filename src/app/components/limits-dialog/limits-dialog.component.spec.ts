import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitsDialogComponent } from './limits-dialog.component';

describe('LimitsDialogComponent', () => {
  let component: LimitsDialogComponent;
  let fixture: ComponentFixture<LimitsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
