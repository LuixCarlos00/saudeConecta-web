/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AtestadoComponent } from './atestado.component';

describe('AtestadoComponent', () => {
  let component: AtestadoComponent;
  let fixture: ComponentFixture<AtestadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtestadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtestadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
