import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../../services/sesion.service';
import { Router } from '@angular/router';

import Swiper from 'swiper';
import { NavController } from '@ionic/angular';

import { IonicSlides } from '@ionic/angular';

interface Item {
  monto: string;
  fecha: string;
  cuenta: string;
  nombre: string;
}


interface Ahorro {
  id_ahorro: number;
  id_tarjeta: number;  
  id_categoria:number;
  descripcion:string;
  total: number;
  total_alcanzar:number;
  tarjeta: string;
  categoria: string;
  nombre: string;
  fecha_ingreso: string;
  fecha_limite:string;
  tipo:string;
  
}


interface Deuda{
  id_deuda:number;
  nombre:string;
  total_pagado:number;
  total:number;
  cuotas:number;
  cuotas_pago:number;
  cuotas_pagar:number;
  tarjeta:string;
  tarjeta_pago:string;
  categoria:string;
  tipo:string;
  descripcion:string;
}



@Component({
  selector: 'app-ahorros',
  templateUrl: './ahorros.page.html',
  styleUrls: ['./ahorros.page.scss'],
})
export class AhorrosPage implements OnInit {
  isModalAhorroOpen = false;
  expandedId: string | null = null;
  mostrarEliminarIconos: boolean = false; 
  mostrarEditarIconos: boolean = false; 
  isEditing:boolean = false;
  total_alcanzar:number = 0;
  fecha_limite:string='';
  isModalOpen = false;
  fechaFecha:string='';
  totalAnadir:number|any;
  presentingElement: HTMLElement | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
  selectedChartType: ChartType = 'bar';  
  chart: any; 
  fecha_compra: Boolean = false;
  cantidadCuota:Boolean = false;
  id_tarjeta: number =0;
  id_tarjeta_pagar: number =0;

  id_categoria: number=0;
  fecha:boolean=false;
  Descripcion:string = '';
  total: number=0;
   
  ahorrosOriginales: Ahorro[] = [];  
  
  ahorros : Ahorro[] =[];
  id_ahorro:number=0;
  deudasFiltrados: any[] = [];
  public tarjetas  :[] | any;
  public persona: any; 
  nombre: string = '';
  tipo: string = '';
  cantidad: any;
  tarjetaVista:boolean = false;
 fechaLimite:boolean=false;
  public categorias  :[] | any;
  cantidadCuotas: Number |any;
  mostrarLista:Ahorro[] = [];
  selectedahorro: any;
  totalCuotas:number =0;
  valorCuota:number=0;
  option:Boolean = false;
  tarjetasDebito : []|any;
  tarjetasCredito : []|any;

