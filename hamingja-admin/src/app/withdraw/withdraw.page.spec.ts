import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawPage } from './withdraw.page';

describe('WithdrawPage', () => {
  let component: WithdrawPage;
  let fixture: ComponentFixture<WithdrawPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
