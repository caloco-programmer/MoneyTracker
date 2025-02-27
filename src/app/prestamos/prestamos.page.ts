import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../services/sesion.service';
import { Router } from '@angular/router';


interface Item {
  monto: string;
  fecha: string;
  cuenta: string;
  nombre: string;
}

interface Gasto {
  id_gasto: number;
  id_tarjeta: number;  
  total: number;
  tarjeta: string;
  categoria: string;
  nombre: string;
  fecha_ingreso: string;
}

interface Prestamo{
  id_prestamo:number;
  tarjeta:string;
  categoria:string;
  user_prestamo:string;
  correo_prestamo:string;
  user_friend:string;
  nombre:string;
  total:number;
  descripcion:string;
  total_pagado:number;
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

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.page.html',
  styleUrls: ['./prestamos.page.scss'],
})
export class PrestamosPage implements OnInit {
  
  expandedId: string | null = null;
  mostrarEliminarIconos: boolean = false; 
  mostrarEditarIconos: boolean = false; 
  isEditing:boolean = false;
  isModalprestamoOpen = false;

  isModalOpen = false;
  presentingElement: HTMLElement | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
  selectedChartType: ChartType = 'bar';  
  chart: any; 
  fecha_compra: Boolean = false;
  cantidadCuota:Boolean = false;
  id_tarjeta: number =0;
  id_tarjeta_pagar: number =0;
  id_prestamo:number=0;
  id_categoria: number=0;
  fecha:string ='';
  Descripcion:string = '';
  total: number=0;
   
  prestamosOriginales: Prestamo[] = [];  
  id_gasto:number=0;
  
  
  prestamosFiltrados: any[] = [];
  public tarjetas  :[] | any;
  public persona: any; 
  nombre: string = '';
  tipo: string = '';
  cantidad: any;
  tarjetaVista:boolean = false;
 
  public categorias  :[] | any;
  cantidadCuotas: Number |any;
  mostrarLista:Gasto[] = [];
  selectedGasto: any;
  totalCuotas:number =0;
  valorCuota:number=0;
  option:Boolean = false;
  tarjetasDebito : []|any;
  prestamos: Prestamo[] = [];
  selectedprestamo: any;
  totalAnadir:number|any;
  
  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    this.presentingElement = document.getElementById('main-content');
    this.presentingElement = document.querySelector('.ion-page');
    
    this.loadUserData();
    this.loadCard();
    this.loadprestamos();
    
    // this.mostrarLista = this.prestamos.slice(0, this.cantidadVisible);


