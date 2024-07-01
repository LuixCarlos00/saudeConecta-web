import { LoginService } from 'src/app/service/service-login/login.service';

import { Component, HostListener } from '@angular/core';
import { tokenService } from './util/Token/Token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  title = 'saudeConecta';

  clicou: boolean = false;

  constructor(
    private tokenService: tokenService,
    private loginService: LoginService
  ) {}

  estaLogado(): any {
    if (this.loginService.estaLogado() && this.tokenService.getAuthTwof()) {
      return true;
    } else {
      return false;
    }
  }


  toggleNav(event: MouseEvent) {
    this.clicou = !this.clicou;
    event.stopPropagation(); // Prevent the click event from bubbling up to the document click listener
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.clicou) {
      this.clicou = false;
    }
  }

  closeSidebar(event: MouseEvent) {
    // This function will only be triggered if the click is outside the sidebar-container
    if (this.clicou) {
      this.clicou = false;
    }
  }


}
