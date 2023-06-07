import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/orders.service';
import { Order } from 'src/app/interfaces/order';
import { ErrorService } from '../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  orders: Order[] = [];
  contentLoaded: boolean = false;
  totalSales: number = 0; // Variable para almacenar la suma de los pedidos
  loading: boolean = false;

  constructor(
    private _errorService: ErrorService,
    private _orderService: OrderService
  ) {}
  ngOnInit(): void {
    this.mostrarEsperaCarga();

    this.getOrders();
    // Simulación de tiempo de carga
    setTimeout(() => {
      this.contentLoaded = true;
    }, 1000);
  }

  getOrders(): void {
    this._orderService.getAllOrders().subscribe({
      next: (data: any) => {
        this.orders = data.orders;
        this.calculateTotalSales(); // Calcular el total de ventas después de obtener los pedidos
        this.loading = false;
        Swal.close(); // Cerrar el diálogo de espera una vez que se obtienen los productos

      },
      error: (event: HttpErrorResponse) => {
        this.orders = [];
        this._errorService.msgError(event);
      },
    });
  }

  calculateTotalSales(): void {
    this.totalSales = this.orders.reduce((total, order) => total + order.totalPrice, 0);
  }

  mostrarEsperaCarga() {
    this.loading = true;

    Swal.fire({
      title: 'Loading...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

}
