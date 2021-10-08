import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsignMainComponent } from './vsign-main.component';

describe('VsignMainComponent', () => {
  let component: VsignMainComponent;
  let fixture: ComponentFixture<VsignMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsignMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsignMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
