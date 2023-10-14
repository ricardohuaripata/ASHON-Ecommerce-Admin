import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/services/orders.service';
import { Order } from 'src/app/interfaces/order';
import { ErrorService } from '../services/error.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  contentLoaded: boolean = false;
  totalSales: number = 0; // Variable para almacenar la suma de los pedidos
  loading: boolean = false;
  private routeSubscription!: Subscription;
  metadata: any;

  constructor(
    private _errorService: ErrorService,
    private _orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.mostrarEsperaCarga();
    this.getOrders();
  }

  getOrders(): void {
    this.routeSubscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          return this.route.queryParams;
        }),
        switchMap((queryParams) => {
          const page = queryParams['page'] || 1;
          const customParams = new HttpParams().set('page', page.toString()).set('sort', '-1,createdAt');
          return this._orderService.getAllOrders(customParams);
        })
      )
      .subscribe(
        (data: any) => {
          this.orders = data.orders;
          this.metadata = data.metadata;
          this.loading = false;
          Swal.close(); // Cerrar el diálogo de espera una vez que se obtienen los productos
        },
        (error) => {
          this.loading = false;
          Swal.close();
          this._errorService.msgError(error);
        }
      );
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

  generatePageArray(totalPages: number): number[] {
    return Array(totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
  generatePageLink(page: number): string {
    const currentUrlTree = this.router.createUrlTree([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
    });

    return this.router.serializeUrl(currentUrlTree);
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
