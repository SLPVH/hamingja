import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanQRPage } from './scan-qr.page';

describe('ScanQRPage', () => {
  let component: ScanQRPage;
  let fixture: ComponentFixture<ScanQRPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanQRPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanQRPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
