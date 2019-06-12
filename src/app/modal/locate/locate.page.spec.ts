import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocatePage } from './locate.page';

describe('LocatePage', () => {
  let component: LocatePage;
  let fixture: ComponentFixture<LocatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
