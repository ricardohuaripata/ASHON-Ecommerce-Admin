import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from 'src/app/services/categories.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _categoryService: CategoriesService,
    private toastr: ToastrService,
    private router: Router,
    private _errorService: ErrorService
  ) {
    this.form = this.fb.group({
      // validar campo requerido
      name: ['', Validators.required],
      description: ['', Validators.required],
      uploadImage: ['', Validators.required],
    });
  }
  ngOnInit(): void {}

  onFileDrop(event: any) {
    console.log(event.target.files);

    const file = event.target.files[0];
    this.form.get('uploadImage')?.setValue(file);
  }

  addCategory() {
    const formData = new FormData();

    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('image', this.form.get('uploadImage')?.value);

    // AGREGAR
    this._categoryService.addCategory(formData).subscribe({
      // si la peticion ha tenido exito
      next: (data) => {
        this.toastr.success(data.message, data.type);
        this.router.navigate(['/categories']);
      },
      // si se produce algun error en la peticion
      error: (event: HttpErrorResponse) => {
        this._errorService.msgError(event);
      },
    });
  }
}
