import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStampsPage } from './add-stamps.page';

describe('AddStampsPage', () => {
  let component: AddStampsPage;
  let fixture: ComponentFixture<AddStampsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStampsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStampsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
