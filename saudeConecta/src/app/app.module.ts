import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginModule } from './features/login/login_Module/login.module';
import { PacienteModule } from './features/paciente_Module/paciente.module';
import { UtilModule } from './util/util/util.module';
//import { JWT_OPTIONS, JwtHelperService, JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    LoginModule,
    PacienteModule,
    UtilModule,






  ],
  providers: [ provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
