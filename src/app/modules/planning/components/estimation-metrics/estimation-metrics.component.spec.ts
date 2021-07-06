import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationMetricsComponent } from './estimation-metrics.component';

describe('EstimationMetricsComponent', () => {
  let component: EstimationMetricsComponent;
  let fixture: ComponentFixture<EstimationMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimationMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
