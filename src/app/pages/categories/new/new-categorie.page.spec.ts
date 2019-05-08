import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NewCategoriePage } from './new-categorie.page';

describe('NewCategoriePage', () => {
  let component: NewCategoriePage;
  let fixture: ComponentFixture<NewCategoriePage>;
  let newCategoriePage: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewCategoriePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = await TestBed.createComponent(NewCategoriePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a identify of 10 elements', () => {
    newCategoriePage = fixture.nativeElement;
    const items = newCategoriePage.querySelectorAll('ion-item');
    expect(items.length).toEqual(10);
  });
});
