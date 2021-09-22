import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheatSheetDialogComponent } from './cheat-sheet-dialog.component';

describe('CheatSheetDialogComponent', () => {
  let component: CheatSheetDialogComponent;
  let fixture: ComponentFixture<CheatSheetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheatSheetDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheatSheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
