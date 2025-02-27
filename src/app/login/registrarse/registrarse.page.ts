import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../../services/sesion.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {
  nombre: string = '';
  apellido: string = '';
  username: string = '';
  gmail: string = '';
  password: string = '';

  constructor(private alertController: AlertController,private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {}
  async agregarUsuario() {

    const nuevoUsuario = {
      nombre: this.nombre,
      apellido: this.apellido,
      username: this.username,
      gmail: this.gmail,
      password: this.password,
    };
    if (!this.nombre ||!this.apellido ||!this.username ||!this.gmail ||!this.password
   ) {
     const alert = await this.alertController.create({
       header: 'Datos Incompletos',
       subHeader: 'Por favor, complete todos los campos obligatorios.',
       message: 'Asegúrese de ingresar todos los datos requeridos antes de continuar.',
       buttons: [
         {
           text: 'OK',
           handler: () => {
             // Redirigir o ejecutar lógica adicional si es necesario
           },
         },
       ],
     });
   
     // Muestra la alerta al usuario
     await alert.present();
   }else{
    this.backendService.addUsuario(nuevoUsuario).subscribe({
      next: async response => {
        console.log('Usuario agregado', response);
        const alert = await this.alertController.create({
          header: 'Usuario Creado Con Exito',
          subHeader:'Correo enviado',
          message: 'Se envio un correo de confirmacion para crear al usuario',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                // Redirigir o ejecutar lógica adicional si es necesario
                this.router.navigate(['/login/login']);

              }
            }
          ],
        });
        await alert.present();
        return;
      },
      error: async err => {
        console.error('Error al agregar usuario', err);
        const alert = await this.alertController.create({
          header: 'usuario ya existe',
          subHeader: 'Usuario existente',
          message: 'El usuario ya existe porfavor indeque otro',
          buttons: ['OK'],
      });
        await alert.present();
      }
    });
  }
  }
  
}
