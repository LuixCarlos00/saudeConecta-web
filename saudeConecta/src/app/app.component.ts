import { LoginService } from 'src/app/service/service-login/login.service';
import { tokenService } from 'src/app/util/Token/token.service';
import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'saudeConecta';

constructor(private tokenService: tokenService, private loginService : LoginService) {

  }

  estaLogado(): any {
     if(this.loginService.estaLogado() && this.tokenService.getAuthTwof()){
      return true
    }else{
      return false
    }
  }

}
