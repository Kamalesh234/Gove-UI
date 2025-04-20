import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MistranslanderComponent } from './mistranslander.component';

describe('MistranslanderComponent', () => {
  let component: MistranslanderComponent;
  let fixture: ComponentFixture<MistranslanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MistranslanderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MistranslanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
