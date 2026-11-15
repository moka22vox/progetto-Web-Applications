import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../models/property.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-price-trends-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0 fw-bold text-dark">
            <i class="bi bi-graph-up-arrow text-primary me-2"></i>
            Analisi di Mercato: Andamento Prezzi Medi al Metro Quadro
          </h5>
          <small class="text-muted">Aggiornato in tempo reale in base agli annunci pubblicati</small>
        </div>
        <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
          {{ properties.length }} Immobili Analizzati
        </span>
      </div>
      <div class="card-body p-4">
        <div style="position: relative; height: 280px; width: 100%;">
          <canvas #chartCanvas></canvas>
        </div>
      </div>
    </div>
  `
})
export class PriceTrendsChartComponent implements AfterViewInit, OnChanges {
  @Input() properties: Property[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['properties'] && this.chartCanvas) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!this.chartCanvas) return;
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const saleMap: { [cat: string]: { totalSqm: number; totalPrice: number; count: number } } = {};
    const rentMap: { [cat: string]: { totalSqm: number; totalPrice: number; count: number } } = {};

    this.properties.forEach(p => {
      const cat = p.categoryName || 'Altro';
      if (!saleMap[cat]) saleMap[cat] = { totalSqm: 0, totalPrice: 0, count: 0 };
      if (!rentMap[cat]) rentMap[cat] = { totalSqm: 0, totalPrice: 0, count: 0 };

      const sqm = p.squareMeters || 0;
      const price = Number(p.currentPrice || p.originalPrice || 0);

      if (sqm > 0 && price > 0) {
        if (p.transactionType === 'RENT') {
          rentMap[cat].totalSqm += sqm;
          rentMap[cat].totalPrice += price;
          rentMap[cat].count += 1;
        } else {
          saleMap[cat].totalSqm += sqm;
          saleMap[cat].totalPrice += price;
          saleMap[cat].count += 1;
        }
      }
    });

    const allCategories = Array.from(new Set([...Object.keys(saleMap), ...Object.keys(rentMap)]));
    const labels = allCategories.filter(cat => (saleMap[cat]?.count > 0 || rentMap[cat]?.count > 0));

    const saleData = labels.map(cat => {
      const entry = saleMap[cat];
      if (!entry || entry.totalSqm === 0) return 0;
      return Math.round(entry.totalPrice / entry.totalSqm);
    });

    const rentData = labels.map(cat => {
      const entry = rentMap[cat];
      if (!entry || entry.totalSqm === 0) return 0;
      return Math.round(entry.totalPrice / entry.totalSqm);
    });

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['Nessun dato'],
        datasets: [
          {
            label: 'Vendita (€ / mq)',
            data: saleData.length ? saleData : [0],
            borderColor: '#0d6efd',
            borderWidth: 2,
            borderRadius: 6,
            hoverBackgroundColor: 'rgba(13, 110, 253, 1)',
            yAxisID: 'y'
          },
          {
            label: 'Affitto (€ / mq / mese)',
            data: rentData.length ? rentData : [0],
            borderColor: '#198754',
            borderWidth: 2,
            borderRadius: 6,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: { weight: 'bold' }
            }
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              label: (context) => {
                if (context.datasetIndex === 0) {
                  return `🟦 Vendita: € ${context.parsed.y.toLocaleString()} / mq`;
                } else {
                  return `🟩 Affitto: € ${context.parsed.y.toLocaleString()} / mq al mese`;
                }
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            ticks: {
              callback: (val) => '€ ' + val.toLocaleString('it-IT')
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              callback: (val) => '€ ' + val.toLocaleString('it-IT') + '/m'
            }
          }
        }
      }
    });
  }
}
