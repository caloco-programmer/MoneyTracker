import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
export interface User {
  username: string;
  gmail: string;
  apellido: string;
  nombre: string;
  password: string;
  // Agrega otras propiedades que necesites
}

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  private user: User | null = null;
  router: any;

  setUser(user: User): void {
    localStorage.removeItem('usuario');

    this.user = user;
    localStorage.setItem('user', JSON.stringify(user)); // Guarda el objeto completo en localStorage
    console.log('Inicio de sesión', this.user);
  }

  getUser(): User | null {
    if (!this.user) {
      try {
        const storedUser = localStorage.getItem('user');
        this.user = storedUser ? JSON.parse(storedUser) : null;
        console.log('Usuario recuperado', this.user); // Esto debería mostrar todos los datos
      } catch (error) {
        console.error('Error al recuperar el usuario de localStorage', error);
        this.user = null; // Restablece el usuario en caso de error
      }
    }
    return this.user;
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('user');
    console.log(localStorage.getItem('user')); // Elimina de localStorage
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}
