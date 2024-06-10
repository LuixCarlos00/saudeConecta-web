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

import {MatToolbarModule} from '@angular/material/toolbar';
import { LoginComponent } from './features/login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    AppComponent,
    RodapeComponent,
    CabecalhoComponent,
    LoginComponent

  ],
  imports: [

    BrowserModule,
    AppRoutingModule,
    LoginModule,
    PacienteModule,
    UtilModule,
    MatIconModule,
    MatToolbarModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,






  ],

  providers: [ provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
