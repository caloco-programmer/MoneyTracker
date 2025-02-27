import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  private tutorialKey = 'hasSeenTutorial';

  constructor() {}

  // Marcar el tutorial como visto
  markTutorialAsSeen() {
    localStorage.setItem(this.tutorialKey, 'true');
  }

  // Verificar si el tutorial ya fue visto
  hasSeenTutorial(): boolean {
    return localStorage.getItem(this.tutorialKey) === 'true';
  }
}
