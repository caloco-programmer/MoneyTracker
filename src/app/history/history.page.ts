import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../services/sesion.service';
import { Router } from '@angular/router';

interface Ingreso {
  id_ingreso: number;
  id_tarjeta: number;  
  total: number;
  tarjeta: string;
  id_categoria:number;

  categoria: string;
  nombre: string;
  fecha_ingreso: string;
}
interface Gasto {
  id_gasto: number;
  id_tarjeta: number;  
  total: number;
  id_categoria:number;

  tarjeta: string;
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
  id_categoria:number;

  cuotas:number;
  cuotas_pago:number;
  cuotas_pagar:number;
  tarjeta:string;
  tarjeta_pago:string;
  categoria:string;
  descripcion:string;
  id_tarjeta: number;  
  fecha_ingreso:string;

}
interface Tarjeta {
  id_tarjeta: number;
  nombre:string;
  cantidad:number;
  tipo_tarjeta:string;

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
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  
 
    
  selectedMonth: string | undefined; 
  selectedChartType: ChartType = 'bar';  // Tipo de gráfico seleccionado
  chart: any; 
  expandedId: string | null = null;
  mostrarEliminarIconos: boolean = false; 
  isModalOpen = false;
  presentingElement: HTMLElement | null = null;
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
  tarjetasOriginales: Tarjeta[] = [];  

  ahorrosOriginales: Ahorro[] = [];  
  ahorros : Ahorro[] =[];
  deudasOriginales: Deuda[] = []; 
  deudas: Deuda[] = []; 
  prestamosOriginales: Prestamo[] = [];  
  prestamos: Prestamo[] = [];
  ingresos: Ingreso[] = [];
  ingresosOriginales: Ingreso[] = [];  
  public categorias:[]|any;
  
  totalDebito: number = 0;
  totalCredito: number = 0;
  totalGastos: number = 0;
  totalIngresos: number = 0;
  totalPrestamos: number = 0;
  totalDeudas: number = 0;
  totalAhorros: number = 0;
  id_categoria:[]|any;
  categoriasOriginales: []|any;  
  id_tarjeta:[]|any;


