import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from 'src/app/service/_Url-Global/Api-Url.service';
import { tokenService } from '../Token/Token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: tokenService,
    private apiUrlService: ApiUrlService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.retornaToken();

    const clonedRequest = req.clone({
      withCredentials: true,
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next.handle(clonedRequest);
  }
}
