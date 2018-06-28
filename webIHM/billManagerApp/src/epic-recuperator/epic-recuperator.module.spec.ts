import { EpicRecuperatorModule } from './epic-recuperator.module';

describe('EpicRecuperatorModule', () => {
  let epicRecuperatorModule: EpicRecuperatorModule;

  beforeEach(() => {
    epicRecuperatorModule = new EpicRecuperatorModule();
  });

  it('should create an instance', () => {
    expect(epicRecuperatorModule).toBeTruthy();
  });
});
