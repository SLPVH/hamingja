import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsPage } from './funds.page';

describe('FundsPage', () => {
  let component: FundsPage;
  let fixture: ComponentFixture<FundsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
