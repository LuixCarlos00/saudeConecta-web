import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GerenciamentoUsuariosService {



private RadioValueSubject = new BehaviorSubject<number>(1);
RadioValue$ = this.RadioValueSubject.asObservable();


private searchTextSubject = new BehaviorSubject<string>('');
searchText$ = this.searchTextSubject.asObservable();

constructor() { }



changeSearchTextSubject(searchText: string) {
this.searchTextSubject.next(searchText);}


changeRadioValueSubject(radioValue: number) {
this.RadioValueSubject.next(radioValue);}
}
