import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectiontranslanderComponent } from './collectiontranslander.component';

describe('CollectiontranslanderComponent', () => {
  let component: CollectiontranslanderComponent;
  let fixture: ComponentFixture<CollectiontranslanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectiontranslanderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectiontranslanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
