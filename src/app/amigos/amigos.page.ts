import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { SesionService, User } from '../services/sesion.service';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.page.html',
  styleUrls: ['./amigos.page.scss'],
})
export class AmigosPage implements OnInit {
  expandedId: string | null = null;
  mostrarEliminarIconos: boolean = false; 
  isModalOpen = false;
  presentingElement: HTMLElement | null = null;
  cantidadVisible: number = 5;
  public persona: any; 
  public friend: [] | any;
 // Cambia esto a un tipo más específico si es necesario
  // Cambia esto a un tipo más específico si es necesario
  public isEditing: boolean = false;
  public user_antiguo: string | undefined;
  public friends: []|any;
  user_friend: string = '';
  usuario: string = '';
  username: string = '';
  gmail: string = '';
  password: string = '';
 

  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,private alertController: AlertController
  ) {}
  

  ngOnInit() {
    this.loadUserData();
    // this.loadFriend();   
    this.cargarFriend();
  }
  reloadPage(){
    window.location.reload();
  }
  
  

  loadFriend() {
    console.log(this.persona)
    this.backendService.getFriend(this.persona).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.friend = response.amigos; // Asigna la lista de amigos
          console.log('Amigos cargados:', this.friend);

        }
      },
      error: err => {
        console.error('Error al cargar amigos:', err);
      }
    });
  }
  
  cargarFriend() {
    console.log(this.persona)
    this.backendService.CargarFriend(this.persona).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.friends = response.amigos; // Asigna la lista de amigos
          console.log('Amigos cgados:', this.friends);

        }
      },
      error: err => {
        console.error('Error al cargar amigos:', err);
      }
    });
  }
eliminarAmigo(){}
  
  async saveFriends(estado:any,username_friend:any) {
    const loading = await this.loadingController.create({
      message: 'Guardando datos.....'
    });
    await loading.present();
  
    const dataToSend = {
      ...this.persona,
      username_friend, 
      estado
      // Incluye los nuevos datos de la persona
      // Incluye el username antiguo
    };
  
    await this.backendService.confirm_friend(dataToSend).subscribe(
      response => {
        console.log('amigo',dataToSend);
  
        // Actualiza la sesión con los nuevos datos
       this.cargarFriend();
        loading.dismiss();
        
        // Aquí puedes agregar lógica adicional si necesitas refrescar alguna parte de la vista
      },
      error => {
        console.error('Error al guardar usuario', error);
        alert('Error al guardar los cambios.');
        loading.dismiss();
      }
    );
  }
  
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  async agregarAmigo() {
    const nuevoAmigo = {
      user_friend: this.user_friend,
      usuario: this.persona.username,
      
    };
    if(this.user_friend){
      this.backendService.addAmigo(nuevoAmigo).subscribe({
        next: async response => {
          console.log('amigo agregado', response);
          const alert = await this.alertController.create({
            header: 'ENVIADO',
            subHeader: 'Solicitud de amistad enviada con exito',
            message: 'Se ha enviado la solicitud de amistad correctamente espere respuesta.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  window.location.reload();
      
                  // Redirigir a la página deseada al hacer clic en "OK"
                  
                }
              }
            ],
          });
          await alert.present();
        },
        error: async err => {
          console.error('Error al agregar usuario', err);
          const alert = await this.alertController.create({
            header: 'Datos Erroneos',
            subHeader: 'usuario erroneo',
            message: 'Usuario no existe',
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
      message: 'usuario vacio',
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
    console.log(this.persona.username)
    console.log(this.user_friend)
  
    
  }

  loadUserData() {
    this.persona = this.sesionService.getUser(); // Cargar datos del usuario
    
  }
  eliminar() {
    this.mostrarEliminarIconos = !this.mostrarEliminarIconos; // Cambia el estado al presionar "eliminar"
  }

  mostrar() {
    // here you can check your parameter
     
        this.setOpen(true);
     
   }

   setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };
}
