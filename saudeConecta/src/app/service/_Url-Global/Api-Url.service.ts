import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

private apiUrl = 'http://localhost:8080'
private ngGrok = 'https://3ba9-45-5-168-60.ngrok-free.app'

constructor() { }



getUrl(){
  return this.apiUrl
}



}