    this.getSelectedCurrency();
  }
  getSelectedCurrency() {
    return localStorage.getItem('selectedCurrency') || 'CLP'; // Devuelve 'CLP' por defecto si no hay moneda almacenada
  }
  async loadprestamos() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    await loading.present();
  
    console.log(this.persona);
  
    this.backendService.getPrestamos(this.persona).subscribe({
      next: response => {
        if (response.status === 'success') {
         
          this.prestamosOriginales = response.prestamos;
          this.prestamos = [...this.prestamosOriginales];  
          console.log('prestamos cargados:', this.prestamos);
          loading.dismiss();
          this.loadChart();
        }
      },
      error: err => {
        console.error('Error al cargar prestamos:', err);
        loading.dismiss();
      }
    });
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
  
  filtrarGastos(){

  }
  
  // filtrarprestamos() {
  //   if (this.id_tarjeta) {
  //     console.log(this.prestamosOriginales)
  //     console.log(this.id_tarjeta)
  //     this.prestamosOriginales.forEach(gasto => {
  //       console.log('ID de tarjeta del gasto:', gasto.id_tarjeta);
  //     });
     
  //     this.prestamos = this.prestamosOriginales.filter(gasto => gasto.id_tarjeta === this.id_tarjeta);
  //     console.log(this.prestamos)
  //   } else {
      
  //     this.prestamos = [...this.prestamosOriginales];
  //   }
  //   this.loadChart(); 
  // }
  async eliminar_gasto(id_categoria: number){
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    console.log(id_categoria);
    
    await loading.present();
    
    console.log(this.persona);
    await this.backendService.delete_gasto(id_categoria).subscribe({
      next: response => {
        if (response.status === 'success') {
          
          this.prestamos = response.prestamos;  
          console.log('prestamos cargadas:', this.prestamos);
          loading.dismiss();
          this.reloadPage();
        }
      },
      error: err => {
        console.error('Error al cargar prestamos:', err);
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
   editar(prestamo?: any) {
    if (prestamo) {
      this.isEditing = true; 
      this.selectedprestamo = prestamo; 
      
      this.id_prestamo=prestamo.id_prestamo
      this.nombre = prestamo.nombre;
      this.total = prestamo.total;
      this.Descripcion = prestamo.descripcion;
      
      this.id_tarjeta = prestamo.id_tarjeta;
      this.id_categoria = prestamo.id_categoria;

      
      console.log(this.id_categoria)
      console.log(prestamo.id_categoria)
      console.log(this.Descripcion)
      console.log(prestamo.descripcion)
      console.log(prestamo.fecha_ingreso)
    } else {
     
      this.isEditing = false; 
      this.selectedprestamo = null;
     
      this.nombre = '';
      this.total = 0;
      this.Descripcion = '';
      
      this.id_tarjeta = 0;
      this.id_categoria = 0;
    }
  
    this.setOpen(true); 
  }

  addDinero(){
    const nuevoprestamo = {
      id_prestamo:this.id_prestamo,
      total:this.totalAnadir,
      id_tarjeta:this.id_tarjeta,
      usuario: this.persona.username,
      
      
    };
    console.log(this.persona.username)
    console.log(this.tipo)
    console.log(this.nombre)
    console.log(nuevoprestamo)
  
    this.backendService.uptPrestamo(nuevoprestamo).subscribe({
      next: response => {
        console.log('prestamo agregado', response);
        this.setOpen(false)
        this.reloadPage();
      },
      error: err => {
        console.error('Error al agregar gasto', err);
      }
    });
  }
  

   setOpen(isOpen: boolean) {
    this.isModalprestamoOpen = isOpen;
  }
  closeModal(modal: { dismiss: () => void; }) {
    modal.dismiss();
    this.reloadPage();
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
    // this.mostrarLista = this.prestamos.slice(0, this.cantidadVisible); 

    
    if (this.cantidadVisible >= this.prestamos.length) {
      this.mostrarTodos = true;
    }
  }

  contraerLista() {
    this.cantidadVisible -= 5; 
    //this.mostrarLista = this.prestamos.slice(0, this.cantidadVisible);
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
    const ctx = document.getElementById('prestamos') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico existente para evitar duplicados
    }

    // Obtener nombres y montos de los prestamos visibles
    const labels = this.prestamos.map(gasto => gasto.nombre);
    const data = this.prestamos.map(gasto => gasto.total);

    this.chart = new Chart(ctx, {
      type: this.selectedChartType, // Usa el tipo de gráfico seleccionado (puede ser 'bar', 'line', etc.)
      data: {
        labels: labels, // Usa los nombres como etiquetas
        datasets: [{
          label: 'prestamos',
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
  
      // Llama al método para agregar un nuevo gasto
    const nuevaTarjeta = {
      id_gasto:this.id_gasto,
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
  
    this.backendService.uptGasto(nuevaTarjeta).subscribe({
      next: response => {
        console.log('Gasto agregado', response);
        this.setOpen(false)
        this.reloadPage();
      },
      error: err => {
        console.error('Error al agregar gasto', err);
      }
    });
  

}

  addGasto(){
    if (this.isEditing) {
      this.actualizar(); // Llama al método para actualizar el gasto
    } else {
        // Llama al método para agregar un nuevo gasto
      const nuevaTarjeta = {
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
    
      this.backendService.addGasto(nuevaTarjeta).subscribe({
        next: response => {
          console.log('Gasto agregado', response);
          this.setOpen(false)
          this.reloadPage();
        },
        error: err => {
          console.error('Error al agregar gasto', err);
        }
      });
    }
  }

  reloadPage(){
    window.location.reload();
  }
}
