import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampsPage } from './stamps.page';

describe('StampsPage', () => {
  let component: StampsPage;
  let fixture: ComponentFixture<StampsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
