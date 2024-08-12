/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DadosPessoaisComponent } from './DadosPessoais.component';

describe('DadosPessoaisComponent', () => {
  let component: DadosPessoaisComponent;
  let fixture: ComponentFixture<DadosPessoaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DadosPessoaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosPessoaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
