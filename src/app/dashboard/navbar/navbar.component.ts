import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router, private _authService: AuthService) {}

  logOut() {
    const token = localStorage.getItem('token');

    this._authService.logout(token!).subscribe({
      next: (data: any) => {
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
      },
      error: (event: HttpErrorResponse) => {},
    });
  }
}
