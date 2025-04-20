import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisreportsComponent } from './misreports.component';

describe('MisreportsComponent', () => {
  let component: MisreportsComponent;
  let fixture: ComponentFixture<MisreportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisreportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MisreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
