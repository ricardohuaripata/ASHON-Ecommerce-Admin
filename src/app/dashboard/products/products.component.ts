import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading: boolean = false;
  private routeSubscription!: Subscription;
  metadata: any;

  constructor(
    private productService: ProductsService,
    private toastr: ToastrService,
    private _errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mostrarEsperaCarga();

    this.routeSubscription = this.route.paramMap
      .pipe(
        switchMap((params) => {
          return this.route.queryParams;
        }),
        switchMap((queryParams) => {
          const page = queryParams['page'] || 1;
          const customParams = new HttpParams()
            .set('page', page.toString())
            .set('sort', '-1,sold');
          return this.productService.getProducts(customParams);
        })
      )
      .subscribe(
        (data: any) => {
          this.products = data.products;
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

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe({
      next: (data: any) => {
        this.toastr.success(data.message, data.type);
        location.reload();
      },
      error: (error: HttpErrorResponse) => {
        this._errorService.msgError(error);
      },
    });
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

  openDeleteConfirmation(productId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(productId);
      }
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
