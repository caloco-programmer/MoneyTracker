import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { SesionService, User } from '../services/sesion.service';
import { BackendService } from '../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {
  searchTerm: string = '';
  selectedIcon: string = '';
  isModalOpen = false;
  mostrarEliminarIconos: boolean = false;
  expandedId: string | null = null;
  presentingElement: HTMLElement | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
  selectedChartType: ChartType = 'bar';
  chart: any;
  public persona: any;
  categoria: string = '';
  imagen: File | null = null;
  cantidad: any;
  public categorias: any[] = [];
  selectedOption: string = '';
  customInput: string = '';
  id_categoria: number = 0;
  imagePreview: string | ArrayBuffer | null = null;
  iconos: any[] = [];
  filteredIcons: any[] = [];

  constructor(
    private backendService: BackendService,
    private sesionService: SesionService,
    private router: Router,
    private loadingController: LoadingController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.presentingElement = document.querySelector('.ion-page');
  }

  ngOnInit() {
    this.loadUserData();
    this.loadCategoria();
    this.loadIconos();
  }

  async loadIconos() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos...'
    });
    await loading.present();

    this.backendService.getIcon(this.persona).subscribe({
      next: response => {
        if (response.status === 'success') {
          this.iconos = response.iconos;
          this.filteredIcons = [...this.iconos];
          console.log('Iconos cargados:', this.iconos);
        }
        loading.dismiss();
      },
      error: err => {
        console.error('Error al cargar iconos:', err);
        loading.dismiss();
      }
    });
  }

  // Resto de tus métodos existentes...

  mostrar() {
    this.setOpen(true);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    if (!isOpen) {
      this.resetForm();
    }
  }

  filterIcons() {
    if (!this.searchTerm) {
      this.filteredIcons = [...this.iconos];
    } else {
      this.filteredIcons = this.iconos.filter(icon => 
        icon.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectIcon(iconName: string) {
    this.selectedIcon = iconName;
  }

  isFormValid(): boolean {
    return !!(this.categoria && this.selectedIcon && this.persona?.username);
  }

  resetForm() {
    this.categoria = '';
    this.searchTerm = '';
    this.selectedIcon = '';
    this.imagen = null;
    this.imagePreview = null;
  }

  addCategoria() {
    if (!this.isFormValid()) {
      return;
    }

    const nuevaCategoria = {
      categoria: this.categoria,
      nombre:this.selectedIcon,
      usuario:this.persona.username
    };
    console.log(nuevaCategoria)

    this.backendService.addCategoria(nuevaCategoria).subscribe({
      next: response => {
        console.log('Categoría agregada:', response);
        this.setOpen(false);
        this.loadCategoria(); // En lugar de recargar la página, solo recargamos las categorías
      },
      error: err => {
        console.error('Error al agregar categoría:', err);
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
          // Almacena las categorías que se devuelven desde el backend
          this.categorias = response.categorias;  // Asegúrate de usar 'categorias' en lugar de 'tarjetas'
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
  

  reloadPage() {
    window.location.reload();
  }



async eliminar_cat(id_categoria: number){
  const loading = await this.loadingController.create({
    message: 'Cargando datos...'
  });
  console.log(id_categoria);
  
  await loading.present();
  
  console.log(this.persona);
  await this.backendService.delete_categoria(id_categoria).subscribe({
    next: response => {
      if (response.status === 'success') {
        // Almacena las categorías que se devuelven desde el backend
        this.categorias = response.categorias;  // Asegúrate de usar 'categorias' en lugar de 'tarjetas'
        console.log('Categorías cargadas:', this.categorias);
        loading.dismiss();
        this.reloadPage();
      }
    },
    error: err => {
      console.error('Error al cargar categorías:', err);
      loading.dismiss();
    }
  });
  
 
}
async eliminar_icon(id_icon: number){
  const loading = await this.loadingController.create({
    message: 'Cargando datos...'
  });
  console.log(id_icon);
  
  await loading.present();
  
  console.log(this.persona);
  await this.backendService.delete_icon(id_icon).subscribe({
    next: response => {
      if (response.status === 'success') {
        // Almacena las categorías que se devuelven desde el backend
        this.iconos = response.iconoss;  // Asegúrate de usar 'categorias' en lugar de 'tarjetas'
        console.log('Categorías cargadas:', this.iconos);
        loading.dismiss();
        this.loadIconos();
      }
    },
    error: err => {
      console.error('Error al cargar categorías:', err);
      loading.dismiss();
    }
  });
  
 
}
eliminar() {
  this.mostrarEliminarIconos = !this.mostrarEliminarIconos; // Cambia el estado al presionar "eliminar"
}

}
  
