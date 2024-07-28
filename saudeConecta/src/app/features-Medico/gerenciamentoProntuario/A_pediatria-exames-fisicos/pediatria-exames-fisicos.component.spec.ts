/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PediatriaExamesFisicosComponent } from './pediatria-exames-fisicos.component';

describe('PediatriaExamesFisicosComponent', () => {
  let component: PediatriaExamesFisicosComponent;
  let fixture: ComponentFixture<PediatriaExamesFisicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PediatriaExamesFisicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PediatriaExamesFisicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
