import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../services/sesion.service';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { NavController } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';
//import {AdmobAds} from 'capacitor-admob-ads';

interface Ingreso {
  id_ingreso: number;
  id_tarjeta: number;  
  total: number;
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
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})

export class IndexPage implements OnInit {
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
  private intervalId: any;
  cards = [
    { title: 'Card 1', content: 'This is the content of Card 1.' },
    { title: 'Card 2', content: 'This is the content of Card 2.' },
    { title: 'Card 3', content: 'This is the content of Card 3.' },
    { title: 'Card 4', content: 'This is the content of Card 4.' },
    { title: 'Card 5', content: 'This is the content of Card 5.' }
  ];
  totalPrestamos2: number|any;

  

  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,private navController: NavController,
    public toastCtrl: ToastController
   ) {}

    ngOnInit() {
      this.loadUserData();
      if(this.persona){
        this.loadCard();
        this.loadGastos();
        this.loadAhorros();
        this.loadDeudas();
        this.loadprestamos();
        this.loadingresos();
        
        
        this.mostrarListaGasto = this.gastos.slice(0, this.cantidadVisible);
        this.mostrarListaIngreso = this.ingresos.slice(0, this.cantidadVisible);
        this.mostrarListaDeuda = this.deudas.slice(0, this.cantidadVisible);
        this.mostrarListaPrestamo = this.prestamos.slice(0, this.cantidadVisible);
        this.mostrarListaAhorro= this.ahorros.slice(0, this.cantidadVisible);
       
  
    
    
        this.getSelectedCurrency();
  
      }
      
          }
    getSelectedCurrency() {
      return localStorage.getItem('selectedCurrency') || 'CLP'; // Devuelve 'CLP' por defecto si no hay moneda almacenada
    }

    async presentToast(message:string){
      const toast = await this.toastCtrl.create({
        message: message,
        duration:2000,
        mode:'ios',
        position:'top',
        color:'success',
      });
      toast.present();
    }
// ca-app-pub-3940256099942544/1033173712
    // loadInterstitialAd(){
    //   AdmobAds.loadInterstitialAd({
    //     adId: 'ca-app-pub-3940256099942544/1033173712',
    //     isTesting:true,
    //   })
    //     .then(()=>{
    //       this.presentToast('Rewared Interstitial Ad loaded');
    //     })
    //     .catch((err)=>{
    //       this.presentToast(err.message);
    //     })
    // }
    // showInterstitialAd(){
    //   AdmobAds.showRewardedInterstitialAd().then(()=>{
    //     this.presentToast('Rewared Interstitial Ad showed')
    //   }) .catch((err)=>{
    //     this.presentToast(err.message);
    //   })

    // }

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

    calcularTotales() {
      // Total de tarjetas de débito
      this.totalDebito = this.tarjetas
        .filter((tarjeta: any) => tarjeta.tipo_tarjeta === 'debito')
        .reduce((sum: number, tarjeta: any) => sum + Number(tarjeta.cantidad), 0);
    
      // Total de tarjetas de crédito
      this.totalCredito = this.tarjetas
        .filter((tarjeta: any) => tarjeta.tipo_tarjeta === 'credito')
        .reduce((sum: number, tarjeta: any) => sum + Number(tarjeta.cantidad), 0);
    }
    calcularTotalGastos() {
      this.totalGastos = this.gastos.reduce((sum: number, gasto: Gasto) => sum + gasto.total, 0);
    }
    calcularTotalIngresos() {
      this.totalIngresos = this.ingresos.reduce((sum: number, ingreso: Ingreso) => sum + ingreso.total, 0);
    }
    calcularTotalPrestamos() {
      this.totalPrestamos = this.prestamos
      .filter(prestamo => prestamo.user_friend === this.persona.username)
      .reduce((total, prestamo) => total + prestamo.total, 0);
      this.totalDeudas = this.totalDeudas + this.totalPrestamos;

    }
    calcularTotalPrestamos2() {
      this.totalPrestamos2 = this.prestamos
      .filter(prestamo => prestamo.user_prestamo === this.persona.username)
      .reduce((total, prestamo) => total + prestamo.total, 0);
    }
    calcularTotalDeudas() {
      this.totalDeudas = this.deudas.reduce((sum: number, deuda: Deuda) => sum + deuda.total, 0);
      this.totalDeudas = this.totalDeudas + this.totalPrestamos;
    }
    calcularTotalAhorros() {
      this.totalAhorros = this.ahorros.reduce((sum: number, ahorro: Ahorro) => sum + ahorro.total, 0);
    }
    
                    
    
    async loadingresos() {
      const loading = await this.loadingController.create({
        message: 'Cargando datos...'
      });
      await loading.present();
      loading.dismiss();
      console.log(this.persona);
    
      this.backendService.getIngresos(this.persona).subscribe({
        next: response => {
          if (response.status === 'success') {
           
            this.ingresosOriginales = response.ingresos;
            this.ingresos = [...this.ingresosOriginales];  
            console.log('ingresos cargados:', this.ingresos);
            loading.dismiss();
            this.calcularTotalIngresos();
            
            
          }
        },
        error: err => {
          console.error('Error al cargar ingresos:', err);
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
            this.calcularTotalDeudas();
            
          }
        },
        error: err => {
          console.error('Error al cargar deudas:', err);
          loading.dismiss();
        }
      });
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
            this.calcularTotalPrestamos();
            this.calcularTotalPrestamos2();
          }
        },
        error: err => {
          console.error('Error al cargar prestamos:', err);
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
            this.ahorros = [...this.ahorrosOriginales];  
            console.log('ahorros cargados:', this.ahorros);
            loading.dismiss();
            this.calcularTotalAhorros();
            
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
    
            // Llamar a calcularTotales después de cargar las tarjetas
            this.calcularTotales();
          }
        },
        error: err => {
          console.error('Error al cargar tarjetas:', err);
          loading.dismiss();
        }
      });
    }

    
    async loadGastos() {
      const loading = await this.loadingController.create({
        message: 'Cargando datos...'
      });
      await loading.present();
    
      console.log(this.persona);
    
      this.backendService.getGastos(this.persona).subscribe({
        next: response => {
          if (response.status === 'success') {
            this.gastosOriginales = response.gastos;
            this.gastos = [...this.gastosOriginales];
            console.log('Gastos cargados:', this.gastos);
            loading.dismiss();
    
            // Calcular total de gastos después de cargar
            this.calcularTotalGastos();
          }
        },
        error: err => {
          console.error('Error al cargar gastos:', err);
          loading.dismiss();
        }
      });
    }

    reloadPage(){
      window.location.reload();
    }
    loadUserData() {
      this.persona = this.sesionService.getUser(); // Cargar datos del usuario
      console.log('Datos de usuario cargados:', this.persona);
      
      console.log(this.persona) // Para depuración
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
