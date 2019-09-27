import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QRCodePage } from './qrcode.page';

describe('QRCodePage', () => {
  let component: QRCodePage;
  let fixture: ComponentFixture<QRCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QRCodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QRCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
