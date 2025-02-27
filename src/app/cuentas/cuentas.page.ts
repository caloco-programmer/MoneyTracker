import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { SesionService, User } from '../services/sesion.service';
import { BackendService } from '../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

interface Item {
  monto: string;
  fecha: string;
  cuenta: string;
  nombre: string;
}

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.page.html',
  styleUrls: ['./cuentas.page.scss'],
})
export class CuentasPage implements OnInit {
  expandedId: string | null = null;
  mostrarEliminarIconos: boolean = false; 
  isModalOpen = false;
  presentingElement: HTMLElement | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
  selectedChartType: ChartType = 'bar';  // Tipo de gráfico seleccionado
  chart: any; 
  public persona: any; 
  nombre: string = '';
  tipo: string = '';
  cantidad: any;
  tarjetaVista:boolean = false;
  
  selectedDate: string='';  // Almacena la fecha seleccionada
  minDate: string;
  maxDate: string;
  fecha:string='';
  fecha_pago:string = '';
  mostrarLista: Item[] = [];
  public tarjetas  :[] | any;
  mostrarEditarIconos: boolean = false; 
  isEditing: boolean =false;
  isOpen:boolean =false;
  id_tarjeta: number|any;
  
  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,
  private navController: NavController) {
      const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      this.minDate = `${currentYear}-${currentMonth}-01`;  // Primer día del mes
    this.maxDate = `${currentYear}-${currentMonth}-31`;
    }

  ngOnInit() {
    this.loadUserData();
    
    this.loadCard();

    this.getSelectedCurrency();
  }

  
  editar(gasto?: any) {
    console.log(gasto.id_tarjeta)
    this.id_tarjeta = gasto.id_tarjeta;
    this.nombre = gasto.nombre;
    this.cantidad = gasto.cantidad;
    this.tipo = gasto.tipo_tarjeta;
    this.setOpen(true); 
    this.isEditing = true;
  }
  editarButon() {
    this.mostrarEditarIconos = !this.mostrarEditarIconos; 
  }
  getSelectedCurrency() {
    return localStorage.getItem('selectedCurrency') || 'CLP'; // Devuelve 'CLP' por defecto si no hay moneda almacenada
  }

  loadUserData() {
    this.persona = this.sesionService.getUser(); // Cargar datos del usuario
  }
  // Función reutilizable para mostrar el cargador
async presentLoading(message: string) {
  const loading = await this.loadingController.create({
    message: message,
    spinner: 'circles', // Cambia el spinner si deseas otro estilo
  });
  await loading.present();
  return loading;
}

// Función para actualizar un gasto
async actualizar() {
  const loading = await this.presentLoading('Actualizando...'); // Muestra el indicador de carga

  const nuevaTarjeta = {
    id_gasto: this.id_tarjeta,
    nombre: this.nombre,
    total: this.cantidad,
    tipo: this.tipo,
    usuario: this.persona.username,
  };
  console.log(nuevaTarjeta);

  this.backendService.uptTarjeta(nuevaTarjeta).subscribe({
    next: async (response) => {
      console.log('Tarjeta agregada', response);
      await loading.dismiss(); // Oculta el indicador de carga
      this.setOpen(false);
      location.reload(); // Recarga la página
      this.isEditing = false;
    },
    error: async (err) => {
      console.error('Error al agregar tarjeta', err);
      
      await loading.dismiss(); // Oculta el indicador de carga si ocurre un error
    },
  });
}

// Función para cargar tarjetas
async loadCard() {
  const loading = await this.presentLoading('Cargando tarjetas...'); // Muestra el indicador de carga

  console.log(this.persona);
  this.backendService.getCards(this.persona).subscribe({
    next: async (response) => {
      if (response.status === 'success') {
        this.tarjetas = response.tarjetas;
        console.log('Tarjetas cargadas:', this.tarjetas);
      }
      await loading.dismiss(); // Oculta el indicador de carga al completar
    },
    error: async (err) => {
      console.error('Error al cargar tarjetas:', err);
      await loading.dismiss(); // Oculta el indicador de carga si ocurre un error
    },
  });
}

// Función para agregar una nueva tarjeta
async addTarjeta() {
  const loading = await this.presentLoading('Agregando tarjeta...'); // Muestra el indicador de carga

  const fechaFinal = this.fecha ? this.fecha : 'fecha';
  const fecha_pago = this.fecha_pago ? this.fecha_pago : 'fecha_pago';

  const nuevaTarjeta = {
    tipo: this.tipo,
    nombre: this.nombre,
    cantidad: this.cantidad,
    usuario: this.persona.username,
    fecha: fechaFinal,
    fecha_pago: fecha_pago,
  };
  console.log(nuevaTarjeta);

  this.backendService.addTarjeta(nuevaTarjeta).subscribe({
    next: async (response) => {
      console.log('Tarjeta agregada', response);
      await loading.dismiss(); // Oculta el indicador de carga
      this.setOpen(false);
      location.reload(); // Recarga la página
    },
    error: async (err) => {
      console.error('Error al agregar tarjeta', err);
      await loading.dismiss(); // Oculta el indicador de carga si ocurre un error
    },
  });
}

  
  reloadPage(){
    window.location.reload();
  }
  
  onTipoChange(event: any) {
    // Si el tipo es crédito, muestra el input; si no, lo oculta
    this.tarjetaVista = event.detail.value === 'credito';
  }

  

  async eliminar_tarjeta(id_tarjeta: number){
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    console.log(id_tarjeta);
    
    await loading.present();
    
    console.log(this.persona);
    await this.backendService.delete_tarjeta(id_tarjeta).subscribe({
      next: async (response) => {
        console.log('Tarjeta agregada', response);
        await loading.dismiss(); // Oculta el indicador de carga
        this.setOpen(false);
        location.reload(); // Recarga la página
      },
      error: async (err) => {
        console.error('Error al agregar tarjeta', err);
        await loading.dismiss(); // Oculta el indicador de carga si ocurre un error
      },
    });
    
   
  }
  mostrar() {
    // here you can check your parameter
     
        this.setOpen(true);
     
   }

   setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  toggleContent(id: string) {
    if (this.expandedId === id) {
      this.expandedId = null; // Colapsa si ya está abierto
    } else {
      this.expandedId = id; // Expande el div con el id recibido
    }
  }
  
  eliminar() {
    this.mostrarEliminarIconos = !this.mostrarEliminarIconos; // Cambia el estado al presionar "eliminar"
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


  
  // Método para actualizar el gráfico cuando el usuario selecciona un nuevo tipo
  
}
