import { Component, OnInit} from '@angular/core';
import { SesionService, User } from '../services/sesion.service';
import { BackendService } from '../services/backend.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  public persona: any; // Cambia esto a un tipo más específico si es necesario
  public isEditing: boolean = false;
  public user_antiguo: string | undefined;
  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadUserData();
    
  }


  

  loadUserData() {
    this.persona = this.sesionService.getUser(); // Cargar datos del usuario
    console.log('Datos de usuario cargados:', this.persona);
    this.user_antiguo = this.persona.username;
    console.log(this.user_antiguo)
    console.log(this.persona) // Para depuración
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  logout(){
    this.sesionService.logout();
    localStorage.removeItem('user');
    this.router.navigate(['/login/login']); 

    

  }
  iniciar_sesion(username:any, password:any) {
    const credentials = {
      username: username,
      password: password,
    };
    
    this.backendService.login(credentials).subscribe(
      response => {
          console.log('Respuesta del backend:', response); // Verificar la respuesta completa
          if (response.status === 'success') {
              this.sesionService.setUser(response.usuario); // Guarda todos los datos del usuario
              this.router.navigate(['/index/index']); // Redirige a la página principal
          }
      },
      error => {
          console.error('Error al iniciar sesión:', error);
          alert('Credenciales incorrectas.'); // Manejo de errores
      }
  );
  }
  

  async saveChanges() {
    const dataToSend = {
      ...this.persona, // Incluye los nuevos datos de la persona
      user_antiguo: this.user_antiguo // Incluye el username antiguo
    };
  
    // Verificar si algún dato está vacío
    if (!this.persona.nomb || !this.persona.apellido || !this.persona.gmail || !this.persona.username) {
      const alert = await this.alertController.create({
        header: '{{"DatosInsuficientes"|translate}}', // Usar clave de traducción para "Datos insuficientes"
        subHeader: '{{"RelleneLosDatos"|translate}}', // Usar clave de traducción para "Rellene los datos"
        message: '{{"AlgunosDatosVacios"|translate}}', // Usar clave de traducción para "Algunos datos están vacíos, por favor rellénelos"
        buttons: [
          {
            text: '{{"OK"|translate}}', // Usar clave de traducción para "OK"
            handler: () => {
              // Lógica adicional si es necesario
            }
          }
        ],
      });
      await alert.present(); // Asegúrate de presentar el alert
      return; // Salir de la función para evitar procesar más lógica
    }
  
    // Si los datos son válidos, proceder a actualizar
    this.backendService.updateUsuario(dataToSend).subscribe(
      response => {
        console.log('Cambios guardados', response);
  
        // Actualiza la sesión con los nuevos datos
        this.sesionService.setUser(response.usuario);
        this.persona = response.usuario; // Actualiza el objeto persona con los datos devueltos
        this.isEditing = false; // Salir del modo de edición
  
        // Aquí puedes agregar lógica adicional si necesitas refrescar alguna parte de la vista
      },
      async error => {
        console.error('Error al guardar cambios:', error);
        const errorAlert = await this.alertController.create({
          header: '{{"Error"|translate}}', // Usar clave de traducción para "Error"
          message: '{{"ErrorGuardarCambios"|translate}}', // Usar clave de traducción para "Error al guardar los cambios"
          buttons: ['{{"OK"|translate}}'] // Usar clave de traducción para "OK"
        });
        await errorAlert.present();
      }
    );
  }
  
  async cancelChanges() {
    this.isEditing = false; 
    window.location.reload();
  }
  
}
