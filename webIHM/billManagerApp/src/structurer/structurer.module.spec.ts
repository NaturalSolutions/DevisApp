import { StructurerModule } from './structurer.module';

describe('StructurerModule', () => {
  let structurerModule: StructurerModule;

  beforeEach(() => {
    structurerModule = new StructurerModule();
  });

  it('should create an instance', () => {
    expect(structurerModule).toBeTruthy();
  });
});
