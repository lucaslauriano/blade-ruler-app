import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'categories',
    loadChildren: './pages/categories/list/list.module#ListPageModule'
  },
  {
    path: 'categories/:id',
    loadChildren:
      './pages/categories/new/new-categorie.module#NewCategoriePageModule'
  },
  {
    path: 'new-categorie',
    loadChildren:
      './pages/categories/new/new-categorie.module#NewCategoriePageModule'
  },
  {
    path: 'identify/:id',
    loadChildren: './pages/blades/identify/identify.module#IdentifyPageModule'
  },
  {
    path: 'blades',
    loadChildren: './pages/blades/list/blades.module#BladesPageModule'
  },
  {
    path: 'blades/:id',
    loadChildren:
      './pages/blades/new/new-blade.module#NewBladePageModule'
  },
  {
    path: 'new-blade',
    loadChildren: './pages/blades/new/new-blade.module#NewBladePageModule'
  },
  {
    path: 'new-user',
    loadChildren: './pages/users/new/new-user.module#NewUserPageModule'
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'connect', loadChildren: './pages/connect/connect.module#ConnectPageModule' },
  { path: 'inventory', loadChildren: './pages/inventory/inventory.module#InventoryPageModule' },
  { path: 'locate', loadChildren: './modal/locate/locate.module#LocatePageModule' },
  { path: 'connect-config-popover', loadChildren: './pages/connect/connect-config-popover/connect-config-popover.module#ConnectConfigPopoverPageModule' }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
