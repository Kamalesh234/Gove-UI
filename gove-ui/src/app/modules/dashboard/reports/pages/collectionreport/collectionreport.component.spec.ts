import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionreportComponent } from './collectionreport.component';

describe('CollectionreportComponent', () => {
  let component: CollectionreportComponent;
  let fixture: ComponentFixture<CollectionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
