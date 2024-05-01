import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginModule } from './features/login/login_Module/login.module';
import { PacienteModule } from './paciente_Module/paciente.module';
import { UtilModule } from './util/util/util.module';
import { RodapeComponent } from './util/variados/rodape/rodape.component';
import { CabecalhoComponent } from './util/variados/cabecalho/cabecalho.component';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';



@NgModule({
  declarations: [
    AppComponent,
    RodapeComponent,
    CabecalhoComponent

  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    LoginModule,
    PacienteModule,
    UtilModule,
    MatIconModule,
    MatToolbarModule







  ],
  providers: [ provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