  items: Item[] = [];
  tarjetasCredito: any;
  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController) {}

    ngOnInit() {
      
      
      this.loadUserData();
      this.loadCard();
      this.loadGastos();
      this.loadAhorros();
      this.loadDeudas();
      this.loadprestamos();
      this.loadingresos();
      this.loadCategoria();

     
      
      
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
    
    calcularTotales() {
      // Total de tarjetas de débito
      this.totalDebito = this.tarjetas
        .filter((tarjeta: any) => tarjeta.tipo_tarjeta === 'debito')
        .reduce((sum: number, tarjeta: any) => sum + Number(tarjeta.cantidad), 0);
    
      // Total de tarjetas de crédito
      this.totalCredito = this.tarjetas
        .filter((tarjeta: any) => tarjeta.tipo_tarjeta === 'credito')
        .reduce((sum: number, tarjeta: any) => sum + Number(tarjeta.cantidad), 0);
    
      // Después de calcular, actualizamos `items` para el gráfico
      
    
      // Llamamos a `loadChart` para actualizar el gráfico
      this.loadChart();
    }
    
    calcularTotalGastos() {
      this.totalGastos = this.gastos.reduce((sum: number, gasto: Gasto) => sum + gasto.total, 0);
      
      // Actualizar los items para los gastos
      if (this.totalGastos > 0) {
        this.items.push({
          monto: this.formatCurrency(this.totalGastos),
          fecha: new Date().toLocaleDateString(),
          cuenta: 'Gastos',
          nombre: 'Gastos',
        });
      }
      this.loadChart();
    }
    
    calcularTotalIngresos() {
      this.totalIngresos = this.ingresos.reduce((sum: number, ingreso: Ingreso) => sum + ingreso.total, 0);
      
      // Actualizar los items para los ingresos
      if (this.totalIngresos > 0) {
        this.items.push({
          monto: this.formatCurrency(this.totalIngresos),
          fecha: new Date().toLocaleDateString(),
          cuenta: 'Ingresos',
          nombre: 'Ingresos',
        });
      }
      this.loadChart();
    }
    
    calcularTotalPrestamos() {
      this.totalPrestamos = this.prestamos.reduce((sum: number, prestamo: Prestamo) => sum + prestamo.total, 0);
      
      // Actualizar los items para los prestamos
      if (this.totalPrestamos > 0) {
        this.items.push({
          monto: this.formatCurrency(this.totalPrestamos),
          fecha: new Date().toLocaleDateString(),
          cuenta: 'Prestamos',
          nombre: 'Prestamos',
        });
      }
      this.loadChart();
    }
    
    calcularTotalDeudas() {
      this.totalDeudas = this.deudas.reduce((sum: number, deuda: Deuda) => sum + deuda.total, 0);
      
      // Actualizar los items para las deudas
      if (this.totalDeudas > 0) {
        this.items.push({
          monto: this.formatCurrency(this.totalDeudas),
          fecha: new Date().toLocaleDateString(),
          cuenta: 'Deudas',
          nombre: 'Deudas',
        });
      }
      this.loadChart();
    }
    
    calcularTotalAhorros() {
      this.totalAhorros = this.ahorros.reduce((sum: number, ahorro: Ahorro) => sum + ahorro.total, 0);
      
      // Actualizar los items para los ahorros
      if (this.totalAhorros > 0) {
        this.items.push({
          monto: this.formatCurrency(this.totalAhorros),
          fecha: new Date().toLocaleDateString(),
          cuenta: 'Ahorros',
          nombre: 'Ahorros',
        });
      }
      this.loadChart();
    }
    
    // Método para formatear el monto a un formato más legible
    formatCurrency(amount: number): string {
      return amount.toLocaleString('es-ES', { style: 'currency', currency: 'COP' });
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
    

    loadChart() {
      const ctx = document.getElementById('historial') as HTMLCanvasElement;
      
      // Destruir cualquier gráfico existente para evitar duplicados
      if (this.chart) {
        this.chart.destroy();
      }
    
      // Crear un nuevo array con los datos filtrados de los diferentes tipos
      const items: Item[] = [];
    
      // Agregar los totales de los diferentes tipos a `items`
      items.push({ monto: this.totalDeudas.toString(), fecha: '25/09', cuenta: 'cuenta 1', nombre: 'Deudas' });
      items.push({ monto: this.totalAhorros.toString(), fecha: '25/09', cuenta: 'cuenta 2', nombre: 'Ahorros' });
      items.push({ monto: this.totalIngresos.toString(), fecha: '25/09', cuenta: 'cuenta 3', nombre: 'Ingresos' });
      items.push({ monto: this.totalGastos.toString(), fecha: '25/09', cuenta: 'cuenta 4', nombre: 'Gastos' });
      items.push({ monto: this.totalPrestamos.toString(), fecha: '25/09', cuenta: 'cuenta 5', nombre: 'Préstamos' });
    
      // Obtener los labels y los datos del array `items`
      const labels = items.map(item => item.nombre);
      const data = items.map(item => parseFloat(item.monto.replace('.', '').replace(',', '.'))); // Convertir a número
    
      // Crear el gráfico con los datos filtrados
      this.chart = new Chart(ctx, {
        type: this.selectedChartType,  // Tipo de gráfico seleccionado
        data: {
          labels: labels,  // Etiquetas para el gráfico
          datasets: [{
            label: 'Totales',
            data: data,  // Datos del gráfico (totales)
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
    

    filtrarPorFecha() {
      if (!this.selectedMonth) {
        // Si no hay mes seleccionado, restaurar los datos originales
        this.gastos = [...this.gastosOriginales];
        this.ingresos = [...this.ingresosOriginales];
        this.deudas = [...this.deudasOriginales];
        this.ahorros = [...this.ahorrosOriginales];
        this.prestamos = [...this.prestamosOriginales];
      } else {
        // Si hay un mes seleccionado, filtrar los datos
        const [year, month] = this.selectedMonth.split('-');
        const startDate = new Date(Number(year), Number(month) - 1, 1);  // Primer día del mes seleccionado
        const endDate = new Date(Number(year), Number(month), 0);  // Último día del mes seleccionado
    
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
    
      // Recalcular los totales después de filtrar o restaurar
      this.calcularTotales();
      this.calcularTotalGastos();
      this.calcularTotalIngresos();
      this.calcularTotalDeudas();
      this.calcularTotalAhorros();
      this.calcularTotalPrestamos();
    
      // Actualizar el gráfico con los datos filtrados o restaurados
      this.loadChart();
    }
    limpiarFiltro() {
      // Aquí se limpia el filtro de fecha y se restauran los datos
      this.selectedMonth = '';  // Reiniciar el valor del mes seleccionado
      this.gastos = [...this.gastosOriginales];
      this.ingresos = [...this.ingresosOriginales];
      this.deudas = [...this.deudasOriginales];
      this.ahorros = [...this.ahorrosOriginales];
      this.prestamos = [...this.prestamosOriginales];
    
      // Recalcular los totales y actualizar el gráfico
      this.calcularTotales();
      this.calcularTotalGastos();
      this.calcularTotalIngresos();
      this.calcularTotalDeudas();
      this.calcularTotalAhorros();
      this.calcularTotalPrestamos();
      this.loadChart();
    }
        
  
    // Llamar a filtrarPorFecha() cada vez que el mes seleccionado cambie
    ngOnChanges() {
      this.filtrarPorFecha();  // Filtrar los datos cuando el mes cambia
    }
    
    // Método para actualizar el gráfico cuando el usuario selecciona un nuevo tipo
    updateChart() {
      this.loadChart();  // Vuelve a cargar el gráfico con el nuevo tipo
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
      this.loadChart();
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
      this.loadChart();
    
    }
}



