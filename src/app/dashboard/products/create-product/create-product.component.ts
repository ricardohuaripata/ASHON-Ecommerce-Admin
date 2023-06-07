import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products.service';
import { ErrorService } from 'src/app/services/error.service'; // servicio para mostrar mensajes de errores devueltos por el backend
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _productService: ProductsService,
    private toastr: ToastrService,
    private router: Router,
    private _errorService: ErrorService
  ) {
    this.form = this.fb.group({
      // validar campo requerido
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      genre: ['', Validators.required],
      price: [null, Validators.required],
      colors: ['', Validators.required],
      sizes: ['', Validators.required],
      quantity: [null, Validators.required],
      mainImage: ['', Validators.required],
      images: this.fb.array([]),
    });
  }
  ngOnInit(): void {}

  onMainImageSelected(event: any) {
    console.log(event.target.files);

    const file = event.target.files[0];
    this.form.get('mainImage')?.setValue(file);
  }

  onImagesSelected(event: any) {
    const files = event.target.files;
    const imageArray = this.form.get('images') as FormArray;

    // Limpiar el FormArray existente
    while (imageArray.length !== 0) {
      imageArray.removeAt(0);
    }

    // Agregar los archivos seleccionados al FormArray
    for (let i = 0; i < files.length; i++) {
      imageArray.push(this.fb.control(files[i]));
    }
  }

  addProduct() {
    this.form.disable;
    this.mostrarEsperaCarga();

    const formData = new FormData();

    formData.append('name', this.form.get('name')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('category', this.form.get('category')?.value);
    formData.append('genre', this.form.get('genre')?.value);
    formData.append('price', this.form.get('price')?.value);
    formData.append('priceDiscount', '0');
    formData.append('colors', this.form.get('colors')?.value);
    formData.append('sizes', this.form.get('sizes')?.value);
    formData.append('quantity', this.form.get('quantity')?.value);
    formData.append('sold', '0');
    formData.append('isOutOfStock', 'false');
    formData.append('mainImage', this.form.get('mainImage')?.value);

    // Agregar los archivos del FormArray al formData
    const images = this.form.get('images')?.value;
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    // AGREGAR
    this._productService.addProduct(formData).subscribe({
      // si la peticion ha tenido exito
      next: (data) => {
        this.loading = false;
        Swal.close();
        this.toastr.success(data.message, data.type);
        this.router.navigate(['/products']);
      },
      // si se produce algun error en la peticion
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
