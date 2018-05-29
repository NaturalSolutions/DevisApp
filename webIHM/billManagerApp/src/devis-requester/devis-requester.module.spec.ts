import { DevisRequesterModule } from './devis-requester.module';

describe('DevisRequesterModule', () => {
  let devisRequesterModule: DevisRequesterModule;

  beforeEach(() => {
    devisRequesterModule = new DevisRequesterModule();
  });

  it('should create an instance', () => {
    expect(devisRequesterModule).toBeTruthy();
  });
});
