import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login.component';
import { RouterLink } from '@angular/router';



@NgModule({
  imports: [

    CommonModule
  ],
  declarations: [
    LoginComponent,

  ],
  exports:[ ],

})
export class LoginModule { }
