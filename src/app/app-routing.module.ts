import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { UsersComponent } from './dashboard/users/users.component';
import { ProductsComponent } from './dashboard/products/products.component';
import { CategoriesComponent } from './dashboard/categories/categories.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// guards, proteger las rutas que requieran de iniciar sesion, osea de tener un token en local storage)
import { AuthGuard } from './utils/auth.guard';
import { CreateCategoryComponent } from './dashboard/categories/create-category/create-category.component';
import { CreateProductComponent } from './dashboard/products/create-product/create-product.component';

const routes: Routes = [
  {path: 'auth/login', component: LoginComponent},
  {path: '', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  {path: 'products/new', component: CreateProductComponent, canActivate: [AuthGuard]},
  {path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard]},
  {path: 'categories/new', component: CreateCategoryComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
