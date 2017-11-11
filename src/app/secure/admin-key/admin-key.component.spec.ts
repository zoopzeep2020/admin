import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminKeyComponent } from './admin-key.component';

describe('AdminKeyComponent', () => {
  let component: AdminKeyComponent;
  let fixture: ComponentFixture<AdminKeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminKeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
