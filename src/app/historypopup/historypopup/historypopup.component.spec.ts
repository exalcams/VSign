import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorypopupComponent } from './historypopup.component';

describe('HistorypopupComponent', () => {
  let component: HistorypopupComponent;
  let fixture: ComponentFixture<HistorypopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorypopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorypopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
