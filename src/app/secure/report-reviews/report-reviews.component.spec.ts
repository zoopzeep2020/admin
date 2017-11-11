import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReviewsComponent } from './report-reviews.component';

describe('ReportReviewsComponent', () => {
  let component: ReportReviewsComponent;
  let fixture: ComponentFixture<ReportReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
