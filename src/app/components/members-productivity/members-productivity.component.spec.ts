import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersProductivityComponent } from './members-productivity.component';

describe('MembersProductivityComponent', () => {
  let component: MembersProductivityComponent;
  let fixture: ComponentFixture<MembersProductivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MembersProductivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
