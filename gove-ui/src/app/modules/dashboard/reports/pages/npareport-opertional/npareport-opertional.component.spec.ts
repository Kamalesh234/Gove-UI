import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpareportOpertionalComponent } from './npareport-opertional.component';

describe('NpareportOpertionalComponent', () => {
  let component: NpareportOpertionalComponent;
  let fixture: ComponentFixture<NpareportOpertionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpareportOpertionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NpareportOpertionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