  deudas: Deuda[] = [];
  todos:string|any;
  selectedAhorro: any;
  tarjetaSeleccionada: any;

  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,private navController: NavController,
    private alertController: AlertController) {}

  ngOnInit() {
    this.presentingElement = document.getElementById('main-content');
    this.presentingElement = document.querySelector('.ion-page');
    
    this.loadUserData();
    this.loadCard();
    this.loadAhorros();
    this.getSelectedCurrency();
    // this.mostrarLista = this.deudas.slice(0, this.cantidadVisible);


  }

  getSelectedCurrency() {
    return localStorage.getItem('selectedCurrency') || 'CLP'; // Devuelve 'CLP' por defecto si no hay moneda almacenada
  }
  swiperSlideChanged(event: any) {
    console.log('changed: ', event.detail);
    console.log(event.detail)
  }

  onOptionChange(event: { detail: { value: any; }; }) {
    const option = event.detail.value;
    console.log(option);
    this.isEditing=false;
    console.log('editable',this.isEditing)

    // Verificar si hay un ahorro seleccionado y pasar los datos correspondientes
    
      // Si no hay un ahorro seleccionado, puedes navegar sin pasar estos datos
      this.navController.navigateForward('/modal', {
        queryParams: { modalType: option ,
          editable:this.isEditing
        }
      });
    
}
  swiperModules = [IonicSlides];

  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    autoplay: {
      delay: 2000
    },
    effect: 'slide',
    direction: 'horizontal',
    initialSlide: 0,
  };

  filtrarAhorros(event:any) {
    if (typeof event.detail.value === 'number') {
      console.log(this.ahorrosOriginales)
      console.log(this.id_tarjeta)
      console.log('todos',this.todos)
      this.ahorrosOriginales.forEach(ahorro => {
        console.log('ID de tarjeta del ahorro:', ahorro.id_tarjeta);
      });
     
      this.ahorros = this.ahorrosOriginales.filter(ahorro => ahorro.id_tarjeta === event.detail.value);
      console.log(this.ahorros)
    }else{
      
      this.ahorros = [...this.ahorrosOriginales];
    }
    console.log('ahorros filtrados',this.ahorros)

  }

  closeModal(modal: { dismiss: () => void; }) {
    modal.dismiss();
    this.reloadPage();
  }
  onTipoChangesl(event: any) {
    if (event.detail.value === 'hoy') {
      const today = new Date();
      this.fecha_limite = today.toISOString().split('T')[0]; 
       // Formato: YYYY-MM-DD
    } else if (event.detail.value === 'personalizado') {
      this.fechaLimite = true; // Muestra el campo de fecha personalizado
    }
  }

  onTipoChange(event: any) {
    console.log('evento',event.detail.value)
    this.tarjetaSeleccionada = this.tarjetasDebito.find((tarjeta: { id_tarjeta: any; }) => tarjeta.id_tarjeta === event.detail.value);
    console.log(this.tarjetaSeleccionada)
    // Si la tarjeta seleccionada es de crédito, mostramos el input de cuotas
    if (this.tarjetaSeleccionada.tipo_tarjeta === 'credito') {
      this.tarjetaVista = true;
      console.log(this.tarjetaVista);
      console.log(this.tarjetaSeleccionada);
    } else {
      this.tarjetaVista = false;
      console.log(this.tarjetaVista);
      console.log(this.tarjetaSeleccionada);


    }
  }
  
  onTipoChanges(event: any) {
    // Si el tipo es crédito, muestra el input; si no, lo oculta
    this.option=true;

    this.fecha_compra = event.detail.value === 'personalizado';
  }
  onCuotasChange(event: any) {
    this.option=true;


    this.totalCuotas = this.cantidadCuotas * this.valorCuota;
    console.log(this.totalCuotas);

    // Si el tipo es crédito, muestra el input; si no, lo oculta
    this.fecha_compra = event.detail.value === 'personalizado';
  }
  
  filtrarahorros(){

  }
  
  // filtrardeudas() {
  //   if (this.id_tarjeta) {
  //     console.log(this.deudasOriginales)
  //     console.log(this.id_tarjeta)
  //     this.deudasOriginales.forEach(ahorro => {
  //       console.log('ID de tarjeta del ahorro:', ahorro.id_tarjeta);
  //     });
     
  //     this.deudas = this.deudasOriginales.filter(ahorro => ahorro.id_tarjeta === this.id_tarjeta);
  //     console.log(this.deudas)
  //   } else {
      
  //     this.deudas = [...this.deudasOriginales];
  //   }
  //   this.loadChart(); 
  // }
  async eliminar_ahorro(id_categoria: number){
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    console.log(id_categoria);
    
    await loading.present();
    
    console.log(this.persona);
    await this.backendService.delete_ahorro(id_categoria).subscribe({
      next: response => {
        if (response.status === 'success') {
          
          this.deudas = response.deudas;  
          console.log('deudas cargadas:', this.deudas);
          loading.dismiss();
          this.reloadPage();
        }
      },
      error: err => {
        console.error('Error al cargar deudas:', err);
        loading.dismiss();
      }
    });
    
   
  }
  
  async loadCategoria() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    await loading.present();
  
    console.log(this.persona);
    
    await this.backendService.getCategorias(this.persona).subscribe({
      next: response => {
        if (response.status === 'success') {
          
          this.categorias = response.categorias;  
          console.log('Categorías cargadas:', this.categorias);
          loading.dismiss();
        }
      },
      error: err => {
        console.error('Error al cargar categorías:', err);
        loading.dismiss();
      }
    });
  }
  loadUserData() {
    this.persona = this.sesionService.getUser();
    
   
     
  }
  async loadCard(){
    const loading = await this.loadingController.create({
      message: 'cargando datos.....'
    });
    await loading.present();
    console.log(this.persona)
    await  this.backendService.getCards(this.persona).subscribe({
        next: response => {
          if (response.status === 'success') {
            
            this.tarjetas = response.tarjetas;
            console.log(this.tarjetas)
            console.log('tarjetas cargadas:', this.tarjetas);
            loading.dismiss();
            const tarjetasDebito = response.tarjetas.filter((tarjeta: { tipo_tarjeta: string; }) => tarjeta.tipo_tarjeta === 'debito');
            this.tarjetasDebito = tarjetasDebito;
            const tarjetasCredito = response.tarjetas.filter((tarjeta: { tipo_tarjeta: string; }) => tarjeta.tipo_tarjeta === 'credito');
            this.tarjetasCredito = tarjetasCredito;
            console.log(this.tarjetasDebito);

          }
        },
        error: err => {
          console.error('Error al cargar tarjetas:', err);
          loading.dismiss();
        }
      });
  }
  mostrar() {
    
     
        this.setOpen(true);
     
   }

   editar(ahorro?: any) {
    if (ahorro) {
      this.isEditing = true; 
      this.selectedahorro = ahorro; 
      
      this.id_ahorro=ahorro.id_ahorro
      this.nombre = ahorro.nombre;
      this.total = ahorro.total;
      this.Descripcion = ahorro.descripcion;
      this.fechaFecha = ahorro.fecha_limite;
      this.id_tarjeta = ahorro.id_tarjeta;
      this.id_categoria = ahorro.id_categoria;

      console.log(this.fechaFecha)
      console.log(this.id_categoria)
      console.log(ahorro.id_categoria)
      console.log(this.Descripcion)
      console.log(ahorro.descripcion)
      console.log(ahorro.fecha_ingreso)
    } else {
     
      this.isEditing = false; 
      this.selectedahorro = null;
     
      this.nombre = '';
      this.total = 0;
      this.Descripcion = '';
      this.fechaFecha = '';
      this.id_tarjeta = 0;
      this.id_categoria = 0;
    }
  
    this.setOpen(true); 
  }

  editarAhorro(ahorro?: any) {
    if (ahorro) {
      this.isEditing = true; 
      this.selectedAhorro = ahorro; 
      
      this.id_ahorro=ahorro.id_ahorro
      this.nombre = ahorro.nombre;
      this.total = ahorro.total;
      this.Descripcion = ahorro.descripcion;
      this.fecha_limite = ahorro.fecha_limite;
      this.id_tarjeta = ahorro.id_tarjeta;
      this.id_categoria = ahorro.id_categoria;

      console.log(this.fecha_limite)
      console.log(this.id_categoria)
      console.log(ahorro.id_categoria)
      console.log(this.Descripcion)
      console.log(ahorro.descripcion)
      console.log(ahorro.fecha_ingreso)
      this.navController.navigateForward('/modal', {
        queryParams: {
          modalType: 'modalahorro', // Tipo de modal si necesitas diferenciarlo
          id_ahorro: this.id_ahorro,
          nombre: this.nombre,
          total: this.total,
          Descripcion: this.Descripcion,
          fecha_limite: this.fecha_limite,
          id_tarjeta: this.id_tarjeta,
          id_categoria: this.id_categoria,
          editable:this.isEditing
        }
      });
    } else {
      this.isEditing = false;
      this.selectedahorro = null;
  
      this.nombre = '';
      this.total = 0;
      this.Descripcion = '';
      this.fecha_limite = '';
      this.id_tarjeta = 0;
      this.id_categoria = 0;
    }
  
    this.setOpen(true); 
  }
  


  

