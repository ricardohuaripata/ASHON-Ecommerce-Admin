import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.mostrarEsperaCarga();

    this.usersService.getUsers().subscribe(
      (data: any) => {
        this.users = data.users;
        this.loading = false;
        Swal.close();
      },
      (error) => {
        console.error(error);
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
