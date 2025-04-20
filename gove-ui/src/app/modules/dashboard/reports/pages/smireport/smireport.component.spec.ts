import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmireportComponent } from './smireport.component';

describe('SmireportComponent', () => {
  let component: SmireportComponent;
  let fixture: ComponentFixture<SmireportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmireportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmireportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
