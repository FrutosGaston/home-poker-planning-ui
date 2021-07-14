import {Component, Input, OnInit} from '@angular/core';
import {EstimationModel} from '../../../../models/Estimation.model';

interface Metric {
  value: string;
  votes: number;
  percentage: number;
}

@Component({
  selector: 'app-estimation-metrics',
  templateUrl: './estimation-metrics.component.html',
  styleUrls: ['./estimation-metrics.component.scss']
})
export class EstimationMetricsComponent implements OnInit {

  constructor() { }

  @Input() set estimations(estimations: EstimationModel[]) {
    this._estimations = estimations.filter(estimation => estimation.active);
    this.calculateMetrics();
  }

  get estimations(): EstimationModel[] {
    return this._estimations;
  }

  metrics: Metric[] = [];
  // tslint:disable-next-line:variable-name
  _estimations: EstimationModel[];

  private static countByValue(accumulator: Map<string, number>, value: string): Map<string, number> {
    const currentValue = accumulator.get(value) || 0;
    accumulator.set(value, currentValue + 1);
    return accumulator;
  }

  ngOnInit(): void {
    this.calculateMetrics();
  }

  private calculateMetrics(): void {
    if (this.estimations.length < 1) { return; }

    const newMetrics = [];
    const countt = this.estimations
      .map(estimation => estimation.card && estimation.card.value)
      .reduce(EstimationMetricsComponent.countByValue, new Map());
    countt.forEach((count, cardValue) => {
        const percentage = count / this.estimations.length;
        newMetrics.push({ value: cardValue, votes: count, percentage });
      });

    this.metrics = newMetrics.sort((a, b) => b.votes - a.votes);
  }
}
