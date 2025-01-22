import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from "@angular/platform-browser-dynamic/testing";
import {AccessDeniedComponent} from "./access-denied.component";

/**
 * Unit Test Cases for Access Denied
 */
describe('AccessDeniedComponent', ()=>{
  let component:AccessDeniedComponent;
  let fixture:ComponentFixture<AccessDeniedComponent>;

  beforeEach(async () => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment([BrowserDynamicTestingModule], platformBrowserDynamicTesting());

    await TestBed.configureTestingModule({
      declarations:[AccessDeniedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
  });

   afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

   it('should create', () => {
    expect(component).toBeTruthy();
  });
});
