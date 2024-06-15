/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Template_PDF_ConcluidosComponent } from './template_PDF_Concluidos.component';

describe('Template_PDF_ConcluidosComponent', () => {
  let component: Template_PDF_ConcluidosComponent;
  let fixture: ComponentFixture<Template_PDF_ConcluidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Template_PDF_ConcluidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Template_PDF_ConcluidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
