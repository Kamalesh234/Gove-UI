import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpareportComponent } from './npareport.component';

describe('NpareportComponent', () => {
  let component: NpareportComponent;
  let fixture: ComponentFixture<NpareportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpareportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NpareportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
