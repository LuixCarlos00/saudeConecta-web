import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginModule } from './features/login/login_Module/login.module';
import { PacienteModule } from './Module/paciente.module';
import { UtilModule } from './util/util/util.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginComponent } from './features/login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BarraLateraComponent } from './util/variados/barra-Latera/barra-Latera.component';
import { NgChartsModule } from 'ng2-charts';
import { QuillModule } from 'ngx-quill';
 import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgrokInterceptor } from './util/variados/interceptor\'s/ngGrok.service';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [AppComponent, LoginComponent, BarraLateraComponent],
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
    NgChartsModule,
    MatBadgeModule

  ],
  providers: [provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: NgrokInterceptor , multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
