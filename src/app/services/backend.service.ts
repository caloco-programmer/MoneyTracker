import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { SesionService,User } from './sesion.service';
import { NavController } from '@ionic/angular';


export interface UpdateResponse {
  status: string;
  usuario: User; 

}
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  persona :any;
  private apiUrl = 'https://taigneto.ddns.net/usuarios'; // Cambia esto según sea necesario
  private url = 'https://taigneto.ddns.net/login';
  private url_upt = 'https://taigneto.ddns.net/update';
  private user: User | null = null;
  
  constructor(private http: HttpClient,private sesionService: SesionService,
    private navController: NavController
  ) {}
  
//Usuario
  setUser(user: User): void {
    this.user = user; 
    localStorage.setItem('user', JSON.stringify(user)); // Guarda el objeto completo en localStorage
    console.log('Inicio de sesión', this.user);
  }
  addUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  recuperarContraseña(usuario: any): Observable<any> {
    return this.http.post('https://taigneto.ddns.net/recuperar-password', usuario);
  }
 
  login(usuario: any): Observable<any> {
    console.log(usuario);
    localStorage.removeItem('usuario');

    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify(usuario);
  
    return this.http.post(this.url, body, { headers }).pipe(
      tap((response: any) => {
        // Lógica después de una respuesta exitosa
        console.log('Inicio de sesión exitoso:', response);
  
        // Guardar el token o datos necesarios si aplica
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
  
        // Redirigir al tutorial si es la primera vez
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        this.persona = this.sesionService.getUser();
        if (!hasSeenTutorial) {
          this.navController.navigateRoot('/administrativo/administrativo'); // Redirige al tutorial
        } else {
          this.navController.navigateRoot('/index/index'); // Redirige al home
        }
      }),
      catchError((error) => {
        console.error('Error en inicio de sesión:', error);
        return throwError(error);
      })
    );
  }

  updateUsuario(usuario: any): Observable<UpdateResponse> {
    console.log(usuario);
    return this.http.post<UpdateResponse>(this.url_upt, usuario).pipe(
      tap(response => {
        // Asegúrate de que la propiedad 'usuario' existe en la respuesta
        this.sesionService.setUser(response.usuario);  // Actualiza la sesión con el usuario actualizado
        console.log('Sesión actualizada con los nuevos datos', response.usuario);
      })
    );
  }
  
  saveUserSession(usuario: string): void {
    localStorage.removeItem('usuario');

    localStorage.setItem('usuario', usuario);
  }

  // Método para obtener el usuario de la sesión
  getUserSession(): string | null {
    return localStorage.getItem('usuario');
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('usuario');
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.getUserSession() !== null;
  }

//amigos
  addAmigo(usuario: any): Observable<any> {
    return this.http.post('https://taigneto.ddns.net/add_friend', usuario);
  }
  getFriend(usuario:any):Observable<any>{ 
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify( usuario ); 
    console.log(body)
    console.log(body,{headers}) // Asegúrate de enviar un JSON válido
    return this.http.post('https://taigneto.ddns.net/get_friend', body,{headers});
  }
  CargarFriend(usuario:any):Observable<any>{ 
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify( usuario ); 
    console.log(body)
    console.log(body,{headers}) // Asegúrate de enviar un JSON válido
    return this.http.post('https://taigneto.ddns.net/cargar_friend', body,{headers});
  }
  confirm_friend(usuario:any):Observable<any>{
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify( usuario ); 
    console.log('datos usuario',body)
    console.log(body,{headers}) // Asegúrate de enviar un JSON válido
    return this.http.post('https://taigneto.ddns.net/confirmar_friend', body,{headers});
  }
  delete_amigo(id_tarjeta: number): Observable<any> {
    const body = { id_categoria: id_tarjeta };
    return this.http.post('https://taigneto.ddns.net/delete_tarjeta', body);
  } 
//tarjetas
  delete_tarjeta(id_tarjeta: number): Observable<any> {
    const body = { id_categoria: id_tarjeta };
    return this.http.post('https://taigneto.ddns.net/delete_tarjeta', body);
  } 
  addTarjeta(usuario: any): Observable<any> {
    return this.http.post('https://taigneto.ddns.net/add_tarjeta', usuario);
  }
  uptTarjeta(usuario: any): Observable<any> {
    return this.http.post('https://taigneto.ddns.net/upt_tarjeta', usuario);
  }   
  getCards(usuario:any):Observable<any>{
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify( usuario ); 
    console.log(body)
    console.log(body,{headers}) // Asegúrate de enviar un JSON válido
    return this.http.post('https://taigneto.ddns.net/get_tarjeta', body,{headers});
  }
