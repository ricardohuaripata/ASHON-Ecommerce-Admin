import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastr: ToastrService) { }

  msgError(event: HttpErrorResponse) {
    if(event.error.message != null) {
      // mostrar mensaje de errores programados, por ej: 'contraseña incorrecta'(login), 'ya existe un username'(registro)
      this.toastr.error(event.error.message, 'Action failed');
    }else {
      // mostrar mensaje de errores desconocidos del backend
      this.toastr.error('Something went wrong', 'Error');
    }
  }
  
}
