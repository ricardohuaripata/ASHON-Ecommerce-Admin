import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/interfaces/category';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryToDelete: Category | undefined;
  loading: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private toastr: ToastrService,
    private _errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.mostrarEsperaCarga();
    this.categoriesService.getCategories().subscribe(
      (data: any) => {
        this.categories = data.categories;
        this.loading = false;
        Swal.close();
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        Swal.close();
        this._errorService.msgError(error);   
      }
    );
  }

  openDeleteConfirmation(categoryId: string): void {
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
        this.deleteCategory(categoryId);
      }
    });
  }

  // DELETE
  deleteCategory(categoryId: string): void {
    this.categoriesService.deleteCategory(categoryId).subscribe({
      next: (data: any) => {
        this.toastr.success(data.message, data.type);

        this.categoriesService.getCategories().subscribe(
          (data: any) => {
            this.categories = data.categories;
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

}