async  addDinero(){
    const nuevoAhorro = {
      id_ahorro:this.id_ahorro,
      total:this.totalAnadir,
      id_tarjeta:this.id_tarjeta,
      usuario: this.persona.username,
      
      
    };
    console.log(this.persona.username)
    console.log(this.tipo)
    console.log(this.nombre)
    console.log(nuevoAhorro)
    if (!this.id_ahorro ||!this.totalAnadir ||!this.id_tarjeta 
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
   }if (this.totalAnadir > this.tarjetaSeleccionada.cantidad) {
     const alert = await this.alertController.create({
       header: 'Saldo Insuficiente',
       subHeader:`El saldo de su tarjeta: ${this.tarjetaSeleccionada.nombre}`+' Es insuficiente',
       message: `El saldo de su tarjeta es: $${this.tarjetaSeleccionada.cantidad}`,
       buttons: [
         {
           text: 'OK',
           handler: () => {
             // Redirigir o ejecutar lógica adicional si es necesario
           }
         }
       ],
     });
 
     // Muestra la alerta al usuario
     await alert.present();
   }
    this.backendService.uptAhorro(nuevoAhorro).subscribe({
      next: response => {
        console.log('ahorro agregado', response);
        this.setOpen(false)
        this.reloadPage();
      },
      error: err => {
        console.error('Error al agregar ahorro', err);
      }
    });
  }
  

   setOpen(isOpen: boolean) {
    this.isModalAhorroOpen = isOpen;
  }

  toggleContent(id: string) {
    if (this.expandedId === id) {
      this.expandedId = null; 
    } else {
      this.expandedId = id; 
    }
  }
  expandirLista() {
    this.cantidadVisible += 5; 
    // this.mostrarLista = this.deudas.slice(0, this.cantidadVisible); 

    
    if (this.cantidadVisible >= this.deudas.length) {
      this.mostrarTodos = true;
    }
  }

  contraerLista() {
    this.cantidadVisible -= 5; 
    //this.mostrarLista = this.deudas.slice(0, this.cantidadVisible);
  }
  eliminar() {
    this.mostrarEliminarIconos = !this.mostrarEliminarIconos; 
  }
  editarButon() {
    this.mostrarEditarIconos = !this.mostrarEditarIconos; 
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
 
actualizar(){
  
      // Llama al método para agregar un nuevo ahorro
    const nuevaTarjeta = {
      id_ahorro:this.id_ahorro,
      nombre:this.nombre,
      total:this.total,
      descripcion:this.Descripcion,
      fecha:this.fecha,
      id_tarjeta:this.id_tarjeta,
      id_categoria:this.id_categoria,
      usuario: this.persona.username,
      
    };
    console.log(this.persona.username)
    console.log(this.tipo)
    console.log(this.nombre)
    console.log(nuevaTarjeta)
  
    this.backendService.uptAhorro(nuevaTarjeta).subscribe({
      next: response => {
        console.log('ahorro agregado', response);
        this.setOpen(false)
        this.reloadPage();
      },
      error: err => {
        console.error('Error al agregar ahorro', err);
      }
    });
  

}
async loadAhorros() {
  const loading = await this.loadingController.create({
    message: 'Cargando datos...'
  });
  await loading.present();

  console.log(this.persona);

  this.backendService.getAhorros(this.persona).subscribe({
    next: response => {
      if (response.status === 'success') {
       
        this.ahorrosOriginales = response.ahorros;
        this.ahorros = [...this.ahorrosOriginales];  
        console.log('ahorros cargados:', this.ahorros);
        loading.dismiss();
      }
    },
    error: err => {
      console.error('Error al cargar ahorros:', err);
      loading.dismiss();
    }
  });
}
  
  reloadPage(){
    window.location.reload();
  }
}