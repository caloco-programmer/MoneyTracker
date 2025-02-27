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
interface Ingreso {
  id_ingreso: number;
  id_tarjeta: number;  
  total: number;
  descripcion:string;
  tarjeta: string;
  categoria: string;
  nombre: string;
  fecha_ingreso: string;
  tipo_mes:string;
}
interface Gasto {
  id_gasto: number;
  id_tarjeta: number;  
  total: number;
  tarjeta: string;
  categoria: string;
  nombre: string;
  fecha_ingreso: string;
  descripcion:string;
  tipo_mes:string;
}
interface Item {
  monto: string;
  fecha: string;
  cuenta: string;
  nombre: string;
}

interface Deuda{
  id_tarjeta: number;
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
  descripcion:string;
  valor_cuota:number;
  fecha_ingreso:string;
}

interface Prestamo{
  id_tarjeta: number;
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
  fecha_ingreso:string;
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


interface TarjetasInforme{
  nombre:string;
  tipo:string;
  ingresadoMes:number;
  gastadoMes:number;
  ingresoProximo:number;
  gastoProximo:number;
  totalActual:number;
  totalProximo:number;
}

interface GastosInforme{
  nombre:string;
  categoria:string;
  descripcion:string;
  tarjeta:string;
  total:number;
}

interface DeudasInforme{
  nombre:string;
  categoria:string;
  tarjeta:string;
  total:number;
}
@Component({
  selector: 'app-predicciones',
  templateUrl: './predicciones.page.html',
  styleUrls: ['./predicciones.page.scss'],
})

export class PrediccionesPage implements OnInit {
  expandedId: string | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
  gastosOriginales: Gasto[] = [];  
  gastos: Gasto[] = [];
  gastosFiltrados: any[] = [];
  public tarjetas  :[] | any;
  public persona: any; 
  mostrarListaGasto:Gasto[] = [];
  mostrarListaIngreso:Ingreso[] = [];
  mostrarListaAhorro:Ahorro[] = [];
  mostrarListaDeuda:Deuda[] = [];
  mostrarListaPrestamo:Prestamo[] = [];

  tarjetasDebito : []|any;
  ahorrosOriginales: Ahorro[] = [];  
  ahorros : Ahorro[] =[];
  deudasOriginales: Deuda[] = []; 
  deudas: Deuda[] = []; 
  prestamosOriginales: Prestamo[] = [];  
  prestamos: Prestamo[] = [];
  ingresos: Ingreso[] = [];
  ingresosOriginales: Ingreso[] = [];  

  totalDebito: number = 0;
  totalCredito: number = 0;
  totalGastos: number = 0;
  totalIngresos: number = 0;
  totalPrestamos: number = 0;
  totalDeudas: number = 0;
  totalAhorros: number = 0;

  totalIngresado:number=0;
  totalProxIngreso:number=0;
  totalGasto:number=0;
  totalProxGasto:number=0;
  totalMes:number=0;
  totalProximo:number=0;
  tarjeta:any;
  totalTarjeta:number=0;


  cards = [
    { title: 'Card 1', content: 'This is the content of Card 1.' },
    { title: 'Card 2', content: 'This is the content of Card 2.' },
    { title: 'Card 3', content: 'This is the content of Card 3.' },
    { title: 'Card 4', content: 'This is the content of Card 4.' },
    { title: 'Card 5', content: 'This is the content of Card 5.' }
  ];

  

  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,private navController: NavController) {}

