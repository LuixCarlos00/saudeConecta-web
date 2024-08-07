import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

private apiUrl = 'http://localhost:8080'
private ngGrok = 'https://b7e3-45-235-35-231.ngrok-free.app'

constructor() { }



getUrl(){
  return this.apiUrl
}



}
