import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { IdentifyPage } from './identify.page';

describe('IdentifyPage', () => {
  let component: IdentifyPage;
  let fixture: ComponentFixture<IdentifyPage>;
  let identifyPage: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdentifyPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = await TestBed.createComponent(IdentifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a identify of 10 elements', () => {
    identifyPage = fixture.nativeElement;
    const items = identifyPage.querySelectorAll('ion-item');
    expect(items.length).toEqual(10);
  });
});
