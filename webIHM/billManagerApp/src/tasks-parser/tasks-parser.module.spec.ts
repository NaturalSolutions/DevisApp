import { TasksParserModule } from './tasks-parser.module';

describe('TasksParserModule', () => {
  let tasksParserModule: TasksParserModule;

  beforeEach(() => {
    tasksParserModule = new TasksParserModule();
  });

  it('should create an instance', () => {
    expect(tasksParserModule).toBeTruthy();
  });
});
