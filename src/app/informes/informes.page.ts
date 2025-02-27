import { Component, Input, OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Margins } from 'pdfmake/interfaces';
(<any>pdfMake).addVirtualFileSystem(pdfFonts);
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../services/sesion.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Platform } from '@ionic/angular';
interface Ingreso {
  id_ingreso: number;
  id_tarjeta: number;  
  total: number;
  tarjeta: string;
  categoria: string;
  nombre: string;
  id_categoria:number;
  descripcion:string;
  fecha_ingreso: string;
}
interface Gasto {
  id_gasto: number;
  id_tarjeta: number;  
  total: number;
  tarjeta: string;
  id_categoria:number;

  categoria: string;
  nombre: string;
  fecha_ingreso: string;
  descripcion:string;
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
  id_tarjeta: number;  
  fecha_ingreso:string;
  id_categoria:number;


}

interface Prestamo{
  id_prestamo:number;
  id_tarjeta: number;  
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
  id_categoria:number;

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

interface Tarjeta {
  id_tarjeta: number;
  nombre:string;
  cantidad:number;
  tipo_tarjeta:string;

}

interface FiltroInforme{
  nombre:string;
}
@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {
  selectedMonth: string | undefined; 
  mesActual:string='';
  correo:string='';
  filtroInforme:FiltroInforme[]|any=[];
  id_tarjeta:[]|any;
  ObjectPDF: any;
  expandedId: string | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
  gastosOriginales: Gasto[] = [];  
  categoriasOriginales: []|any;  
  correoCambiar:boolean=false;
  gastos: Gasto[] = [];
  gastosFiltrados: any[] = [];
  public tarjetas  :[] | any;
  public persona: any; 
  mostrarLista:Gasto[] = [];
  tarjetasDebito : []|any;
  ahorrosOriginales: Ahorro[] = [];  
  ahorros : Ahorro[] =[];
  deudasOriginales: Deuda[] = []; 
  deudas: Deuda[] = []; 
  prestamosOriginales: Prestamo[] = [];  
  prestamos: Prestamo[] = [];
  ingresos: Ingreso[] = [];
  ingresosOriginales: Ingreso[] = [];  
  tarjetasOriginales: Tarjeta[] = [];  
  isLoading: boolean = false; 
  datosFiltrados:[]=[];
  totalDebito: number = 0;
  totalCredito: number = 0;
  totalGastos: number = 0;
  totalIngresos: number = 0;
  totalPrestamos: number = 0;
  public categorias:[]|any;
  nombre: string = '';
  selectedReports: string[] = [];
  gmail:string='';
  reportTypes = {
    General: 'General',
    Gastos: 'Gastos',
    Deudas: 'Deudas',
    Ingresos:'Ingresos',
    Prestamos: 'Prestamos',
    Ahorros: 'Ahorros'
  };
  id_categoria:[]|any;
  totalDeudas: number = 0;
  totalAhorros: number = 0;
  pdfUrl: string|any;
  mesesTraducidos: any[] | undefined;
  meses: any[] | undefined;

  
  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,private modalController: ModalController,
    public sanitizer: DomSanitizer,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

    ngOnInit() {
      
      
      this.loadUserData();
      this.loadCard();
      this.loadGastos();
      this.loadAhorros();
      this.loadDeudas();
      this.loadprestamos();
      this.loadCategoria();
      this.loadFiltros();
      this.loadingresos();
      this.obtenerMes();
      this.mostrarLista = this.gastos.slice(0, this.cantidadVisible);
  
    }

    obtenerMes(){
      const mesNumero = new Date().getMonth();
      const mesActual = new Date().getMonth() + 1;

      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      // Traduce todos los meses
      this.translate.get(meses).subscribe((traducciones: any) => {
        this.mesesTraducidos = meses.map(mes => traducciones[mes]);
      });
      this.meses = this.mesesTraducidos;
    
      const mesNombre = meses[new Date().getMonth()];
      this.mesActual = mesNombre;
    }

loadFiltros(){
  this.filtroInforme = Object.values(this.reportTypes).map(tipo => ({
    nombre: tipo
  }));
  console.log('filtros',this.filtroInforme)
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
            
            this.categoriasOriginales = response.categorias;
            this.categorias = [...this.categoriasOriginales];   
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

    

    onReportTypeChange(event: any) {
      const selectedValues = event.detail.value;
      
      this.filtroInforme = selectedValues.map((valor: string) => ({
        nombre: valor
      }));
      
      if (selectedValues.includes('General')) {
        this.filtroInforme = Object.values(this.reportTypes).map(tipo => ({
          nombre: tipo
        }));
      }
      
      console.log('Informes seleccionados:', this.filtroInforme.map((filtro: { nombre: any; }) => filtro.nombre));
    }


    calcularTotales() {
      this.totalDebito = this.tarjetas
        .filter((tarjeta: any) => tarjeta.tipo_tarjeta === 'debito')
        .reduce((sum: number, tarjeta: any) => sum + Number(tarjeta.cantidad), 0);
    
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
      this.totalPrestamos = this.prestamos.reduce((sum: number, prestamo: Prestamo) => sum + prestamo.total, 0);
    }
    calcularTotalDeudas() {
      this.totalDeudas = this.deudas.reduce((sum: number, deuda: Deuda) => sum + deuda.total, 0);
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
            this.tarjetasOriginales = response.tarjetas;
            this.tarjetas = [...this.tarjetasOriginales]; 
            
            console.log('tarjetas cargadas:', this.tarjetas);
            loading.dismiss();
    
            const tarjetasDebito = response.tarjetas.filter((tarjeta: { tipo_tarjeta: string; }) => tarjeta.tipo_tarjeta === 'debito');
            this.tarjetasDebito = tarjetasDebito;
            console.log('Tarjetas débito:', this.tarjetasDebito);
    
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
      this.persona = this.sesionService.getUser();
      
     
       
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
      this.mostrarLista = this.gastos.slice(0, this.cantidadVisible); 
  
      
      if (this.cantidadVisible >= this.gastos.length) {
        this.mostrarTodos = true;
      }
    }
  
    contraerLista() {
      this.cantidadVisible -= 5; 
      this.mostrarLista = this.gastos.slice(0, this.cantidadVisible);
    }


    




    filtrarPorFecha() {
      if (!this.selectedMonth) {
        this.gastos = [...this.gastosOriginales];
        this.ingresos = [...this.ingresosOriginales];
        this.deudas = [...this.deudasOriginales];
        this.ahorros = [...this.ahorrosOriginales];
        this.prestamos = [...this.prestamosOriginales];
      } else {
        const [year, month] = this.selectedMonth.split('-');
        const startDate = new Date(Number(year), Number(month) - 1, 1);  
        const endDate = new Date(Number(year), Number(month), 0);  
    
        this.gastos = this.gastosOriginales.filter(gasto => {
          const gastoFecha = new Date(gasto.fecha_ingreso);
          return gastoFecha >= startDate && gastoFecha <= endDate;
        });
    
        this.ingresos = this.ingresosOriginales.filter(ingreso => {
          const ingresoFecha = new Date(ingreso.fecha_ingreso);
          return ingresoFecha >= startDate && ingresoFecha <= endDate;
        });
    
        this.deudas = this.deudasOriginales.filter(deuda => {
          const deudaFecha = new Date(deuda.fecha_ingreso);
          return deudaFecha >= startDate && deudaFecha <= endDate;
        });
    
        this.ahorros = this.ahorrosOriginales.filter(ahorro => {
          const ahorroFecha = new Date(ahorro.fecha_ingreso);
          return ahorroFecha >= startDate && ahorroFecha <= endDate;
        });
    
        this.prestamos = this.prestamosOriginales.filter(prestamo => {
          const prestamoFecha = new Date(prestamo.fecha_ingreso);
          return prestamoFecha >= startDate && prestamoFecha <= endDate;
        });
      }
    
      
      this.calcularTotales();
      this.calcularTotalGastos();
      this.calcularTotalIngresos();
      this.calcularTotalDeudas();
      this.calcularTotalAhorros();
      this.calcularTotalPrestamos();
    
     
      
    }
    limpiarFiltro() {
      
      this.selectedMonth = '';  
      this.gastos = [...this.gastosOriginales];
      this.ingresos = [...this.ingresosOriginales];
      this.deudas = [...this.deudasOriginales];
      this.ahorros = [...this.ahorrosOriginales];
      this.prestamos = [...this.prestamosOriginales];
    
      
      this.calcularTotales();
      this.calcularTotalGastos();
      this.calcularTotalIngresos();
      this.calcularTotalDeudas();
      this.calcularTotalAhorros();
      this.calcularTotalPrestamos();
      
    }

    filtrarTodo() {
      if (this.id_tarjeta && this.id_tarjeta.length > 0) {
        console.log('Filtrando por categorías con IDs:', this.id_tarjeta);
    
        this.gastos = this.gastosOriginales.filter(gasto => this.id_tarjeta.includes(gasto.id_tarjeta));
        console.log('Gastos filtrados:', this.gastos);
    
        this.ingresos = this.ingresosOriginales.filter(ingreso => this.id_tarjeta.includes(ingreso.id_tarjeta));
        console.log('Ingresos filtrados:', this.ingresos);
    
        this.deudas = this.deudasOriginales.filter(deuda => this.id_tarjeta.includes(deuda.id_tarjeta));
        console.log('Deudas filtradas:', this.deudas);
    
        this.ahorros = this.ahorrosOriginales.filter(ahorro => this.id_tarjeta.includes(ahorro.id_tarjeta));
        console.log('Ahorros filtrados:', this.ahorros);
    
        this.prestamos = this.prestamosOriginales.filter(prestamo => this.id_tarjeta.includes(prestamo.id_tarjeta));
        console.log('Préstamos filtrados:', this.prestamos);

        this.tarjetas = this.tarjetasOriginales.filter(tarjeta=> this.id_tarjeta.includes(tarjeta.id_tarjeta));
        console.log('tarjetas filtradas:', this.tarjetas);


      } else {
        this.gastos = [...this.gastosOriginales];
        this.tarjetas= [...this.tarjetasOriginales];
        this.ingresos = [...this.ingresosOriginales];
        this.deudas = [...this.deudasOriginales];
        this.ahorros = [...this.ahorrosOriginales];
        this.prestamos = [...this.prestamosOriginales];
    
        console.log('Mostrando todos los datos');
      }
    
      this.calcularTotalGastos();
      this.calcularTotalIngresos();
      this.calcularTotalDeudas();
      this.calcularTotalAhorros();
      this.calcularTotalPrestamos();
    
    }


    filtrarCategoria() {
      if (this.id_categoria && this.id_categoria.length > 0) {
        console.log('Filtrando por categorías con IDs:', this.id_categoria);
    
        this.gastos = this.gastosOriginales.filter(gasto => this.id_categoria.includes(gasto.id_categoria));
        console.log('Gastos filtrados:', this.gastos);
    
        this.ingresos = this.ingresosOriginales.filter(ingreso => this.id_categoria.includes(ingreso.id_categoria));
        console.log('Ingresos filtrados:', this.ingresos);
    
        this.deudas = this.deudasOriginales.filter(deuda => this.id_categoria.includes(deuda.id_categoria));
        console.log('Deudas filtradas:', this.deudas);
    
        this.ahorros = this.ahorrosOriginales.filter(ahorro => this.id_categoria.includes(ahorro.id_categoria));
        console.log('Ahorros filtrados:', this.ahorros);
    
        this.prestamos = this.prestamosOriginales.filter(prestamo => this.id_categoria.includes(prestamo.id_categoria));
        console.log('Préstamos filtrados:', this.prestamos);

        this.categorias = this.categoriasOriginales.filter((categoria: { id_categoria: any; }) => this.id_categoria.includes(categoria.id_categoria));
        console.log('Categorias filtradas:', this.categorias);

      } else {
        this.gastos = [...this.gastosOriginales];
        this.categorias = [...this.categoriasOriginales];
        this.ingresos = [...this.ingresosOriginales];
        this.deudas = [...this.deudasOriginales];
        this.ahorros = [...this.ahorrosOriginales];
        this.prestamos = [...this.prestamosOriginales];
    
        console.log('Mostrando todos los datos');
      }
    
      this.calcularTotalGastos();
      this.calcularTotalIngresos();
      this.calcularTotalDeudas();
      this.calcularTotalAhorros();
      this.calcularTotalPrestamos();
    
    }
    

    
    DescargarInforme() {
      

      const encabezado=['Fecha', 'Tarjeta', 'Nombre', 'Categoria', 'Descripcion', 'Subtotal'];
      const filasGastos = this.gastos.map(gasto => [
        gasto.fecha_ingreso,      
        gasto.tarjeta,   
        gasto.nombre,     
        gasto.categoria,  
        gasto.descripcion,
        gasto.total      
      ]);
    
      
      
      
      
      const tablaGastos = [
        encabezado,
        ...filasGastos,
        [
          { text: '', colSpan: 4 },
          '', '', '',
          'Total',
          { text: this.totalGastos.toString() }
        ]
      ];
      
      

      const encabezadoAhorro=['Fecha', 'Tarjeta', 'Nombre', 'Categoria', 'Descripcion', 'Subtotal'];

      const filasAhorros = this.ahorros.map(ahorro => [
        ahorro.fecha_ingreso,     
        ahorro.tarjeta,   
        ahorro.nombre,    
        ahorro.categoria, 
        ahorro.descripcion, 
        ahorro.total      
      ]);
      
    

      const tablaAhorros = [
        encabezadoAhorro,
        ...filasAhorros,
        [
          { text: '', colSpan: 4 },
          '', '', '',
          'Total',
          { text: this.totalAhorros.toString() }
        ]
      ];



      const encabezadoPrestamos=['Fecha', 'Correo','Categoria','Nombre','Amigo','Tarjeta','Total Pagado','Total'];

      const filasPrestamos = this.prestamos.map(prestamo => [
          prestamo.fecha_ingreso,
          prestamo.correo_prestamo,
          prestamo.categoria,
          prestamo.nombre,
          prestamo.user_friend,
          prestamo.tarjeta,
          prestamo.total_pagado,
          prestamo.total
      ]);
      
    

      const tablaPrestamos = [
        encabezadoPrestamos,
        ...filasPrestamos,
        [
          { text: '', colSpan: 6 },
          '', '', '','','',
          'Total',
          { text: this.totalPrestamos.toString() }
        ]
      ]


      const encabezadoIngresos=['Fecha', 'Tarjeta', 'Nombre', 'Categoria', 'Descripcion', 'Subtotal'];

      const filasIngresos = this.ingresos.map(ingreso => [
        ingreso.fecha_ingreso,      
        ingreso.tarjeta,   
        ingreso.nombre,     
        ingreso.categoria,  
        ingreso.descripcion,
        ingreso.total  
      ]);
      
    

      const tablaIngresos = [
        encabezadoIngresos,
        ...filasIngresos,
        [
          { text: '', colSpan: 4 },
          '', '', '',
          'Total',
          { text: this.totalIngresos.toString() }
        ]
      ];

      const encabezadoDeuda=['Fecha', 'Tarjeta','Tarjeta para pagar', 'Nombre', 'Categoria', 'Descripcion','Cuotas Totales','Cuotas pagadas',
        'Cuotas por pagar','Total pagado', 'Total'];

        const filasDeudas = this.deudas.map(deuda => [
          { text: deuda.fecha_ingreso, fontSize: 8 },
          { text: deuda.tarjeta, fontSize: 8 },
          { text: deuda.tarjeta_pago, fontSize: 8 },
          { text: deuda.nombre, fontSize: 8 },
          { text: deuda.categoria, fontSize: 8 },
          { text: deuda.descripcion, fontSize: 8 },
          { text: deuda.cuotas.toString(), fontSize: 8 },
          { text: deuda.cuotas_pago.toString(), fontSize: 8 },
          { text: deuda.cuotas_pagar.toString(), fontSize: 8 },
          { text: deuda.total_pagado.toString(), fontSize: 8 },
          { text: deuda.total.toString(), fontSize: 8 }
        ]);

        
    

        const tablaDeudas = [
          encabezadoDeuda,
          ...filasDeudas,
          [
            { text: '', colSpan: 9 },
            '', '', '', '', '', '', '', '',
            'Total',
            { text: this.totalDeudas.toString() }
          ]
        ];


      
      const getFechaNombre = (fecha: string) => {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      // Traduce todos los meses
      this.translate.get(meses).subscribe((traducciones: any) => {
        this.mesesTraducidos = meses.map(mes => traducciones[mes]);
      });
      this.meses = this.mesesTraducidos;
        const mesNumero = parseInt(fecha.split('-')[1]) - 1; // -1 porque los meses en JS van de 0-11
        return meses[mesNumero];
      }
      
      const tarjetasTabla = this.tarjetas.map((tarjeta: any) =>[
        {text: this.tarjetas.nombre , fontSize:8},
      ]);

      const filtros = this.filtroInforme.map((filtro: any) =>[
        {text: this.filtroInforme.nombre , fontSize:8},
      ]);
      

const hasSpecificWord = (array:any, searchWord:any) => {
  if (!Array.isArray(array)) return false;
  
  return array.some(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchWord.toLowerCase())
    )
  );
};
console.log(filtros)
console.log('Informes seleccionados:', this.filtroInforme.map((filtro: { nombre: any; }) => filtro.nombre));
      const dd = {
        content: [
          { text: ['Informe mes: ', { 
            text: this.selectedMonth ? getFechaNombre(this.selectedMonth) : new Date().toLocaleString('es', { month: 'long' }), 
            style: 'header' 
        }] },
          { text: ['Usuario: ', { text: this.persona.username, bold: true }] },
          { text: ['Correo: ', { text: this.persona.gmail, bold: true }] },
          { text: 'Filtros: ' },
          { text: ['-Mes: ', { text: this.selectedMonth ? getFechaNombre(this.selectedMonth) : new Date().toLocaleString('es', { month: 'long' })
            , bold: true }] },
            { 
              text: ['-Tarjetas: ', { text: this.tarjetas.map((tarjeta: { nombre: any }) => tarjeta.nombre).join(', '), bold: true }] 
            },

            { 
              text: ['-Categorias: ', { text: this.categorias.map((categoria: { nombre: any }) => categoria.nombre).join(', '), bold: true }] 
            },
          { 
            text: ['-Cuentas: ', { text: this.filtroInforme.map((filtro: { nombre: any }) => filtro.nombre).join(', '), bold: true }] 
          }
          ,

          ...(hasSpecificWord(this.filtroInforme, 'Gastos') ? [
          { text: 'Gastos', style: 'subheader' },
          {
            style: 'tableExample',
            table: {
              body: tablaGastos,
              
            }
          }
        ] : []),
    
          ...(hasSpecificWord(this.filtroInforme, 'Ahorros') ? [
          { text: 'Ahorros', style: 'subheader' },
          {
            style: 'tableExample',
            table: {
             
              
              body: tablaAhorros 
            }
          }
        ] : []),

    
         
        ...(hasSpecificWord(this.filtroInforme, 'Deudas') ? [
          { text: 'Deudas', style: 'subheader' },
          {
            style: 'tableDeuda',
            
            table: {
              headerRows: 1,
          

              body: tablaDeudas
            },
            
          }
        ] : []),
        [
          { text: '', style: 'subheader'},
          
        ] ,
        [
          { text: '', style: 'subheader'},
          
        ] ,[
          { text: '', style: 'subheader'},
          
        ] ,[
          { text: '', style: 'subheader'},
          
        ] ,[
          { text: '', style: 'subheader'},
          
        ] ,[
          { text: '', style: 'subheader'},
          
        ] ,

        ...(hasSpecificWord(this.filtroInforme, 'Prestamos') ? [
          { text: 'Prestamos', style: 'subheader'},
          {
            style: 'tableExample',
            
            table: {

              body: tablaPrestamos
            },
            
          }
        ] : []),

        ...(hasSpecificWord(this.filtroInforme, 'Ingresos') ? [
          { text: 'Ingresos', style: 'subheader' },
          {
            style: 'tableExample',
            
            table: {
             
              body: tablaIngresos
            },
            
          }
        ] : []),
    
          
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [-30, 10, 0, 5] as Margins
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [-30, 10, 0, 5] as Margins
          },
          tableExample: {
            margin: [-30, 5, 15, 20] as Margins,
            heights: 10
          },
          tableDeuda: {
            margin: [-30, 5, 500, 20] as Margins,

            heights: 10,
            widths: ['9%', '9%', '10%', '12%', '10%', '15%', '10%', '10%', '10%', '10%', '10%'],
            
          },
          tableHeader: {
            bold: true,
            fontSize: 9,
            color: 'black'
          }
        },
        
      };
      // Crear el PDF
      this.ObjectPDF = pdfMake.createPdf(dd);
      console.log('PDF creado');
      const pdfObject = pdfMake.createPdf(dd);

