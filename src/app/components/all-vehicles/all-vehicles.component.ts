import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-all-vehicles',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './all-vehicles.component.html',
  styleUrl: './all-vehicles.component.css'
})

export class AllVehiclesComponent implements OnInit {
  httpClient = inject(HttpClient);
  data: any[] = [];

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(){
    this.httpClient
    .get('https://localhost:7259/api/Vehiculo')
    .subscribe((data: any) => {
      console.log(data);
      this.data = data;
    })
  }

}
