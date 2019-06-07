import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { NewBladePage } from './new-blade.page';

describe('NewBladePage', () => {
  let component: NewBladePage;
  let fixture: ComponentFixture<NewBladePage>;
  let newBladePage: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewBladePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = await TestBed.createComponent(NewBladePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a identify of 10 elements', () => {
    newBladePage = fixture.nativeElement;
    const items = newBladePage.querySelectorAll('ion-item');
    expect(items.length).toEqual(10);
  });
});
