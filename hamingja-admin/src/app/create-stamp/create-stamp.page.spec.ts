import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStampPage } from './create-stamp.page';

describe('CreateStampPage', () => {
  let component: CreateStampPage;
  let fixture: ComponentFixture<CreateStampPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateStampPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
