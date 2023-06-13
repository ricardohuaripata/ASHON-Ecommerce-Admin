import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';
import { ErrorService } from '../../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;

  constructor(private _errorService: ErrorService, private usersService: UsersService) {}

  ngOnInit(): void {
    this.mostrarEsperaCarga();

    this.usersService.getUsers().subscribe(
      (data: any) => {
        this.users = data.users;
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
