import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';
import { ErrorService } from '../../services/error.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;
  private routeSubscription!: Subscription;
  metadata: any;

  constructor(
    private _errorService: ErrorService,
    private usersService: UsersService,
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
        return this.usersService.getUsers(customParams);
      })
    )
    .subscribe(
      (data: any) => {
        this.users = data.users;
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
