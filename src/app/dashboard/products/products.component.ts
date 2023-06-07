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
      (error) => {
        console.error(error);
      }
    );
  }
/*
  onOpenDeleteModal(product?: Product): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    this.productToDelete = product;
    button.setAttribute('data-target', '#deleteModal');

    if (container) {
      container.appendChild(button);
    }

    button.click();
  }
*/
  // DELETE
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
      error: (event: HttpErrorResponse) => {
        this._errorService.msgError(event);
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
