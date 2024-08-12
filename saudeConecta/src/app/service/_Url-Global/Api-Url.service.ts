import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

private apiUrl = 'http://localhost:8080'
private ngGrok = 'https://99e9-168-194-195-84.ngrok-free.app'

constructor() { }



getUrl(){
  return this.apiUrl
}



}
