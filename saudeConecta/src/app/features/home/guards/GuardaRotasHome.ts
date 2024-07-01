import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LoginService } from "src/app/service/service-login/login.service";
import { tokenService } from "src/app/util/Token/Token.service";


@Injectable({ providedIn: 'root' })
export class GuardaRotasHome {

  constructor(private login: LoginService, private router: Router, private tokeService: tokenService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {

    if (!this.login.estaLogado()) {
      this.handleUnauthorizedAccess();
      this.router.navigate(['']);
      return false
      // *! - Quando o usuario tenta acessa '/home' sem -> credencias validas (login+senha) || O Codigo de verificação de 2Fatores valido || O token valido
      // *! - Quando isso acontece o usuario é redirecionado para à tela de login, por guarantia é usado o método de deslogar para quando voltar a tela de login
      // *! - volta os padroes originais.
    }
    else if (this.login.estaLogado() && this.tokeService.getAuthTwof()) {
      return true;
    }
    // *! - Qualquer outra acesso é retornado a tela de login
    this.handleUnauthorizedAccess();
    return this.router.createUrlTree(['']); // Retorna a UrlTree para redirecionamento à tela de login
  }

  private handleUnauthorizedAccess(): void {
    this.login.deslogar();
    alert('Sua sessão expirou. Faça login novamente.');
  }
}
