import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { LoginService } from 'src/app/service/service-login/login.service';
import { tokenService } from 'src/app/util/Token/Token.service';


@Injectable({ providedIn: 'root' })
export class GuardaRotasCadastraUsuario {
  constructor(
    private login: LoginService,
    private router: Router,
    private tokeService: tokenService
  ) {}
  canActivate(state: RouterStateSnapshot): boolean {
    const rotaAnterior = state?.url;


    // Se a rota anterior for vazia (ou seja, se veio de login) e não houver token, permite o acesso
    if (!rotaAnterior && !this.tokeService.possuiToken()) {
       return true;
    }

    // Se a rota anterior for 'cadastro' e não houver token, desloga e redireciona para a tela de login
    if (rotaAnterior.includes('cadastro') && !this.tokeService.possuiToken()) {
       this.login.deslogar();
      this.router.navigate(['']);
      return false;
    }

    // Se não houver token, redireciona para a tela de login
    if (!this.tokeService.possuiToken()) {
       return true;
    }

    if (this.tokeService.possuiToken()) {
      return true;
    }

    // Caso contrário, não permite o acesso
     return false;
  }


}