    ngOnInit() {
      
      
      this.loadUserData();
      this.loadGastos();
      this.loadAhorros();
      this.loadDeudas();
      this.loadingresos();

      this.loadCard();

      
      
      this.mostrarListaGasto = this.gastos.slice(0, this.cantidadVisible);
      this.mostrarListaIngreso = this.ingresos.slice(0, this.cantidadVisible);
      this.mostrarListaDeuda = this.deudas.slice(0, this.cantidadVisible);
      this.mostrarListaPrestamo = this.prestamos.slice(0, this.cantidadVisible);
      this.mostrarListaAhorro= this.ahorros.slice(0, this.cantidadVisible);
     

      
      this.getSelectedCurrency();
    }
    getSelectedCurrency() {
      return localStorage.getItem('selectedCurrency') || 'CLP'; // Devuelve 'CLP' por defecto si no hay moneda almacenada
    }
    swiperSlideChanged(event: any) {
      console.log('changed: ', event);
      console.log(event)
    }

    onOptionChange(event: { detail: { value: any; }; }) {
      const option = event.detail.value;
      console.log(option);
      // Navegar a la página "modal" con el valor seleccionado
      this.navController.navigateForward('/modal', {
        
        queryParams: { modalType: option },
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
    


    calcularTotales(idTarjeta: number) {
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth();
      const anioActual = fechaActual.getFullYear();
    
      // Total de tarjetas de débito
      this.totalDebito = this.tarjetas
        .filter((tarjeta: any) =>
          tarjeta.tipo_tarjeta === 'debito' &&
          tarjeta.id_tarjeta === idTarjeta 
        )
        .reduce((sum: number, tarjeta: any) => sum + Number(tarjeta.cantidad), 0);
    
      // Total de tarjetas de crédito
      this.totalCredito = this.tarjetas
        .filter((tarjeta: any) =>
          tarjeta.tipo_tarjeta === 'credito' &&
          tarjeta.id_tarjeta === idTarjeta &&
          new Date(tarjeta.fecha_ingreso).getMonth() === mesActual &&
          new Date(tarjeta.fecha_ingreso).getFullYear() === anioActual
        )
        .reduce((sum: number, tarjeta: any) => sum + Number(tarjeta.cantidad), 0);
      
      return this.totalDebito;
    }
    
    calcularTotalGastos(idTarjeta: number) {
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth();
      const anioActual = fechaActual.getFullYear();
    
      this.totalGastos = this.gastosOriginales
        .filter((gasto: Gasto) =>
          gasto.id_tarjeta === idTarjeta &&
          new Date(gasto.fecha_ingreso).getMonth() === mesActual &&
          new Date(gasto.fecha_ingreso).getFullYear() === anioActual
        )
        .reduce((sum: number, gasto: Gasto) => sum + gasto.total, 0);
        
        this.totalGasto = this.gastos
        .filter((gasto: Gasto) =>
          gasto.id_tarjeta === idTarjeta 
        )
        .reduce((sum: number, gasto: Gasto) => sum + gasto.total, 0);
        
      return this.totalGastos;

    }
    
    calcularTotalIngresos(idTarjeta: number) {
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth();
      const anioActual = fechaActual.getFullYear();
    
      this.totalIngresos = this.ingresosOriginales
        .filter((ingreso: Ingreso) =>
          ingreso.id_tarjeta === idTarjeta &&
          new Date(ingreso.fecha_ingreso).getMonth() === mesActual &&
          new Date(ingreso.fecha_ingreso).getFullYear() === anioActual
        )
        .reduce((sum: number, ingreso: Ingreso) => sum + ingreso.total, 0);
        
      return this.totalIngresos;
      

    }

    
    calcularTotalDeudas(idTarjeta: number) {
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth();
      const anioActual = fechaActual.getFullYear();
    
      this.totalDeudas = this.deudasOriginales
        .filter((deuda: Deuda) =>
          deuda.id_tarjeta === idTarjeta &&
          new Date(deuda.fecha_ingreso).getMonth() === mesActual &&
          new Date(deuda.fecha_ingreso).getFullYear() === anioActual
        )
        .reduce((sum: number, deuda: Deuda) => sum + deuda.valor_cuota, 0);
        console.log(this.totalDeudas)

        this.totalProxGasto = this.deudas
        .filter((deuda: Deuda) =>
          deuda.id_tarjeta === idTarjeta 
        )
        .reduce((sum: number, deuda: Deuda) => sum + deuda.valor_cuota, 0);
       
        
       
      return this.totalDeudas;

    }
    
    calcularTotalAhorros(idTarjeta: number) {
      const fechaActual = new Date();
      const mesActual = fechaActual.getMonth();
      const anioActual = fechaActual.getFullYear();
    
      this.totalAhorros = this.ahorrosOriginales
        .filter((ahorro: Ahorro) =>
          ahorro.id_tarjeta === idTarjeta &&
          new Date(ahorro.fecha_ingreso).getMonth() === mesActual &&
          new Date(ahorro.fecha_ingreso).getFullYear() === anioActual
        )
        .reduce((sum: number, ahorro: Ahorro) => sum + ahorro.total, 0);
      return this.totalAhorros;
    
      
        
    }        
    
    async loadingresos() {
      // Crear y presentar el loading spinner
      const loading = await this.loadingController.create({
        message: 'Cargando datos...'
      });
      await loading.present();
    
      // Realizar la solicitud al backend
      this.backendService.getIngresos(this.persona).subscribe({
        next: response => {
          if (response.status === 'success') {
            // Filtrar los ingresos mensuales
            this.ingresosOriginales = response.ingresos;
            this.ingresos = response.ingresos.filter((ingreso: { tipo_mes: string }) => ingreso.tipo_mes === 'Mensual');
            this.totalProxIngreso = this.ingresos.reduce((sum: number, ingreso: Ingreso) => sum + ingreso.total, 0);
            console.log('totalIngresos',this.totalProxIngreso);
            
            console.log('Ingresos cargados:', this.ingresos);
            
            // Calcular total de ingresos
          }
        },
        error: err => {
          console.error('Error al cargar ingresos:', err);
        },
        // Siempre hacer dismiss del loading cuando se haya completado la solicitud (éxito o error)
        complete: () => {
          loading.dismiss();
        }
      });
    }
    

    async loadDeudas() {
      const loading = await this.loadingController.create({
        message: 'Cargando datos...'
      });
      await loading.present();
    
      console.log(this.persona);
    
      this.backendService.getDeudas(this.persona).subscribe({
        next: response => {
          if (response.status === 'success') {
           
            this.deudasOriginales = response.deudas;
            this.deudas = [...this.deudasOriginales];  
            console.log('deudas cargados:', this.deudas);
            loading.dismiss();
            
          }
        },
        error: err => {
          console.error('Error al cargar deudas:', err);
          loading.dismiss();
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
            this.ahorros = response.ahorros.filter((ahorro:{tipo:string}) => ahorro.tipo === 'Automatico');  
            this.totalProxIngreso = this.ingresos.reduce((sum: number, ingreso: Ingreso) => sum + ingreso.total, 0);
            
           
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
    async loadCard() {
      const loading = await this.loadingController.create({
        message: 'Cargando datos.....'
      });
      await loading.present();
      console.log(this.persona);
    
      await this.backendService.getCards(this.persona).subscribe({
        next: response => {
          if (response.status === 'success') {
            this.tarjetas = response.tarjetas;
            console.log('tarjetas cargadas:', this.tarjetas);
            loading.dismiss();
    
            // Filtrar las tarjetas de débito
            const tarjetasDebito = response.tarjetas.filter((tarjeta: { tipo_tarjeta: string; }) => tarjeta.tipo_tarjeta === 'debito');
            this.tarjetasDebito = tarjetasDebito;
            console.log('Tarjetas débito:', this.tarjetasDebito);

    
            this.tarjetasDebito.forEach((tarjeta: { id_tarjeta: number; }) => {
              this.calcularTotales(tarjeta.id_tarjeta);
              this.calcularTotalGastos(tarjeta.id_tarjeta);
              this.calcularTotalAhorros(tarjeta.id_tarjeta);
              this.calcularTotalIngresos(tarjeta.id_tarjeta);
              this.calcularTotalDeudas(tarjeta.id_tarjeta);
            });
            this.totalGasto = this.totalGasto + this.totalProxGasto;
            console.log(this.totalGasto);
            console.log(this.totalProxIngreso);
            this.totalTarjeta = this.totalDebito - this.totalGasto + this.totalProxIngreso;
            console.log('proxMes',this.totalTarjeta);

            
          }
          
        },
        error: err => {
          console.error('Error al cargar tarjetas:', err);
          loading.dismiss();
        }
      });
    }
    async loadGastos() {
      // Crear y presentar el loading spinner
      const loading = await this.loadingController.create({
        message: 'Cargando datos...'
      });
      await loading.present();
    
      console.log(this.persona);
    
      // Realizar la solicitud de gastos
      this.backendService.getGastos(this.persona).subscribe({
        next: response => {
          if (response.status === 'success') {
            // Filtrar las tarjetas de tipo 'debito' (y guardar el resultado)
            
            // Si quieres hacer algo con las tarjetas de débito filtradas, puedes usar la variable tarjetasDebito
    
            // Filtrar los gastos mensuales
            this.gastosOriginales = response.gastos;
            this.gastos = response.gastos.filter((gasto: { tipo_mes: string }) => gasto.tipo_mes === 'Mensual');
            
            console.log('Gastos cargados:', this.gastos);
            console.log(this.gastosOriginales);
    
            // Calcular total de gastos después de cargar
          }
        },
        error: err => {
          console.error('Error al cargar gastos:', err);
        },
        // Cerrar el loading spinner al completar la solicitud
        complete: () => {
          loading.dismiss();
        }
      });
    }
    

    reloadPage(){
      window.location.reload();
    }

    loadUserData() {
      this.persona = this.sesionService.getUser();
      
     
       
    }

    toggleContent(id: string) {
      if (this.expandedId === id) {
        this.expandedId = null; 
      } else {
        this.expandedId = id; 
      }
    }
    expandirLista(dato:any) {


      if(dato == 'gasto'){
        this.cantidadVisible += 5; 
        this.mostrarListaGasto = this.gastos.slice(0, this.cantidadVisible); 
    
        
        if (this.cantidadVisible >= this.gastos.length) {
          this.mostrarTodos = true;
        }
      }if(dato == 'ingreso'){
        this.cantidadVisible += 5; 
        this.mostrarListaIngreso = this.ingresos.slice(0, this.cantidadVisible); 
    
        
        if (this.cantidadVisible >= this.ingresos.length) {
          this.mostrarTodos = true;
        }
      }if(dato == 'deuda'){
        this.cantidadVisible += 5; 
        this.mostrarListaDeuda = this.deudas.slice(0, this.cantidadVisible); 
    
        
        if (this.cantidadVisible >= this.deudas.length) {
          this.mostrarTodos = true;
        }
      }if(dato == 'ahorro'){
        this.cantidadVisible += 5; 
        this.mostrarListaAhorro = this.ahorros.slice(0, this.cantidadVisible); 
    
        
        if (this.cantidadVisible >= this.ahorros.length) {
          this.mostrarTodos = true;
        }
      }if(dato == 'prestamo'){
        this.cantidadVisible += 5; 
        this.mostrarListaPrestamo = this.prestamos.slice(0, this.cantidadVisible); 
    
        
        if (this.cantidadVisible >= this.prestamos.length) {
          this.mostrarTodos = true;
        }
      }
      
    }
  
    contraerLista() {
      this.cantidadVisible -= 5; // Reduce la cantidad visible
      if (this.cantidadVisible <= 5) {
        this.cantidadVisible = 5; // Asegúrate de no mostrar menos de 5
        this.mostrarTodos = false; // Indica que no se está mostrando todo
      } else {
        this.mostrarTodos = true; // Si hay más de 5, solo cambia el flag
      }
    }
  
}
