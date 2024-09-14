import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

private apiUrl = 'http://localhost:8080'
private ngGrok = 'https://db3a-138-94-207-94.ngrok-free.app'

constructor() { }



getUrl(){
  return this.ngGrok
}



}
