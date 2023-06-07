import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Modulos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// modulo necesario para la conexion con el backend
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// modulo para toastr
import { ToastrModule } from 'ngx-toastr';

import { AddTokenInterceptor } from './utils/add-token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './dashboard/users/users.component';
import { ProductsComponent } from './dashboard/products/products.component';
import { CategoriesComponent } from './dashboard/categories/categories.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { CreateCategoryComponent } from './dashboard/categories/create-category/create-category.component';
import { CreateProductComponent } from './dashboard/products/create-product/create-product.component';
import { NavbarComponent } from './dashboard/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    ProductsComponent,
    CategoriesComponent,
    LoginComponent,
    DashboardComponent,
    SidebarComponent,
    CreateCategoryComponent,
    CreateProductComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // modulo necesario para la conexion con el backend
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    // importar y configurar libreria toastr
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    // interceptor token
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
