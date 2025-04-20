import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaTransladerComponent } from './sma-translader.component';

describe('SmaTransladerComponent', () => {
  let component: SmaTransladerComponent;
  let fixture: ComponentFixture<SmaTransladerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmaTransladerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmaTransladerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
