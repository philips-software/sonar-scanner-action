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

describe('SonarQube Scanner Action', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env['INPUT_PROJECTNAME'] = `${projectName}`;
    process.env['INPUT_PROJECTKEY'] = projectKey;
    process.env['INPUT_TOKEN'] = token;
    process.env['INPUT_URL'] = url;
    process.env['INPUT_SCMPROVIDER'] = scm;
    process.env['INPUT_SOURCEENCODING'] = encoding;
    process.env['INPUT_RUNQUALITYGATE'] = qualityGate;
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
      ...defaultFlags,
      '-Dsonar.branch.name=develop',
    ]);
  });

  it('starts the action when baseDir is set', async () => {
    process.env['INPUT_BASEDIR'] = 'src/';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      ...defaultFlags,
      '-Dsonar.projectBaseDir=src/',
      '-Dsonar.branch.name=develop',
    ]);

    delete process.env['INPUT_BASEDIR'];
  });

  it('Skips setting branch/pr if community edition', async () => {
    process.env['INPUT_ISCOMMUNITYEDITION'] = 'true';

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', defaultFlags);
  });

  it('Warns against setting a quality gate timeout without enabling quality gates', async () => {
    const timeout = 60;
    process.env['INPUT_QUALITYGATETIMEOUT'] = `${timeout}`;

    await sonarScanner();
    expect(exec).toHaveBeenCalledWith('sonar-scanner', [
      ...defaultFlags,
      '-Dsonar.branch.name=develop',
    ]);

    delete process.env['INPUT_QUALITYGATETIMEOUT'];
  });

  it('Runs quality gate with timeout', async () => {
    process.env['INPUT_RUNQUALITYGATE'] = 'true';

    await sonarScanner();
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
