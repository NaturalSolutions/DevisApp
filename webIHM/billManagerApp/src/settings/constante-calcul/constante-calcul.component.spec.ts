import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstanteCalculComponent } from './constante-calcul.component';

describe('ConstanteCalculComponent', () => {
  let component: ConstanteCalculComponent;
  let fixture: ComponentFixture<ConstanteCalculComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstanteCalculComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstanteCalculComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