//categorias
  getCategorias(usuario:any):Observable<any>{
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify( usuario ); 
    console.log(body)
    console.log(body,{headers}) // Asegúrate de enviar un JSON válido
    return this.http.post('https://taigneto.ddns.net/get_categorias', body,{headers});
  }
  delete_categoria(id_categoria: number): Observable<any> {
    const body = { id_categoria: id_categoria };
    return this.http.post('https://taigneto.ddns.net/delete_categoria', body);
  }
  
  addCategoria(nuevaCategoria: any): Observable<any> {
    return this.http.post('https://taigneto.ddns.net/add_categoria', nuevaCategoria); 
  }
//gastos
addGasto(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/add_gasto', usuario);
} 
uptGasto(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/upt_gasto', usuario);
} 
getGastos(usuario:any):Observable<any>{
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify( usuario ); 
  console.log(body)
  console.log(body,{headers}) // Asegúrate de enviar un JSON válido
  return this.http.post('https://taigneto.ddns.net/get_gasto', body,{headers});
}
delete_gasto(id_categoria: number): Observable<any> {
  const body = { id_categoria: id_categoria };
  return this.http.post('https://taigneto.ddns.net/delete_gasto', body);
}
//Ingresos
addIngreso(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/add_ingreso', usuario);
} 
uptIngreso(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/upt_ingreso', usuario);
} 
getIngresos(usuario:any):Observable<any>{
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify( usuario ); 
  console.log(body)
  console.log(body,{headers}) // Asegúrate de enviar un JSON válido
  return this.http.post('https://taigneto.ddns.net/get_ingreso', body,{headers});
}
delete_ingreso(id_categoria: number): Observable<any> {
  const body = { id_categoria: id_categoria };
  return this.http.post('https://taigneto.ddns.net/delete_ingreso', body);
}
//iconos
getIcon(usuario:any):Observable<any>{
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify( usuario ); 
  console.log(body)
  console.log(body,{headers}) // Asegúrate de enviar un JSON válido
  return this.http.post('https://taigneto.ddns.net/get_icon', body,{headers});
}
delete_icon(id_icon: number): Observable<any> {
  const body = { id_icon: id_icon };
  return this.http.post('https://taigneto.ddns.net/delete_icon', body);
}
//deudas
addDeuda(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/add_deuda', usuario);
} 
uptDeuda(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/upt_deuda', usuario);
} 
getDeudas(usuario:any):Observable<any>{
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify( usuario ); 
  console.log(body)
  console.log(body,{headers}) // Asegúrate de enviar un JSON válido
  return this.http.post('https://taigneto.ddns.net/get_deuda', body,{headers});
}
delete_deuda(id_categoria: number): Observable<any> {
  const body = { id_categoria: id_categoria };
  return this.http.post('https://taigneto.ddns.net/delete_deuda', body);
}

//AHORROS
addAhorro(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/add_ahorro', usuario);
} 
uptAhorro(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/upt_ahorro', usuario);
} 
getAhorros(usuario:any):Observable<any>{
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify( usuario ); 
  console.log(body)
  console.log(body,{headers}) // Asegúrate de enviar un JSON válido
  return this.http.post('https://taigneto.ddns.net/get_ahorro', body,{headers});
}
delete_ahorro(id_categoria: number): Observable<any> {
  const body = { id_categoria: id_categoria };
  return this.http.post('https://taigneto.ddns.net/delete_ahorro', body);
}
//PRESTAMOS
addPrestamo(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/add_prestamo', usuario);
} 
uptPrestamo(usuario: any): Observable<any> {
  return this.http.post('https://taigneto.ddns.net/upt_prestamo', usuario);
} 
getPrestamos(usuario:any):Observable<any>{
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify( usuario ); 
  console.log(body)
  console.log(body,{headers}) // Asegúrate de enviar un JSON válido
  return this.http.post('https://taigneto.ddns.net/get_prestamo', body,{headers});
}
delete_prestamo(id_categoria: number): Observable<any> {
  const body = { id_categoria: id_categoria };
  return this.http.post('https://taigneto.ddns.net/delete_prestamo', body);
}

enviarPdf(pdf:any): Observable<any>{
  return this.http.post('https://taigneto.ddns.net/enviar_pdf', pdf);


}

}
