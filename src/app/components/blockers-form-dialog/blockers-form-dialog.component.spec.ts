import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockersFormDialogComponent } from './blockers-form-dialog.component';

describe('BlockersFormDialogComponent', () => {
  let component: BlockersFormDialogComponent;
  let fixture: ComponentFixture<BlockersFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockersFormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockersFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
