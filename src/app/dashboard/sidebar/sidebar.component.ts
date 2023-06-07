import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  //Sidebar toggle show hide function
  status = false;
  addToggle() {
    this.status = !this.status;
  }
  constructor(private router: Router, private _authService: AuthService) {}

  isActive(url: string): boolean {
    return this.router.isActive(url, true);
  }

}
