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

interface Ingreso {
  id_ingreso: number;
  id_tarjeta: number;  
  total: number;
  tarjeta: string;
  categoria: string;
  nombre: string;
  fecha_ingreso: string;
  descripcion:string;
  tipo_mes:string;
}

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.page.html',
  styleUrls: ['./ingresos.page.scss'],
})
export class IngresosPage implements OnInit {
 
  expandedId: string | null = null;
  mostrarEliminarIconos: boolean = false; 
  mostrarEditarIconos: boolean = false; 
  isEditing:boolean = false;
  showSelect: boolean = false;
  isModalOpen = false;
  presentingElement: HTMLElement | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
  selectedChartType: ChartType = 'bar';  
  chart: any; 
  fecha: Boolean = false;
  cantidadCuota:Boolean = false;
  id_tarjeta: number |any;
  id_tarjeta_pagar: number =0;

  id_categoria: number|any;
  fecha_compra:string ='';
  Descripcion:string = '';
  total: number=0;
  public friends: []|any;
  total_alcanzar:number=0;
  fecha_limite:string ='';
  ingresosOriginales: Ingreso[] = [];  
  id_ingreso:number=0;
  
  ingresos: Ingreso[] = [];
  ingresosFiltrados: any[] = [];
  public tarjetas  :[] | any;
  public persona: any; 
  nombre: string = '';
  tipo: string = '';
  cantidad: number|any;
  tarjetaVista:boolean = false;
  
