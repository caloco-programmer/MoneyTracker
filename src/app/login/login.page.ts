import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { SesionService } from '../services/sesion.service'; 
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  keepLoggedIn: boolean = false; 
  persona:any;
  constructor(
    public backendService: BackendService,
    private router: Router,
    private sesionService: SesionService,
    private alertController: AlertController
  ) {}
  
  ngOnInit() {
    this.logout();
    localStorage.removeItem('user'); // Elimina de localStorage
    this.persona = localStorage.getItem('user');
    console.log(this.persona);
  }
  logout(){
    this.sesionService.logout()
  }
  iniciar_sesion() {
    // Validación de campos vacíos
    if (!this.username || !this.password) {
        alert('Por favor, ingrese su usuario y contraseña.');
        return; // Detener el flujo si los campos están vacíos
    }

    const credentials = {
        username: this.username,
        password: this.password,
    };

    this.backendService.login(credentials).subscribe(
        async response => {
            console.log('Respuesta del backend:', response); // Verificar la respuesta completa
            if (response.status === 'success') {
                // Guarda todos los datos del usuario en el servicio de sesión
                this.sesionService.setUser(response.usuario);

                // Manejo de la opción "mantener sesión iniciada"
                if (this.keepLoggedIn) {
                    localStorage.setItem('keepLoggedIn', 'true');
                } else {
                    localStorage.removeItem('keepLoggedIn');
                }

                // Redirige al usuario a la página principal
                this.router.navigate(['/index/index']);
            } else {
                // Si el backend devuelve un estado distinto a 'success'
                const alert = await this.alertController.create({
                    header: 'Error al iniciar sesión',
                    subHeader: 'Credenciales incorrectas',
                    message: 'Por favor, verifique su usuario y contraseña.',
                    buttons: ['OK'],
                });
                await alert.present();
            }
        },
        async error => {
            console.error('Error al iniciar sesión:', error);
            const alert = await this.alertController.create({
                header: 'Error de credenciales',
                subHeader: 'Credenciales incorrectas',
                message: 'Usuario o contraseña incorrectos',
                buttons: ['OK'],
            });
            await alert.present();
        }
    );
}
}
