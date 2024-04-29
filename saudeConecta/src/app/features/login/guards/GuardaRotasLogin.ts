
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LoginService } from "../../../service/service-login/login.service";
import { tokenService } from "src/app/util/Token/token.service";




@Injectable({ providedIn: 'root' })
export class GuardaRotasLogin {

  constructor(private login: LoginService, private router: Router, private tokeService: tokenService) {}



  canActivate( state: RouterStateSnapshot): boolean {

    const rotaAnterior = state?.url;


    if (!this.tokeService.possuiToken()) {
      // Sem token de autenticação, permita o acesso
      return true;
    }

    console.log('Bloquear acesso.');
    return false;

  }

}

