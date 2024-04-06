
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LoginService } from "src/app/features/login/service/login.service";

import { tokenService } from "src/app/util/Token/token.service";




@Injectable({ providedIn: 'root' })
export class GuardaRotasCadastra {

  constructor(private login: LoginService, private router: Router, private tokeService: tokenService) {

  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

    const Token: string | null = this.tokeService.retornaToken();
    // todo - 1
    if (!this.login.estaLogado()) {
      // *! - O usuario possui um token expirado, e ele volta para login
      this.login.deslogar();
      return true;
    }
    // todo - 3
    else if (this.login.estaLogado() && this.tokeService.getAuthTwof()) {
      this.router.navigate(['Home'])//tela da Area de Trabalho
      return false
      // *! - O usuario esta logado? Ele possui o token? As credencias sao validas? Se sim. ele deve ficar em '/home'
      // *! - Se mesmo assim quiser volar para tela de login . NAO é permitido, Somente é permitido quando as credencias forem invalidas, token nao for mais validos.
    } else
      this.login.deslogar();
    return this.router.createUrlTree(['']);
    // *! - Qualquer outra acesso é retornado a tela de login
  }


}

