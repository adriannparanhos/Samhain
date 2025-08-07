import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerables } from 'chart.js';
import { Chart } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-chart-visits-graph',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './chart-visits-graph.component.html',
  styleUrl: './chart-visits-graph.component.css'
})
export class ChartVisitsGraphComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.RenderChart();
  }

  RenderChart() {
    const myChar = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Visitas',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Visitas Mensais'
          }
        }
      }
    });
  }
}