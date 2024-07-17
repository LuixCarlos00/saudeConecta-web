import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

private apiUrl = 'http://localhost:8080'
private ngGrok = 'https://f624-168-194-194-201.ngrok-free.app'

constructor() { }



getUrl(){
  return this.apiUrl
}



}
