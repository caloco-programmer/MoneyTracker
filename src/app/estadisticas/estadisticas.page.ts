import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {
  mostrarEliminarIconos: boolean = false; 
  isModalOpen = false;
  presentingElement: HTMLElement | null = null;
  constructor() {}

  ngOnInit() {
    this.presentingElement = document.getElementById('main-content');
  }
  expandedId: string | null = null;
  cuentaSeleccionada: string | null = null;
  muestraId: string | null = null;

  onCuentaChange(event: any) {
    this.cuentaSeleccionada = event.detail.value; // Actualiza la cuenta seleccionada
  }
  toggleContent(id: string) {
    if (this.expandedId === id) {
      this.expandedId = null; // Colapsa si ya está abierto
    } else {
      this.expandedId = id; // Expande el div con el id recibido
    }
  }
   // Variable para controlar la apertura del modal

  // Función para mostrar el moda
  
  // Función que se ejecuta cuando se presiona el botón "Aceptar"
  aceptarDescarga() {
    console.log('Descarga aceptada');
    this.setOpen(false); // Cierra el modal después de aceptar
  }

  eliminar() {
    this.mostrarEliminarIconos = !this.mostrarEliminarIconos; // Cambia el estado al presionar "eliminar"
  }
mostrar() {
   // here you can check your parameter
    
       this.setOpen(true);
    
  }
      setOpen(isOpen: boolean) {
        this.isModalOpen = isOpen;
      }

}
