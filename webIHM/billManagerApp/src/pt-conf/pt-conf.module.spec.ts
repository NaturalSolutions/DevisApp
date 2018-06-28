import { PtConfModule } from './pt-conf.module';

describe('PtConfModule', () => {
  let ptConfModule: PtConfModule;

  beforeEach(() => {
    ptConfModule = new PtConfModule();
  });

  it('should create an instance', () => {
    expect(ptConfModule).toBeTruthy();
  });
});
