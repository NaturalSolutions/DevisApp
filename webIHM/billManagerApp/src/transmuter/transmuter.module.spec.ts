import { TransmuterModule } from './transmuter.module';

describe('TransmuterModule', () => {
  let transmuterModule: TransmuterModule;

  beforeEach(() => {
    transmuterModule = new TransmuterModule();
  });

  it('should create an instance', () => {
    expect(transmuterModule).toBeTruthy();
  });
});
