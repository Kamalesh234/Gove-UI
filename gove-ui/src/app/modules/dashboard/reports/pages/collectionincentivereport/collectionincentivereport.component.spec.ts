import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionincentivereportComponent } from './collectionincentivereport.component';

describe('CollectionincentivereportComponent', () => {
  let component: CollectionincentivereportComponent;
  let fixture: ComponentFixture<CollectionincentivereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionincentivereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectionincentivereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
