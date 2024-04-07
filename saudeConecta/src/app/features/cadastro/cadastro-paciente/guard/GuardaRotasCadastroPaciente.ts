import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { LoginService } from "src/app/features/login/service/login.service";
import { tokenService } from "src/app/util/Token/token.service";


@Injectable({ providedIn: 'root' })
export class GuardaRotasCadastroPaciente {
  constructor(private login: LoginService,private router: Router,private tokeService: tokenService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree  {
    if (this.login.pussuiToken()) {

      return true
    }else
   return false
  }
}
