import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpahistoryComponent } from './npahistory.component';

describe('NpahistoryComponent', () => {
  let component: NpahistoryComponent;
  let fixture: ComponentFixture<NpahistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpahistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NpahistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
