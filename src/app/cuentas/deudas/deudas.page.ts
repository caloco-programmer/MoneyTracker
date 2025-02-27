import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../../services/sesion.service';
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
  valor_cuota:number;
  id_credito:number;
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
  id_tarjeta:number;
}

@Component({
  selector: 'app-deudas',
  templateUrl: './deudas.page.html',
  styleUrls: ['./deudas.page.scss'],
})
export class DeudasPage implements OnInit {
  
  expandedId: string | null = null;
  mostrarEliminarIconos: boolean = false; 
  mostrarEditarIconos: boolean = false; 
  isEditing:boolean = false;
  isModalDeudaOpen:boolean = false;
  prestamosOriginales: Prestamo[] = [];  
  prestamos: Prestamo[] = [];
  isModalPrestamoOpen =false;
  isModalOpen = false;
  presentingElement: HTMLElement | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
  selectedChartType: ChartType = 'bar';  
  chart: any; 
  id_prestamo:number|any;
  fecha_compra: Boolean = false;
  cantidadCuota:Boolean = false;
  id_tarjeta: number =0;
  id_tarjeta_pagar: number =0;
  id_deuda:number=0;
  id_categoria: number=0;
  fecha:string ='';
  Descripcion:string = '';
  total: number=0;
  deudasOriginales: Deuda[] = [];  
  id_gasto:number=0;
  
  
  deudasFiltrados: any[] = [];
  public tarjetas  :[] | any;
  public persona: any; 
  nombre: string = '';
  tipo: string = '';
  cantidad: number|any;
  tarjetaVista:boolean = false;
 tarjetaTrue: boolean = false;
  public categorias  :[] | any;
  cantidadCuotas: Number |any;
  mostrarLista:Gasto[] = [];
  selectedGasto: any;
  totalCuotas:number =0;
  valorCuota:number=0;
  option:Boolean = false;
  tarjetasDebito : []|any;
  deudas: Deuda[] = [];
  selecteddeuda: any;
  totalAnadir:number|any;
  id_credito: any;
  tarjetaSeleccionada: any;
  selectedPrestamo: any;
  total_pagar: number|any;
  todos: any;
  tarjetasCredito: any;
  
  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,private alertController: AlertController) {}

  ngOnInit() {
    this.presentingElement = document.getElementById('main-content');
    this.presentingElement = document.querySelector('.ion-page');
    
    this.loadUserData();
    this.loadCard();
    this.loadDeudas();
    this.loadprestamos();
    this.getSelectedCurrency();
    // this.mostrarLista = this.deudas.slice(0, this.cantidadVisible);


  }
  getSelectedCurrency() {
    return localStorage.getItem('selectedCurrency') || 'CLP'; // Devuelve 'CLP' por defecto si no hay moneda almacenada
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
    this.tarjetaSeleccionada = this.tarjetas.find((tarjeta: { id_tarjeta: any; }) => tarjeta.id_tarjeta === event.detail.value);
    console.log('tarjeta',this.tarjetaSeleccionada)
    // Si la tarjeta seleccionada es de crédito, mostramos el input de cuotas
    if (this.tarjetaSeleccionada && this.tarjetaSeleccionada.tipo_tarjeta === 'credito') {
      this.tarjetaVista = true;
    } else {
      this.tarjetaVista = false;
    }
  }

  onTipoChangeTarjeta(event: any) {
    console.log(event.detail.value)
    this.tarjetaSeleccionada = this.tarjetasDebito.find((tarjeta: { id_tarjeta: any; }) => tarjeta.id_tarjeta === event.detail.value);
    console.log('tarjeta',this.tarjetaSeleccionada)
    this.id_tarjeta = event.detail.value;
    // Si la tarjeta seleccionada es de crédito, mostramos el input de cuotas
    if (this.tarjetaSeleccionada && this.tarjetaSeleccionada.tipo_tarjeta === 'debito') {
      this.tarjetaTrue = true;

    } else {
      this.tarjetaVista = false;
    }
  }
  
  onTipoChanges(event: any) {
    // Si el tipo es crédito, muestra el input; si no, lo oculta
    this.option=true;

    this.fecha_compra = event.detail.value === 'personalizado';
  }
  async onCuotasChange(event: any) {
    this.option=true;
    

    
    this.totalCuotas = this.cantidadCuotas * this.valorCuota;
    console.log(this.totalCuotas);
    if (this.totalCuotas > this.tarjetaSeleccionada.cantidad) {
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


    // Si el tipo es crédito, muestra el input; si no, lo oculta
  }

  async TotalChange(event: any) {
    this.option=true;

    
    console.log(this.totalAnadir);
    console.log(this.tarjetaSeleccionada.cantidad);
    if (this.totalAnadir > this.tarjetaSeleccionada.cantidad) {
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


    // Si el tipo es crédito, muestra el input; si no, lo oculta
  }
  
  filtrarDeudas(event:any) {
    if (typeof event.detail.value === 'number') {
      console.log(this.deudasOriginales)
      console.log(this.id_credito)
      console.log('todos',this.todos)
      this.deudasOriginales.forEach(deuda => {
        console.log('ID de tarjeta del deuda:', deuda.id_credito);
      });
     
      this.deudas = this.deudasOriginales.filter(deuda => deuda.id_credito === event.detail.value);
      console.log(this.deudas)
    }else{
      
      this.deudas = [...this.deudasOriginales];
    }
    this.loadChart(); 
    console.log('deudas filtrados',this.deudas)

  }
  async pagar(){
    const nuevodeuda = {
      id_prestamo:this.id_prestamo,
      total:this.totalAnadir,
      id_tarjeta:this.id_tarjeta,
      usuario: this.persona.username,
      
      
    };
    console.log(this.persona.username);
    console.log(this.tipo);
    console.log(this.nombre);
    console.log(nuevodeuda);
    console.log(this.selectedPrestamo);
    this.total_pagar = this.selectedPrestamo.total- this.selectedPrestamo.total_pagado;
    if (this.totalAnadir > this.total_pagar) {
      const alert = await this.alertController.create({
        header: 'Sobre Pago',
        subHeader:`Usted solo debe : ${this.selectedPrestamo.total- this.selectedPrestamo.total_pagado}`,
        message: `E intenta pagar : $${this.totalAnadir}`,
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
    }else{
    this.backendService.uptPrestamo(nuevodeuda).subscribe({
      next: response => {
        console.log('deuda agregado', response);
        this.isModalPrestamoOpen=false;
        this.reloadPage();
      },
      error: err => {
        console.error('Error al agregar deuda', err);
      }
    });
  }
  }
  
  // filtrardeudas() {
  //   if (this.id_tarjeta) {
  //     console.log(this.deudasOriginales)
  //     console.log(this.id_tarjeta)
  //     this.deudasOriginales.forEach(deuda => {
  //       console.log('ID de tarjeta del deuda:', deuda.id_tarjeta);
  //     });
     
  //     this.deudas = this.deudasOriginales.filter(deuda => gasto.id_tarjeta === this.id_tarjeta);
  //     console.log(this.deudas)
  //   } else {
      
  //     this.deudas = [...this.deudasOriginales];
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
   editar(deuda:any,prestamo:any) {
    console.log(deuda)
    if (deuda) {
      this.isEditing = true; 
      console.log(deuda);
      this.selecteddeuda = deuda; 
      this.valorCuota=deuda.valor_cuota;
      console.log(this.valorCuota);
      this.id_deuda=deuda.id_deuda;
      this.nombre = deuda.nombre;
      this.total = deuda.total;
      this.Descripcion = deuda.descripcion;
      this.id_tarjeta = deuda.id_tarjeta;
      this.id_categoria = deuda.id_categoria;
      this.id_credito = deuda.id_credito;
      this.onTipoChange({ detail: { value: this.id_tarjeta } });

      
      console.log(this.id_categoria)
      console.log(deuda.id_categoria)
      console.log(this.Descripcion)
      console.log(deuda.descripcion)
      console.log(deuda.fecha_ingreso)
      this.isModalDeudaOpen=true;
    } else if (prestamo) {
      console.log(prestamo);
      this.selectedPrestamo = prestamo; 
      this.valorCuota=prestamo.valor_cuota;
      console.log(this.valorCuota);
      this.id_prestamo=prestamo.id_prestamo;
      this.nombre = prestamo.nombre;
      this.total = this.totalAnadir;
      this.Descripcion = prestamo.descripcion;
      this.id_categoria = prestamo.id_categoria;
      this.id_credito = prestamo.id_credito;

      
      console.log(this.id_categoria)
      console.log(prestamo.id_categoria)
      console.log(this.Descripcion)
      console.log(prestamo.descripcion)
      console.log(prestamo.fecha_ingreso)
      this.isModalPrestamoOpen=true;
    }
  
    // Open the modal or form
    
  }

  async addDinero(){
    const nuevodeuda = {
      id_deuda:this.id_deuda,
      total:this.totalCuotas,
      id_tarjeta:this.id_tarjeta,
      usuario: this.persona.username,
      id_credito:this.id_credito,
      
      
    };
    console.log(this.persona.username)
    console.log(this.tipo)
    console.log(this.nombre)
    console.log(nuevodeuda)
    
    this.backendService.uptDeuda(nuevodeuda).subscribe({
      next: response => {
        console.log('deuda agregado', response);
        this.isModalDeudaOpen =false;
        this.reloadPage();
      },
      error: err => {
        console.error('Error al agregar gasto', err);
      }
    });
  }
  

   setOpen(isOpen: boolean) {
    this.isModalDeudaOpen = isOpen;
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
  async eliminar_tarjeta(id_tarjeta: number){
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    console.log(id_tarjeta);
    
    await loading.present();
    
    console.log(this.persona);
    await this.backendService.delete_deuda(id_tarjeta).subscribe({
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

  loadChart() {
    const ctx = document.getElementById('deudas') as HTMLCanvasElement;
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico existente para evitar duplicados
    }

    // Obtener nombres y montos de los deudas visibles
    const labels = this.deudas.map(gasto => gasto.nombre);
    const data = this.deudas.map(gasto => gasto.total);

    this.chart = new Chart(ctx, {
      type: this.selectedChartType, // Usa el tipo de gráfico seleccionado (puede ser 'bar', 'line', etc.)
      data: {
        labels: labels, // Usa los nombres como etiquetas
        datasets: [{
          label: 'deudas',
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
