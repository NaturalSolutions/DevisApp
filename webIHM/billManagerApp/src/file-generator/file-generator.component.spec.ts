import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileGeneratorComponent } from './file-generator.component';

describe('FileGeneratorComponent', () => {
  let component: FileGeneratorComponent;
  let fixture: ComponentFixture<FileGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
