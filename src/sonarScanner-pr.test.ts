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

const token = 'Dummy-Security-Token';
const url = 'http://example.com';
const projectKey = 'key';
const projectName = 'Hello, World';
const scm = 'git';
const encoding = 'UTF-8';
const qualityGate = 'false';

const defaultFlags = [
  `-Dsonar.login=${token}`,
  `-Dsonar.host.url=${url}`,
  `-Dsonar.projectKey=${projectKey}`,
  `-Dsonar.projectName='${projectName}'`,
  `-Dsonar.scm.provider=${scm}`,
  `-Dsonar.sourceEncoding=${encoding}`,
  `-Dsonar.qualitygate.wait=${qualityGate}`,
];

describe('SonarQube Scanner Action for a Pull Request', () => {
  beforeEach(() => {
    process.env['INPUT_PROJECTNAME'] = projectName;
    process.env['INPUT_PROJECTKEY'] = projectKey;
    process.env['INPUT_TOKEN'] = token;
    process.env['INPUT_URL'] = url;
    process.env['INPUT_SCMPROVIDER'] = scm;
    process.env['INPUT_SOURCEENCODING'] = encoding;
    process.env['INPUT_RUNQUALITYGATE'] = qualityGate;
    process.env['INPUT_ONLYCONFIG'] = 'false';
    process.env['INPUT_ISCOMMUNITYEDITION'] = 'false';
    process.env['INPUT_BASEDIR'] = '.';

  });

  it('starts the action for pull request decoration.', async () => {
    process.env['INPUT_ENABLEPULLREQUESTDECORATION'] = 'true';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      ...defaultFlags,
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
      ...defaultFlags,
      '-Dsonar.projectBaseDir=.',
    ]);
  });

  it('skips setting PR and uses default master if Community edition', async () => {
    process.env['INPUT_ISCOMMUNITYEDITION'] = 'true';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      ...defaultFlags,
      '-Dsonar.projectBaseDir=.',
    ]);
  });
});
