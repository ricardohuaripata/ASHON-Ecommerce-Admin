import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/interfaces/category';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  loading: boolean = false;
  private routeSubscription!: Subscription;
  metadata: any;

  constructor(
    private categoriesService: CategoriesService,
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
          .set('page', page.toString());
        return this.categoriesService.getCategories(customParams);
      })
    )
    .subscribe(
      (data: any) => {
        this.categories = data.categories;
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
        location.reload();

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
