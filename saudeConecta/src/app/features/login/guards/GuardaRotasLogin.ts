
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LoginService } from "../../../service/service-login/login.service";
import { tokenService } from "src/app/util/Token/Token.service";;




@Injectable({ providedIn: 'root' })
export class GuardaRotasLogin {

  private lastUrl!: string

  constructor(
    private login: LoginService,
    private router: Router,
    private tokenService: tokenService ,

     ) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.lastUrl = event.urlAfterRedirects;
        }
      });
     }




     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {


      const isUsuarioLogado = this.tokenService.possuiToken();

      if (isUsuarioLogado && this.lastUrl==='/Dashboard') {
        return this.router.parseUrl('/Dashboard');
      }

      if(isUsuarioLogado ) {
        return this.router.parseUrl('/Dashboard');
      }


      // if (isUsuarioLogado && this.lastUrl==='/cadastroadmin') {
      //   console.log('3');
      //   // Se o usuário estiver logado e tentar acessar a rota de cadastro, redirecione-o para a página inicial
      //   return true
      // }

      // if (!isUsuarioLogado && !state.url.includes('cadastroadmin')) {
      //   console.log('4');
      //   // Se o usuário não estiver logado e tentar acessar uma rota diferente de cadastroadmin, redirecione-o para a página de login
      //   return this.router.parseUrl('/login');
      // }

      // Permita o acesso para todas as outras situações
      return true;
    }
}

