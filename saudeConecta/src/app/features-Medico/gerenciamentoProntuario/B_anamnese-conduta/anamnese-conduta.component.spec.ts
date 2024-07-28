/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AnamneseCondutaComponent } from './anamnese-conduta.component';

describe('AnamneseCondutaComponent', () => {
  let component: AnamneseCondutaComponent;
  let fixture: ComponentFixture<AnamneseCondutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnamneseCondutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnamneseCondutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
