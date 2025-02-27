import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../services/backend.service';

import { SesionService, User } from '../services/sesion.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';

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
  descripcion:string;
}


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  modalType: string ='';

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
  gastosOriginales: Gasto[] = [];  
  id_gasto:number=0;
  
  gastos: Gasto[] = [];
  gastosFiltrados: any[] = [];
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
  isModalIngresoOpen = false;
  isModalIngresoMensualOpen = false;
  isModalGastoOpen = false;
  isModalGastoMensualOpen = false;
  isModalGastoCuotaOpen = false;
  isModalAhorroOpen = false;
  isModalAhorroMensualOpen = false;
  isModalPrestamoOpen = false;
  public categorias  :[] | any;
  cantidadCuotas: Number |any;
  mostrarLista:Gasto[] = [];
  selectedGasto: any;
  totalCuotas:number =0;
  valorCuota:number=0;
  option:Boolean = false;
  tarjetasDebito : []|any;
  tarjetasCredito : []|any;
  totalAhorrar:Number=0;
  cantidadCuotasPagadas:Number|any;
  total_pagar:Number|any;
  nuevoAhorro:boolean = false;
  existente:boolean = false;
  public friend: [] | any;
  friend_username:string ='';
  correo:string ='';
  fechaLimite:boolean=false;
  total_pagado:number|any;
  totalGastos: number = 0;
  descripcion: string='';
  tarjetaSeleccionada:[]|any=[];
  metodo:any;
  id_ingreso: any;
  selectFecha: boolean = false;
  selectFecha2: boolean = false;

  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,
    private route: ActivatedRoute,private navController: NavController,private alertController: AlertController) {}


    
  ngOnInit() {
    this.presentingElement = document.getElementById('main-content');
    this.presentingElement = document.querySelector('.ion-page');
    
    this.loadUserData();
    this.loadCard();
    this.loadCategoria();
    this.route.queryParams.subscribe(params => {
      this.modalType = params['modalType'];
      this.id_gasto = params['id_gasto'];
      this.nombre = params['nombre'];
      this.total = params['total'];
      this.Descripcion = params['Descripcion'];
      this.fecha_compra = params['fecha_vencimiento'];
      this.id_tarjeta = params['id_tarjeta'];
      this.id_categoria = params['id_categoria'];
      this.isEditing=params['editable'];
      this.metodo = params['metodo'];
      console.log(this.modalType);
      console.log(this.id_gasto);
      console.log(this.metodo);
      // Puedes usar estos valores en tu modal según sea necesario
    });
  
     
    this.cargarFriend();
    this.mostrarLista = this.gastos.slice(0, this.cantidadVisible);
    this.route.queryParams.subscribe(params => {
      this.modalType = params['modalType'];

      // Llamar a la función para abrir el modal correspondiente
      this.openModal(this.modalType);
    });
     
  

  }

  openModal(modalType: string) {
    // Lógica para abrir el modal basado en el tipo
    if (modalType === 'modalGasto') {
      // Abre el modal de Gasto Único
      this.isModalGastoOpen = true;
      console.log('Abriendo modalGasto');
      console.log('editable2',this.isEditing)
    }else if (modalType === 'modalGastoMensual') {
      this.isModalGastoMensualOpen = true;
    } else if (modalType === 'modalGastoCuotas') {
      this.isModalGastoCuotaOpen = true;
    } else if (modalType === 'modalAhorro') {
      this.isModalAhorroOpen = true;
    } else if (modalType === 'modalAhorroMensual') {
      this.isModalAhorroMensualOpen = true;
    } else if (modalType === 'modalPrestamo') {
      this.isModalPrestamoOpen = true;
    }else if (modalType === 'modalIngreso') {
      this.isModalIngresoOpen = true;
    }else if (modalType === 'modalIngresoMensual') {
      this.isModalIngresoMensualOpen = true;
    }
    // Repite esta lógica para los demás modales
  }
  calcularTotalGastos() {
    this.totalGastos = this.gastos.reduce((sum: number, gasto: Gasto) => sum + gasto.total, 0);
  }

  
  
  onTipoChanges(event: any) {
    if (event.detail.value === 'hoy') {
      const today = new Date();
      this.fecha_compra = today.toISOString().split('T')[0]; 
      this.selectFecha = true;
       // Formato: YYYY-MM-DD
    } else if (event.detail.value === 'personalizado') {
      this.fecha = true; 
      this.selectFecha = true;
      // Muestra el campo de fecha personalizado
    }
  }

  onTipoChangesl(event: any) {
    if (event.detail.value === 'hoy') {
      const today = new Date();
      this.fecha_limite = today.toISOString().split('T')[0]; 
       // Formato: YYYY-MM-DD
      this.selectFecha2 = true;

    } else if (event.detail.value === 'personalizado') {
      this.fechaLimite = true; // Muestra el campo de fecha personalizado
      this.selectFecha2 = true;

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
  async onTipoChangeTotal(event: any) {
    if (event.detail.value > this.tarjetaSeleccionada.cantidad) {
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
  }
  onTipoChange(event: any) {
    console.log('evento',event.detail.value)
    this.tarjetaSeleccionada = this.tarjetasCredito.find((tarjeta: { id_tarjeta: any; }) => tarjeta.id_tarjeta === event.detail.value);
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
  onTarjetaChange(event: any) {
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


  onOptionChange(event: { detail: { value: any; }; }) {
    const option = event.detail.value;

    // Cerrar todos los modales antes de abrir uno nuevo
    this.closeAllModals();

    // Llamar al modal correspondiente según la opción seleccionada
    if (option === 'modalGasto') {
      this.isModalGastoOpen = true;
      console.log('editable2',this.isEditing)
    } else if (option === 'modalGastoMensual') {
      this.isModalGastoMensualOpen = true;
    } else if (option === 'modalGastoCuotas') {
      this.isModalGastoCuotaOpen = true;
    } else if (option === 'modalAhorro') {
      this.isModalAhorroOpen = true;
    } else if (option === 'modalAhorroMensual') {
      this.isModalAhorroMensualOpen = true;
    } else if (option === 'modalPrestamo') {
      this.isModalPrestamoOpen = true;
    }else if (option === 'modalIngreso') {
      this.isModalIngresoOpen = true;
    }else if (option === 'modalIngresoMensual') {
      this.isModalIngresoMensualOpen = true;
    }
  }

  // Método para cerrar todos los modales
  closeAllModals() {
    this.isModal1Open = false;
    this.isModalGastoOpen = false;
    this.isModalGastoMensualOpen = false;
    this.isModalIngresoMensualOpen = false;
    this.isModalIngresoOpen = false;
    this.isModalAhorroMensualOpen=false;
    this.isModalAhorroOpen=false;

    this.isModal2Open = false;
    this.isModal3Open = false;
    
  }

  // Método para cerrar un modal específico
  closeModal(modal: { dismiss: () => void; }) {
    modal.dismiss(); // Cierra el modal
    this.navController.back(); // Navega de regreso a la página anterior
  }
  
async addAhorro(tipo:string){
  const nuevoAhorro = {
    nombre:this.nombre,
    total:this.totalAhorrar,
    total_alcanzar:this.total_alcanzar,
    descripcion:this.Descripcion,
    fecha:this.fecha_compra,
    fecha_limite:this.fecha_limite,
    id_tarjeta:this.id_tarjeta,
    id_categoria:this.id_categoria,
    usuario: this.persona.username,
    tipo:tipo,
    
  };

  if (!this.nombre || !this.totalAhorrar ||  !this.Descripcion ||  !this.fecha_compra || !this.total_alcanzar || !this.fecha_limite ||
    !this.id_tarjeta ||!this.id_categoria || !this.persona.username ||!tipo
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
 }if (this.total > this.tarjetaSeleccionada.cantidad) {
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
  console.log(this.persona.username)
  console.log(this.tipo)
  console.log(this.nombre)
  console.log(nuevoAhorro)

  this.backendService.addAhorro(nuevoAhorro).subscribe({
    next: response => {
      console.log('ahorro agregado', response);
      this.setOpen(false)
      this.navController.back(); // Navega hacia atrás
      setTimeout(() => {
        if(this.persona){
          //window.location.reload(); 
          this.router.navigate(['/index/index']).then(() => {
            // Recarga la página una vez se complete la navegación
            location.reload();
          });
      // Recarga la página después de navegar
      }
      }, 100);
    },
    error: err => {
      console.error('Error al agregar gasto', err);
    }
  });
}

async addPrestamo() {
  
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
      id_tarjeta: this.id_tarjeta,
      friend_name:this.friend_username,
      descripcion: this.Descripcion,
      nombre: this.nombre,
      correo:this.correo,
      total: this.total,
      total_pagado:this.total_pagado,
      fecha_compra: this.fecha_compra,
      fecha_limite:this.fecha_limite
    };
    if ( !this.id_categoria || !this.id_tarjeta ||!this.friend_username ||!this.Descripcion
      ||!this.nombre ||!this.correo||!this.total ||!this.total_pagado ||!this.fecha_compra ||!this.fecha_limite
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
   }if (this.total > this.tarjetaSeleccionada.cantidad) {
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
    console.log(this.id_tarjeta)

    console.log('Nueva deuda:', nuevaDeuda);

    this.backendService.addPrestamo(nuevaDeuda).subscribe({
      next: response => {
        console.log('Prestamo agregada', response);
        this.setOpen(false);
        this.navController.back();
        setTimeout(() => {
          if(this.persona){
            this.router.navigate(['/index/index']).then(() => {
              // Recarga la página una vez se complete la navegación
              location.reload();
            });

        }
        }, 100);
      },
      error: err => {
        console.error('Error al agrega el Prestamo', err);
      }
    });
  
}
  async addGasto(tipo:string){
            // Llama al método para agregar un nuevo gasto
      
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
      
      if (!this.nombre || !this.total ||  !this.Descripcion ||  !this.fecha_compra ||
         !this.id_tarjeta ||!this.id_categoria || !this.persona.username ||!tipo
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
      }if (this.total > this.tarjetaSeleccionada.cantidad) {
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
      if(this.total <= this.tarjetaSeleccionada.cantidad){
        this.backendService.addGasto(nuevaTarjeta).subscribe({
          next: response => {
            console.log('Deuda agregada', response);
            this.setOpen(false);
            setTimeout(() => {
              if(this.persona){
                this.router.navigate(['/cuentas/gastos']).then(() => {
                  // Recarga la página una vez se complete la navegación
                  location.reload();
                });
    
            }
            }, 100);
          },
          error: err => {
            console.error('Error al agregar la deuda', err);
          }
        });
      }
  }
async  addIngreso(tipo:any){
            // Llama al método para agregar un nuevo gasto
      
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

            if (!this.nombre || !this.total ||  !this.Descripcion ||  !this.fecha_compra ||
              !this.id_tarjeta ||!this.id_categoria || !this.persona.username ||!tipo
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
           }if (this.total > this.tarjetaSeleccionada.cantidad) {
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
            console.log(this.persona.username)
            console.log(this.tipo)
            console.log(this.nombre)
            console.log(nuevaTarjeta)
          
            this.backendService.addIngreso(nuevaTarjeta).subscribe({
              next: response => {
                console.log('Deuda agregada', response);
                this.setOpen(false);
                setTimeout(() => {
                  if(this.persona){
                    this.router.navigate(['/cuentas/gastos']).then(() => {
                      // Recarga la página una vez se complete la navegación
                      location.reload();
                    });

                }
                }, 100);
              },
      error: err => {
        console.error('Error al agregar la deuda', err);
      }
    });
    
  }

async  addDeuda() {
   

      console.log('Fecha de compra:', this.fecha_compra);
  
      // Si la fecha de compra está vacía, asigna 'hoy' como valor por defecto
      if (this.fecha_compra === '') {
        this.fecha_compra = 'hoy';
      }
      if(!this.cantidadCuotasPagadas){
        this.cantidadCuotasPagadas = 0;
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

  

      if (!this.id_categoria ||!this.id_tarjeta_pagar ||!this.id_tarjeta ||!this.Descripcion
        ||!this.nombre ||!this.totalCuotas ||!this.cantidadCuotas ||!this.fecha_compra ||!this.valorCuota
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
     }if (this.totalCuotas > this.tarjetaSeleccionada.cantidad) {
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
      console.log('Nueva deuda:', nuevaDeuda);
      if (this.totalCuotas < this.tarjetaSeleccionada.cantidad) {
        this.backendService.addDeuda(nuevaDeuda).subscribe({
          next: response => {
            console.log('Deuda agregada', response);
            this.setOpen(false);
            setTimeout(() => {
              if(this.persona){
                this.router.navigate(['/cuentas/gastos']).then(() => {
                  // Recarga la página una vez se complete la navegación
                  location.reload();
                });

            }
            }, 100);
          },
          error: err => {
            console.error('Error al agregar la deuda', err);
          }
          });
      }
    
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
         
        }
      },
      error: err => {
        console.error('Error al cargar gastos:', err);
        loading.dismiss();
      }
    });
  }
  
  
  filtrarGastos() {
    if (this.id_tarjeta) {
      console.log(this.gastosOriginales)
      console.log(this.id_tarjeta)
      this.gastosOriginales.forEach(gasto => {
        console.log('ID de tarjeta del gasto:', gasto.id_tarjeta);
      });
     
      this.gastos = this.gastosOriginales.filter(gasto => gasto.id_tarjeta === this.id_tarjeta);
      console.log(this.gastos)
    } else {
      
      this.gastos = [...this.gastosOriginales];
    }
    
  }
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
          
          this.gastos = response.gastos;  
          console.log('gastos cargadas:', this.gastos);
          loading.dismiss();
          this.reloadPage();
        }
      },
      error: err => {
        console.error('Error al cargar gastos:', err);
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
            console.log(this.tarjetasCredito);
            

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

   editar(gasto?: any) {
    if (this.metodo === 'gasto') {
      this.isEditing = true; 
      this.selectedGasto = gasto; 
      
      this.id_gasto=gasto.id_gasto
      this.nombre = gasto.nombre;
      this.total = gasto.total;
      this.Descripcion = gasto.descripcion;
      this.fecha = gasto.fecha_vencimiento;
      this.id_tarjeta = gasto.id_tarjeta;
      this.id_categoria = gasto.id_categoria;

      console.log(this.fecha)
      console.log(this.id_categoria)
      console.log(gasto.id_categoria)
      console.log(this.Descripcion)
      console.log(gasto.descripcion)
      console.log(gasto.fecha_ingreso)
      console.log(gasto.metodo)
      console.log('este es el gasto cargado',gasto)

    }if(this.metodo === 'ingreso'){
      this.isEditing = true; 
      this.selectedGasto = gasto; 
      
      this.id_ingreso=gasto.id_gasto
      this.nombre = gasto.nombre;
      this.total = gasto.total;
      this.Descripcion = gasto.descripcion;
      this.fecha = gasto.fecha_vencimiento;
      this.id_tarjeta = gasto.id_tarjeta;
      this.id_categoria = gasto.id_categoria;

      console.log(this.fecha)
      console.log(this.id_categoria)
      console.log(gasto.id_categoria)
      console.log(this.Descripcion)
      console.log(gasto.descripcion)
      console.log(gasto.fecha_ingreso)
      console.log(gasto.metodo)
      console.log('este es el gasto cargado',gasto)
    }
     else {
     
      this.isEditing = false; 
      this.selectedGasto = null;
     
      this.nombre = '';
      this.total = 0;
      this.Descripcion = '';
      this.fecha_compra = '';
      this.id_tarjeta = 0;
      this.id_categoria = 0;
    }
  
    this.setOpen(true); 
  }
  

   setOpen(isOpen: boolean) {
    this.isModalGastoOpen = isOpen;
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
  
  async actualizar() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...',
    });
    await loading.present();

    const nuevaTarjeta = {
      id_gasto: this.id_gasto,
      nombre: this.nombre,
      total: this.total,
      descripcion: this.Descripcion,
      fecha_compra: this.fecha_compra,
      id_tarjeta: this.id_tarjeta,
      id_categoria: this.id_categoria,
      usuario: this.persona.username,
      caracteristica:'si'
    };

    if (!this.id_gasto ||!this.nombre ||!this.total ||!this.Descripcion ||!this.fecha_compra ||!this.id_tarjeta
      ||!this.id_categoria 
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
   }

    console.log(nuevaTarjeta);
    if(this.metodo === 'gasto' ){
      if (this.total > this.tarjetaSeleccionada.cantidad) {
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
      if(this.total < this.tarjetaSeleccionada.cantidad){
        this.backendService.uptGasto(nuevaTarjeta).subscribe({
          next: response => {
            console.log('Deuda agregada', response);
            this.setOpen(false);
            setTimeout(() => {
              if(this.persona){
                this.router.navigate(['/cuentas/gastos']).then(() => {
                  // Recarga la página una vez se complete la navegación
                  location.reload();
                });
    
            }
            }, 100);
          },
          error: err => {
            console.error('Error al agregar la deuda', err);
          }
        });
      }
      
    }if(this.metodo === 'ingreso'){
      this.backendService.uptIngreso(nuevaTarjeta).subscribe({
        next: response => {
          console.log('ingreso agregada', response);
          this.setOpen(false);
          setTimeout(() => {
            if(this.persona){
              this.router.navigate(['/cuentas/ingresos']).then(() => {
                // Recarga la página una vez se complete la navegación
                location.reload();
              });
  
          }
          }, 100);
        },
        error: err => {
          console.error('Error al agregar la deuda', err);
        }
      });
    }if(this.metodo === 'ahorro' && this.total < this.tarjetaSeleccionada.cantidad){
      this.backendService.uptAhorro(nuevaTarjeta).subscribe({
        next: response => {
          console.log('ahorro actualizado', response);
          this.setOpen(false);
          setTimeout(() => {
            if(this.persona){
              this.router.navigate(['/cuentas/ahorros']).then(() => {
                // Recarga la página una vez se complete la navegación
                location.reload();
              });
  
          }
          }, 100);
        },
        error: err => {
          console.error('Error al agregar la deuda', err);
        }
      });
    }
    
  }



  reloadPage(){
    window.location.reload();
  }
}
