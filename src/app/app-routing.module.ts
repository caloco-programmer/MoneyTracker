import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth/auth-guard.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'administrativo/administrativo',
    pathMatch: 'full'
  },
 
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then( m => m.IndexPageModule),
    canActivate: [AuthGuardService]
  },
  
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'administrativo/administrativo',
    loadChildren: () => import('./administrativo/administrativo.module').then( m => m.AdministrativoPageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'cuentas/gastos',
    loadChildren: () => import('./cuentas/gastos/gastos.module').then( m => m.GastosPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'cuentas/ahorros',
    loadChildren: () => import('./cuentas/ahorros/ahorros.module').then( m => m.AhorrosPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'categorias/categorias',
    loadChildren: () => import('./categorias/categorias.module').then( m => m.CategoriasPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'cuentas/ingresos',
    loadChildren: () => import('./cuentas/ingresos/ingresos.module').then( m => m.IngresosPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'config/config',
    loadChildren: () => import('./config/config.module').then( m => m.ConfigPageModule),
    canActivate: [AuthGuardService]
  },
  
  {
    path: 'estadisticas/estadisticas',
    loadChildren: () => import('./estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'informes/informes',
    loadChildren: () => import('./informes/informes.module').then( m => m.InformesPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'cuentas/predicciones',
    loadChildren: () => import('./cuentas/predicciones/predicciones.module').then( m => m.PrediccionesPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'cuentas/cuentas',
    loadChildren: () => import('./cuentas/cuentas.module').then( m => m.CuentasPageModule),
    canActivate: [AuthGuardService]
  },
  
  
  {
    path: 'amigos/amigos',
    loadChildren: () => import('./amigos/amigos.module').then( m => m.AmigosPageModule),
    canActivate: [AuthGuardService]
  },
 
  {
    path: 'login/registrar',
    loadChildren: () => import('./login/registrarse/registrarse.module').then( m => m.RegistrarsePageModule)
  },
  {
    path: 'login/recuperar',
    loadChildren: () => import('./login/recuperar/recuperar.module').then( m => m.RecuperarPageModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('./estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule),
    canActivate: [AuthGuardService]
  },
 
  {
    path: 'cuentas/deudas',
    loadChildren: () => import('./cuentas/deudas/deudas.module').then( m => m.DeudasPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'prestamos/prestamos',
    loadChildren: () => import('./prestamos/prestamos.module').then( m => m.PrestamosPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal.module').then( m => m.ModalPageModule),
    canActivate: [AuthGuardService]
  },
  
 
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
