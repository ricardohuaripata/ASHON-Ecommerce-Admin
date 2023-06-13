import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = false;

  constructor(
    private productService: ProductsService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.mostrarEsperaCarga();
    this.productService.getProducts().subscribe(
      (data: any) => {
        this.products = data.products;
        this.loading = false;
        Swal.close(); // Cerrar el diálogo de espera una vez que se obtienen los productos
      },
      (error: HttpErrorResponse) => {
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

        this.productService.getProducts().subscribe(
          (data: any) => {
            this.products = data.products;
          },
          (error) => {
            console.error(error);
          }
        );
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
}