  selectedOption: string | undefined;
  isModal1Open = false;
  isModal2Open = false;
  isModal3Open = false;
  mostrarIngreso:Boolean = true;
  isModalIngresoOpen = false;
  isModalIngresoMensualOpen = false;
  isModalIngresoCuotaOpen = false;
  isModalAhorroOpen = false;
  isModalAhorroMensualOpen = false;
  isModalPrestamoOpen = false;
  public categorias  :[] | any;
  cantidadCuotas: Number |any;
  mostrarLista:Ingreso[] = [];
  selectedingreso: any;
  totalCuotas:number =0;
  valorCuota:number=0;
  option:Boolean = false;
  tarjetasDebito : []|any;
  cantidadCuotasPagadas:Number|any;
  total_pagar:Number|any;
  nuevoAhorro:boolean = false;
  existente:boolean = false;
  public friend: [] | any;
  friend_username:string ='';
  correo:string ='';
  fechaLimite:boolean=false;
  total_pagado:number|any;
  totalIngresos: number = 0;
  fecha_vencimiento: string='';
  todos:string='';
  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,private navController: NavController) {}


    
  ngOnInit() {
    this.presentingElement = document.getElementById('main-content');
    this.presentingElement = document.querySelector('.ion-page');
    this.loadChart();
    this.loadUserData();
    this.loadCard();
    this.loadCategoria();
    this.loadIngresos();
    
    this.cargarFriend();
    this.mostrarLista = this.ingresos.slice(0, this.cantidadVisible);

    this.getSelectedCurrency();
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

    // Verificar si hay un ingreso seleccionado y pasar los datos correspondientes
    
      // Si no hay un ingreso seleccionado, puedes navegar sin pasar estos datos
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

  

  calcularTotalIngresos() {
    this.totalIngresos = this.ingresos.reduce((sum: number, ingreso: Ingreso) => sum + ingreso.total, 0);
    console.log(this.totalIngresos)
  }

  onTipoChange(event: any) {
    console.log(event.detail.value)
    const tarjetaSeleccionada = this.tarjetas.find((tarjeta: { id_tarjeta: any; }) => tarjeta.id_tarjeta === event.detail.value);
    console.log(tarjetaSeleccionada)
    // Si la tarjeta seleccionada es de crédito, mostramos el input de cuotas
    if (tarjetaSeleccionada && tarjetaSeleccionada.tipo_tarjeta === 'credito') {
      this.tarjetaVista = true;
    } else {
      this.tarjetaVista = false;
    }
  }
  
  onTipoChanges(event: any) {
    if (event.detail.value === 'hoy') {
      const today = new Date();
      this.fecha_compra = today.toISOString().split('T')[0]; 
       // Formato: YYYY-MM-DD
    } else if (event.detail.value === 'personalizado') {
      this.fecha = true; // Muestra el campo de fecha personalizado
    }
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

  onFriendSelect() {
    // Encontrar el amigo seleccionado usando el valor de id_categoria
    const selectedFriend = this.friends.find((friend: { username: string; }) => friend.username === this.friend_username);

    // Si se encuentra un amigo, asignar su correo a la variable nombre
    if (selectedFriend) {
      this.correo = selectedFriend.correo;
    }
  }
  onTipoChang(event: any) {
    if (event.detail.value === 'nuevo') {
      this.nuevoAhorro = true;
      this.existente = false; 

       
    } else if (event.detail.value === 'existente') {
      this.existente = true; 
      this.nuevoAhorro=false;
    }
  }
  onCuotasChange(event: any) {
    this.option=true;


    this.totalCuotas = this.cantidadCuotas * this.valorCuota;
    console.log(this.totalCuotas);

    
  }
  actualizarCredito(){

  }

  mostrar2() {
    this.showSelect = true; // Esto hará que el select sea visible después de presionar el botón
  }

  
  

  // Método para cerrar todos los modales
  closeAllModals() {
    this.isModal1Open = false;
    this.isModalIngresoOpen = false;
    this.isModalIngresoMensualOpen = false;

    this.isModal2Open = false;
    this.isModal3Open = false;
    
  }

  // Método para cerrar un modal específico
  closeModal(modal: { dismiss: () => void; }) {
    modal.dismiss();
    this.reloadPage();
  }

  addDeuda() {
   

      console.log('Fecha de compra:', this.fecha_compra);
  
      // Si la fecha de compra está vacía, asigna 'hoy' como valor por defecto
      if (this.fecha_compra === '') {
        this.fecha_compra = 'hoy';
      }
      console.log(this.fecha_compra)
      // Llama al método para agregar una nueva deuda
      const nuevaDeuda = {
        username: this.persona.username,
        id_categoria: this.id_categoria,
        id_tarjeta: this.id_tarjeta_pagar,
        id_credito: this.id_tarjeta,
        descripcion: this.Descripcion,
        nombre: this.nombre,
        total: this.totalCuotas,
        cuotas_pagadas: this.cantidadCuotasPagadas,
        cuotas: this.cantidadCuotas,
        fecha_compra: this.fecha_compra,
        valorCuota: this.valorCuota
      };
  
      console.log('Nueva deuda:', nuevaDeuda);
  
      this.backendService.addDeuda(nuevaDeuda).subscribe({
        next: response => {
          console.log('Deuda agregada', response);
          this.setOpen(false);
          this.reloadPage();
        },
        error: err => {
          console.error('Error al agregar la deuda', err);
        }
      });
    
  }
  async loadIngresos() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    await loading.present();
  
    console.log(this.persona);
  
    this.backendService.getIngresos(this.persona).subscribe({
      next: response => {
        if (response.status === 'success') {
         
          this.ingresosOriginales = response.ingresos;
          this.ingresos = [...this.ingresosOriginales];  
          console.log('ingresos cargados:', this.ingresos);
          loading.dismiss();
          this.calcularTotalIngresos();
          this.loadChart();
        }
      },
      error: err => {
        console.error('Error al cargar ingresos:', err);
        loading.dismiss();
      }
    });
  }
  
  
  filtrarIngresos(event:any) {
    if (typeof event.detail.value === 'number') {
      console.log(this.ingresosOriginales)
      console.log(this.id_tarjeta)
      console.log('todos',this.todos)
      this.ingresosOriginales.forEach(ingreso => {
        console.log('ID de tarjeta del ingreso:', ingreso.id_tarjeta);
      });
     
      this.ingresos = this.ingresosOriginales.filter(ingreso => ingreso.id_tarjeta === event.detail.value);
      console.log(this.ingresos)
    }else{
      
      this.ingresos = [...this.ingresosOriginales];
    }
    this.loadChart(); 
    console.log('ingresos filtrados',this.ingresos)

  }
  async eliminar_ingreso(id_categoria: number){
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    console.log(id_categoria);
    
    await loading.present();
    
    console.log(this.persona);
    await this.backendService.delete_ingreso(id_categoria).subscribe({
      next: response => {
        if (response.status === 'success') {
          
          this.ingresos = response.ingresos;  
          console.log('ingresos cargadas:', this.ingresos);
          loading.dismiss();
          this.reloadPage();
        }
      },
      error: err => {
        console.error('Error al cargar ingresos:', err);
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
            console.log('tarjteas debito',this.tarjetasDebito);

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

   editar(ingreso?: any) {
    if (ingreso) {
      this.isEditing = true; 
      this.selectedingreso = ingreso; 
      
      this.id_ingreso=ingreso.id_ingreso
      this.nombre = ingreso.nombre;
      this.total = ingreso.total;
      this.Descripcion = ingreso.descripcion;
      this.fecha_vencimiento = ingreso.fecha_vencimiento;
      this.id_tarjeta = ingreso.id_tarjeta;
      this.id_categoria = ingreso.id_categoria;

      console.log(this.fecha_vencimiento)
      console.log(this.id_categoria)
      console.log(ingreso.id_categoria)
      console.log(this.Descripcion)
      console.log(ingreso.descripcion)
      console.log(ingreso.fecha_ingreso)
      this.navController.navigateForward('/modal', {
        queryParams: {
          modalType: 'modalIngreso', // Tipo de modal si necesitas diferenciarlo
          id_gasto: this.id_ingreso,
          nombre: this.nombre,
          total: this.total,
          Descripcion: this.Descripcion,
          fecha_vencimiento: this.fecha_vencimiento,
          id_tarjeta: this.id_tarjeta,
          id_categoria: this.id_categoria,
          editable:this.isEditing,
          metodo:'ingreso'
        }
      });
    } else {
      this.isEditing = false;
      this.selectedingreso = null;
  
      this.nombre = '';
      this.total = 0;
      this.Descripcion = '';
      this.fecha_vencimiento = '';
      this.id_tarjeta = 0;
      this.id_categoria = 0;
    }
  
    this.setOpen(true); 
  }
  


   setOpen(isOpen: boolean) {
    this.isModalIngresoOpen = isOpen;
  }

  

  toggleContent(id: string) {
    if (this.expandedId === id) {
      this.expandedId = null; 
    } else {
      this.expandedId = id; 
    }
  }
  expandirLista() {
    this.cantidadVisible += 5; // Incrementa de 5 en 5
    if (this.cantidadVisible >= this.ingresos.length) {
      this.cantidadVisible = this.ingresos.length; // Asegúrate de no exceder el total
      this.mostrarTodos = true; // Flag para "Mostrar menos"
      this.mostrarIngreso = false; // Oculta "Mostrar más"
    }
  }
  
  contraerLista() {
    this.cantidadVisible -= 5; // Reduce de 5 en 5
    if (this.cantidadVisible <= 5) {
      this.cantidadVisible = 5; // Asegúrate de no mostrar menos de 5
      this.mostrarTodos = false; // Flag para "Mostrar menos"
      this.mostrarIngreso = true; // Muestra "Mostrar más"
    } else {
      this.mostrarTodos = false; // Si hay más de 5 visibles, "Mostrar menos" no se activa
      this.mostrarIngreso = true; // Sigue mostrando "Mostrar más"
    }
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


  loadChart() {
    const ctx = document.getElementById('ingresos') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico existente para evitar duplicados
    }

    // Obtener nombres y montos de los ingresos visibles
    const labels = this.ingresos.map(ingreso => ingreso.nombre);
    const data = this.ingresos.map(ingreso => ingreso.total);

    this.chart = new Chart(ctx, {
      type: this.selectedChartType, // Usa el tipo de gráfico seleccionado (puede ser 'bar', 'line', etc.)
      data: {
        labels: labels, // Usa los nombres como etiquetas
        datasets: [{
          label: 'ingresos',
          data: data, // Usa los montos como datos
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Método para actualizar el gráfico cuando el usuario selecciona un nuevo tipo
  updateChart() {
    this.loadChart();  // Vuelve a cargar el gráfico con el nuevo tipo
  }
actualizar(){
  
      // Llama al método para agregar un nuevo ingreso
    const nuevaTarjeta = {
      id_ingreso:this.id_ingreso,
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
  
    this.backendService.uptIngreso(nuevaTarjeta).subscribe({
      next: response => {
        console.log('ingreso agregado', response);
        this.setOpen(false)
        this.reloadPage();
      },
      error: err => {
        console.error('Error al agregar ingreso', err);
      }
    });
  

}


  addIngreso(tipo:string){
            // Llama al método para agregar un nuevo ingreso
      
      const nuevaTarjeta = {
        nombre:this.nombre,
        total:this.total,
        descripcion:this.Descripcion,
        fecha:this.fecha_compra,
        id_tarjeta:this.id_tarjeta,
        id_categoria:this.id_categoria,
        usuario: this.persona.username,
        tipo:tipo,
        
      };
      console.log(this.persona.username)
      console.log(this.tipo)
      console.log(this.nombre)
      console.log(nuevaTarjeta)
    
      this.backendService.addIngreso(nuevaTarjeta).subscribe({
        next: response => {
          console.log('ingreso agregado', response);
          this.setOpen(false)
          this.loadIngresos();
        },
        error: err => {
          console.error('Error al agregar ingreso', err);
        }
      });
    
  }

  reloadPage(){
    window.location.reload();
  }
}
