import { sonarScanner } from './sonarScanner';
import { exec } from '@actions/exec';

jest.mock('@actions/exec');

jest.mock('@actions/github', () => ({
  ...jest.requireActual('@actions/github'),
  context: {
    payload: {
      pull_request: {
        number: 101,
        base: {
          ref: 'master',
        },
        head: {
          ref: 'feature/featureX',
        },
      },
    },
  },
}));

describe('SonarQube Scanner Action for a Pull Request', () => {
  beforeEach(() => {
    process.env['INPUT_PROJECTNAME'] = 'HelloWorld';
    process.env['INPUT_PROJECTKEY'] = 'key';
    process.env['INPUT_BASEDIR'] = '.';
    process.env['INPUT_TOKEN'] = 'Dummy-Security-Token';
    process.env['INPUT_URL'] = 'http://example.com';
    process.env['INPUT_SCMPROVIDER'] = 'git';
    process.env['INPUT_SOURCEENCODING'] = 'UTF-8';
  });

  it('starts the action for pull request decoration.', async () => {
    process.env['INPUT_ENABLEPULLREQUESTDECORATION'] = 'true';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      '-Dsonar.login=Dummy-Security-Token',
      '-Dsonar.host.url=http://example.com',
      '-Dsonar.projectKey=key',
      "-Dsonar.projectName='HelloWorld'",
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
      '-Dsonar.projectBaseDir=.',
      '-Dsonar.pullrequest.key=101',
      '-Dsonar.pullrequest.base=master',
      '-Dsonar.pullrequest.branch=feature/featureX',
    ]);
  });

  it('starts the action for pull request without decoration.', async () => {
    process.env['INPUT_ENABLEPULLREQUESTDECORATION'] = 'false';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      '-Dsonar.login=Dummy-Security-Token',
      '-Dsonar.host.url=http://example.com',
      '-Dsonar.projectKey=key',
      "-Dsonar.projectName='HelloWorld'",
      '-Dsonar.scm.provider=git',
      '-Dsonar.sourceEncoding=UTF-8',
      '-Dsonar.projectBaseDir=.',
    ]);
  });
});
