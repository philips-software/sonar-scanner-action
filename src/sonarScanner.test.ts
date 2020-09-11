import { sonarScanner } from './sonarScanner';
import { exec } from '@actions/exec';

jest.mock('@actions/exec');
jest.mock('@actions/github', () => ({
  ...jest.requireActual('@actions/github'),
  context: {
    ref: 'refs/head/develop',
    payload: {},
  },
}));

describe('SonarQube Scanner Action', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env['INPUT_PROJECTNAME'] = 'Hello World';
    process.env['INPUT_PROJECTKEY'] = 'key';
    process.env['INPUT_TOKEN'] = 'Dummy-Security-Token';
    process.env['INPUT_URL'] = 'http://example.com';
    process.env['INPUT_SCMPROVIDER'] = 'git';
    process.env['INPUT_SOURCEENCODING'] = 'UTF-8';
    process.env['INPUT_ENABLEPULLREQUESTDECORATION'] = 'false';
    process.env['INPUT_ONLYCONFIG'] = 'false';
    process.env['INPUT_ISCOMMUNITYEDITION'] = 'false';
  });

  it.each`
    option                 | value
    ${'INPUT_PROJECTNAME'} | ${'projectName'}
    ${'INPUT_PROJECTKEY'}  | ${'projectKey'}
    ${'INPUT_TOKEN'}       | ${'token'}
    ${'INPUT_URL'}         | ${'url'}
  `(
    `should throw an error when the option $value is missing`,
    async ({ option, value }) => {
      expect.assertions(1);
      delete process.env[option];

      try {
        await sonarScanner();
      } catch (e) {
        expect(e.message).toContain(`not supplied: ${value}`);
      }
    },
  );

  it('starts the action when mandatory parameters are set', async () => {
    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      '-Dsonar.login=Dummy-Security-Token',
      '-Dsonar.host.url=http://example.com',
      '-Dsonar.projectKey=key',
      "-Dsonar.projectName='Hello World'",
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
      '-Dsonar.branch.name=develop',
    ]);
  });

  it('starts the action when baseDir is set', async () => {
    process.env['INPUT_BASEDIR'] = 'src/';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      '-Dsonar.login=Dummy-Security-Token',
      '-Dsonar.host.url=http://example.com',
      '-Dsonar.projectKey=key',
      "-Dsonar.projectName='Hello World'",
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
      '-Dsonar.projectBaseDir=src/',
      '-Dsonar.branch.name=develop',
    ]);

    delete process.env['INPUT_BASEDIR'];
  });

  it('Skips setting branch/pr if community edition', async () => {
    process.env['INPUT_ISCOMMUNITYEDITION'] = 'true';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      '-Dsonar.login=Dummy-Security-Token',
      '-Dsonar.host.url=http://example.com',
      '-Dsonar.projectKey=key',
      "-Dsonar.projectName='Hello World'",
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
    ]);
  });

  it('Skip invoking scanner, only config.', async () => {
    process.env['INPUT_ONLYCONFIG'] = 'true';

    await sonarScanner();
    expect(exec).not.toHaveBeenCalled();
  });

  it('throws an error when SonarQube fails', async () => {
    expect.assertions(1);

    const mockedExec = exec as jest.Mock<Promise<number>>;
    mockedExec.mockImplementation(() => {
      return new Promise((reject) => {
        reject(1);
      });
    });

    try {
      await sonarScanner();
    } catch (e) {
      expect(e.message).toBe('SonarScanner failed');
    }
  });
});
