import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeardialogComponent } from './geardialog.component';

describe('GeardialogComponent', () => {
  let component: GeardialogComponent;
  let fixture: ComponentFixture<GeardialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeardialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeardialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