      pdfObject.getDataUrl((dataUrl: string) => {
        // Asignar la URL del PDF al iframe
        this.pdfUrl = dataUrl;
        
        console.log('url',this.pdfUrl);
        if(this.correoCambiar === true){
        this.enviarPdf(this.persona.gmail,this.pdfUrl);
      }

      });
      this.ObjectPDF.getBase64(async (base64: string) => {
        const fileName = `informe_${Date.now()}.pdf`;
      
        // Guardar el archivo en el almacenamiento
        await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Documents,
        });
        
        
      
        // Mostrar una notificación al usuario
        console.log('PDF guardado:', fileName);
      });

      this.descargarPdf();
    }




    correoCambio(event: any) {
      this.correoCambiar = event.detail.checked; // Obtener el estado del toggle (true o false)
      
    }

    enviarPdf(correo:string,pdf:string){
      const credentials = {
       correo: correo,
        pdf: pdf,
      };
      console.log('credenciales',credentials)

      this.backendService.enviarPdf(credentials).subscribe({
        next: response => {
          console.log('Deuda agregada', response);
         
          
        },
        error: err => {
          console.error('Error al agregar la deuda', err);
        }
      });

    }
  
    dismiss() {
      // Cierra el modal
    }
    
    async descargarPdf() {
      if(!this.selectedMonth){
        this.ObjectPDF.download(`informe_${this.selectedMonth}.pdf`);
        
      }
      else{
        this.ObjectPDF.download(`informe_${Date.now()}.pdf`);

      }
      const alert = await this.alertController.create({
        header: 'Informe creado.',
        subHeader: 'Informe descargado con exito.',
        message: 'Se ha descargado su informe en la carpeta de documentos del telefono.',
        buttons: ['OK'],
    });
    await alert.present();
      
      
      console.log('Ya se descargó');
      
    }




    MostrarInforme() {
      

      const encabezado=['Fecha', 'Tarjeta', 'Nombre', 'Categoria', 'Descripcion', 'Subtotal'];
      const filasGastos = this.gastos.map(gasto => [
        gasto.fecha_ingreso,      
        gasto.tarjeta,   
        gasto.nombre,     
        gasto.categoria,  
        gasto.descripcion,
        gasto.total      
      ]);
    
      
      
      
      
      const tablaGastos = [
        encabezado,
        ...filasGastos,
        [
          { text: '', colSpan: 4 },
          '', '', '',
          'Total',
          { text: this.totalGastos.toString() }
        ]
      ];
      
      

      const encabezadoAhorro=['Fecha', 'Tarjeta', 'Nombre', 'Categoria', 'Descripcion', 'Subtotal'];

      const filasAhorros = this.ahorros.map(ahorro => [
        ahorro.fecha_ingreso,     
        ahorro.tarjeta,   
        ahorro.nombre,    
        ahorro.categoria, 
        ahorro.descripcion, 
        ahorro.total      
      ]);
      
    

      const tablaAhorros = [
        encabezadoAhorro,
        ...filasAhorros,
        [
          { text: '', colSpan: 4 },
          '', '', '',
          'Total',
          { text: this.totalAhorros.toString() }
        ]
      ];



      const encabezadoPrestamos=['Fecha', 'Correo','Categoria','Nombre','Amigo','Tarjeta','Total Pagado','Total'];

      const filasPrestamos = this.prestamos.map(prestamo => [
          prestamo.fecha_ingreso,
          prestamo.correo_prestamo,
          prestamo.categoria,
          prestamo.nombre,
          prestamo.user_friend,
          prestamo.tarjeta,
          prestamo.total_pagado,
          prestamo.total
      ]);
      
    

      const tablaPrestamos = [
        encabezadoPrestamos,
        ...filasPrestamos,
        [
          { text: '', colSpan: 6 },
          '', '', '','','',
          'Total',
          { text: this.totalPrestamos.toString() }
        ]
      ]


      const encabezadoIngresos=['Fecha', 'Tarjeta', 'Nombre', 'Categoria', 'Descripcion', 'Subtotal'];

      const filasIngresos = this.ingresos.map(ingreso => [
        ingreso.fecha_ingreso,      
        ingreso.tarjeta,   
        ingreso.nombre,     
        ingreso.categoria,  
        ingreso.descripcion,
        ingreso.total  
      ]);
      
    

      const tablaIngresos = [
        encabezadoIngresos,
        ...filasIngresos,
        [
          { text: '', colSpan: 4 },
          '', '', '',
          'Total',
          { text: this.totalIngresos.toString() }
        ]
      ];

      const encabezadoDeuda=['Fecha', 'Tarjeta','Tarjeta para pagar', 'Nombre', 'Categoria', 'Descripcion','Cuotas Totales','Cuotas pagadas',
        'Cuotas por pagar','Total pagado', 'Total'];

        const filasDeudas = this.deudas.map(deuda => [
          { text: deuda.fecha_ingreso, fontSize: 8 },
          { text: deuda.tarjeta, fontSize: 8 },
          { text: deuda.tarjeta_pago, fontSize: 8 },
          { text: deuda.nombre, fontSize: 8 },
          { text: deuda.categoria, fontSize: 8 },
          { text: deuda.descripcion, fontSize: 8 },
          { text: deuda.cuotas.toString(), fontSize: 8 },
          { text: deuda.cuotas_pago.toString(), fontSize: 8 },
          { text: deuda.cuotas_pagar.toString(), fontSize: 8 },
          { text: deuda.total_pagado.toString(), fontSize: 8 },
          { text: deuda.total.toString(), fontSize: 8 }
        ]);

        
    

        const tablaDeudas = [
          encabezadoDeuda,
          ...filasDeudas,
          [
            { text: '', colSpan: 9 },
            '', '', '', '', '', '', '', '',
            'Total',
            { text: this.totalDeudas.toString() }
          ]
        ];


      
      const getFechaNombre = (fecha: string) => {
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const mesNumero = parseInt(fecha.split('-')[1]) - 1; // -1 porque los meses en JS van de 0-11
        return meses[mesNumero];
      }
      
      const tarjetasTabla = this.tarjetas.map((tarjeta: any) =>[
        {text: this.tarjetas.nombre , fontSize:8},
      ]);

      const filtros = this.filtroInforme.map((filtro: any) =>[
        {text: this.filtroInforme.nombre , fontSize:8},
      ]);
      

const hasSpecificWord = (array:any, searchWord:any) => {
  if (!Array.isArray(array)) return false;
  
  return array.some(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchWord.toLowerCase())
    )
  );
};
console.log(filtros)
console.log('Informes seleccionados:', this.filtroInforme.map((filtro: { nombre: any; }) => filtro.nombre));
      const dd = {
        content: [
          { text: ['Informe mes: ', { 
            text: this.selectedMonth ? getFechaNombre(this.selectedMonth) : new Date().toLocaleString('es', { month: 'long' }), 
            style: 'header' 
        }] },
          { text: ['Usuario: ', { text: this.persona.username, bold: true }] },
          { text: ['Correo: ', { text: this.persona.gmail, bold: true }] },
          { text: 'Filtros: ' },
          { text: ['-Mes: ', { text: this.selectedMonth ? getFechaNombre(this.selectedMonth) : new Date().toLocaleString('es', { month: 'long' })
            , bold: true }] },
            { 
              text: ['-Tarjetas: ', { text: this.tarjetas.map((tarjeta: { nombre: any }) => tarjeta.nombre).join(', '), bold: true }] 
            },

            { 
              text: ['-Categorias: ', { text: this.categorias.map((categoria: { nombre: any }) => categoria.nombre).join(', '), bold: true }] 
            },
          { 
            text: ['-Cuentas: ', { text: this.filtroInforme.map((filtro: { nombre: any }) => filtro.nombre).join(', '), bold: true }] 
          }
          ,

          ...(hasSpecificWord(this.filtroInforme, 'Gastos') ? [
          { text: 'Gastos', style: 'subheader' },
          {
            style: 'tableExample',
            table: {
              body: tablaGastos,
              
            }
          }
        ] : []),
    
          ...(hasSpecificWord(this.filtroInforme, 'Ahorros') ? [
          { text: 'Ahorros', style: 'subheader' },
          {
            style: 'tableExample',
            table: {
             
              
              body: tablaAhorros 
            }
          }
        ] : []),

    
         
        ...(hasSpecificWord(this.filtroInforme, 'Deudas') ? [
          { text: 'Deudas', style: 'subheader' },
          {
            style: 'tableDeuda',
            
            table: {
              headerRows: 1,
          

              body: tablaDeudas
            },
            
          }
        ] : []),

        ...(hasSpecificWord(this.filtroInforme, 'Prestamos') ? [
          { text: 'Prestamos', style: 'subheader' },
          {
            style: '',
            
            table: {

              body: tablaPrestamos
            },
            
          }
        ] : []),

        ...(hasSpecificWord(this.filtroInforme, 'Ingresos') ? [
          { text: 'Ingresos', style: 'subheader' },
          {
            style: '',
            
            table: {
             
              body: tablaIngresos
            },
            
          }
        ] : []),
    
          
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10] as Margins
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5] as Margins
          },
          tableExample: {
            margin: [15, 5, 15, 20] as Margins,
            heights: 10
          },
          tableDeuda: {
            margin: [-30, 5, 500, 20] as Margins,

            heights: 10,
            widths: ['9%', '9%', '10%', '12%', '10%', '15%', '10%', '10%', '10%', '10%', '10%'],
            
          },
          tableHeader: {
            bold: true,
            fontSize: 9,
            color: 'black'
          }
        },
        
      };
      // Crear el PDF
      this.ObjectPDF = pdfMake.createPdf(dd);
      console.log('PDF creado');
      const pdfObject = pdfMake.createPdf(dd);

      this.mostrarVistaPreviaPdf(dd);
    
}
mostrarVistaPreviaPdf(dd:any) {
  // Crea un objeto PDF a partir de los datos generados
  const pdfObject = pdfMake.createPdf(dd);

  // Abre la vista previa del PDF
  pdfObject.open();
}
}
