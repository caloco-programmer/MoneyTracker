import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import{TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  darkMode: boolean = false;
  selectedDate: string = new Date().toISOString();
  automaticReports: boolean = false;
  emailPredictions: boolean = false;
  isPrivacyExpanded: boolean = false;


  openPrivacyPolicy() {
    // Implementar la lógica para abrir las políticas de privacidad
    // Por ejemplo, navegar a una nueva página o abrir un modal
    console.log('Abrir políticas de privacidad');
  }

  langs: string[] = [];

  isDarkMode = false;

  

 
  constructor(
    private modalController: ModalController,
    private translateService: TranslateService,
    
  ) {
    const prefersDark = localStorage.getItem('dark-mode') === 'true';
    this.isDarkMode = prefersDark;
    document.body.classList.toggle('dark-theme', prefersDark);
   }

  ngOnInit() {
    // Previous initialization code remains the same
    const savedTheme = localStorage.getItem('darkMode');
    this.darkMode = savedTheme === 'true';
    this.applyTheme();
    this.langs = this.translateService.getLangs();
  }

  changeCurrency(event: any) {
    const selectedCurrency = event.detail.value;
    localStorage.setItem('selectedCurrency', selectedCurrency); // Guardar la moneda seleccionada en localStorage
  }

  // Método para obtener la moneda almacenada
  getSelectedCurrency() {
    return localStorage.getItem('selectedCurrency') || 'CLP'; // Devuelve 'CLP' por defecto si no hay moneda almacenada
  }
  getSelectedLanguaje() {

    return localStorage.getItem('language') ;
     // Devuelve 'CLP' por defecto si no hay moneda almacenada
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('dark-mode', this.isDarkMode.toString());
  }
  changeLang(event: any) {
    const selectedLanguage = event.detail.value;
    this.translateService.use(selectedLanguage);
    localStorage.setItem('language', selectedLanguage); // Guarda el idioma en localStorage
    console.log(selectedLanguage);
  }
  // Previous methods remain the same
  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  applyTheme() {
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  // Nuevos métodos para manejar las políticas de privacidad
  togglePrivacyPolicy() {
    this.isPrivacyExpanded = !this.isPrivacyExpanded;
  }

  async openFullPrivacyPolicy() {
    // Aquí puedes implementar la lógica para abrir la versión completa
    // Por ejemplo, abrir un modal o navegar a una nueva página
    // window.open('URL_DE_TUS_POLITICAS', '_blank');
    // O navegar dentro de la app:
    // this.router.navigate(['/full-privacy-policy']);
  }

}
