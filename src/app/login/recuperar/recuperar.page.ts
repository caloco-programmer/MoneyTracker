import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../../services/sesion.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  constructor(private alertController: AlertController,private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController) {}
  ngOnInit(): void {
    
  }
email:string = '';
username:string ='';

  async presentAlert() {
    const credentials = {
      email:this.email,
      username:this.username
    };
    if (!this.username ||!this.email ) {
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
    }
    if(this.email && this.username){
      this.backendService.recuperarContraseña(credentials).subscribe({
        next: async response => {
          console.log('Correo enviado', response);
          const alert = await this.alertController.create({
            header: 'ENVIADO',
            subHeader: 'CORREO ENVIADO CON EXITO',
            message: 'SIGA LOS PASOS EN EL CORREO PARA RECUPERAR SU CONTRASEÑA.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                      this.router.navigate(['/login/login']);
      
                  // Redirigir a la página deseada al hacer clic en "OK"
                  
                }
              }
            ],
          });
          await alert.present();
        },
        error: async err => {
          console.error('Error al agregar gasto', err);
          const alert = await this.alertController.create({
            header: 'Datos Erroneos',
            subHeader: 'Correo o contraseña erroneos',
            message: 'Correo o Contraseña erroneos porfavor intentelo denuevo',
            buttons: [
              {
                text: 'OK',
                handler: () => {
      
                  // Redirigir a la página deseada al hacer clic en "OK"
                  
                }
              }
            ],
          });
          await alert.present();
        }
      });

  }else{
    const alert = await this.alertController.create({
      header: 'Datos Vacios',
      subHeader: 'Rellene los datos',
      message: 'Correo o Contraseña vacios',
      buttons: [
        {
          text: 'OK',
          handler: () => {

            // Redirigir a la página deseada al hacer clic en "OK"
            
          }
        }
      ],
    });
    await alert.present();
  }

    
  

  }




}


