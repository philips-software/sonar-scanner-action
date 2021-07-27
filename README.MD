# Sonar Scanner Action

A GitHub action to configure and run the SonarQube scanner inside a [SonarQube Docker container](https://hub.docker.com/r/philipssoftware/sonar-scanner) and connect to a self hosted Sonar.

The action support the following features

- Configure scanner
- Configure scanner for pull request decoration
- Run sonar scanner
- Export scanner configuration for consuming by e.g. `gradle`, `maven`.

## Action input parameters

| Parameter                   | Description                                                                                            | required | default |
| --------------------------- | :----------------------------------------------------------------------------------------------------- | -------- | ------- |
| projectName                 | Your application's name in SonarQube                                                                   | yes      |         |
| projectKey                  | Unique value for your project in SonarQube                                                             | yes      |         |
| baseDir                     | Relative path to your sonar.properties file (default: `.`)                                             | no       | `.`     |
| token                       | SonarQube login token                                                                                  | yes      |         |
| url                         | SonarQube server url                                                                                   | yes      |         |
| scmProvider                 | SCM provider                                                                                           | no       | `git`   |
| sourceEncoding              | Encoding of the source files                                                                           | no       | `UTF-8` |
| enablePullRequestDecoration | Decorate a pull request. PR, branch and base are extracted from the pull                               | no       | `false` |
| onlyConfig                  | "Generate sonar configuration, scanner will not be invoked. Sonar parameters are available as output.  | no       | `false` |
| isCommunityEdition          | Flag your SonarQube instance as Community edition. Disables PRs/branches and defaults branch to master | no       | `false` |
| runQualityGate              | Run quality gate along with the scanner                                                                | no       | `false` |
| qualityGateTimeout          | Number of seconds to wait before failing. SonarQube default is 300                                     | no       |         |

## Action output parameters

| Parameter       | Description                              |
| --------------- | :--------------------------------------- |
| sonarParameters | Sonar parameters generate based on input |

## Environment

| Tool         | Version    |
| ------------ | :--------- |
| SonarScanner | 4.6.2.2472 |
| Java         | 11.0.11    |
| Node         | v16.4.2    |
| Python       | 2.7.16     |
| Python       | 3.7.3      |

## Sample Configuration

To prevent your token from showing in the runner's output, it is advised to store the token configuration inside of a github secret variable.

The listing below uses the secret `SONARQUBE_TOKEN` from your project's configuration.

### Invoke the scanner without pull request decoration

```yml
sonarqube:
  name: SonarQube
  runs-on: self-hosted
  steps:
    - uses: philips-software/sonar-scanner-action@<version>
      with:
        token: ${{ secrets.SONARQUBE_TOKEN }}
        projectName: My Project Name
        projectKey: project.key.from.sonar.qube
        baseDir: .
        url: https://your.sonar.instance.io/
```

### Invoke the scanner with pull request decoration

```yml
name: SonarQube
runs-on: self-hosted
steps:
  - uses: philips-software/sonar-scanner-action@<version>
    with:
      token: ${{ secrets.SONARQUBE_TOKEN }}
      projectName: My Project Name
      projectKey: project.key.from.sonar.qube
      url: https://your.sonar.instance.io/
      enablePullRequestDecoration: true
```

### Invoke the scanner with SonarQube Community edition

```yml
sonarqube:
  name: SonarQube
  runs-on: self-hosted
  steps:
    - uses: philips-software/sonar-scanner-action@<version>
      with:
        token: ${{ secrets.SONARQUBE_TOKEN }}
        projectName: My Project Name
        projectKey: project.key.from.sonar.qube
        url: https://your.sonar.instance.io/
        isCommunityEdition: true
```

### Create configuration for the scanner with pull request decoration

```yml

  name: SonarQube
  runs-on: self-hosted
  steps:
    - name: Configure sonar scanner
      uses: philips-software/sonar-scanner-action@<version>
      id: sonarconfig
      with:
        token: ${{ secrets.SONARQUBE_TOKEN }}
        projectName: My Project Name
        projectKey: project.key.from.sonar.qube
        url: https://your.sonar.instance.io/
        enablePullRequestDecoration: true
        onlyConfig: true
    - name: Run sonar scanner
        uses: docker://openjdk:11.0.6-jdk-slim
        with:
          entrypoint: bash
          args:
            -c "./gradlew --info sonarQube ${{ steps.sonarconfig.outputs.sonarParameters }}"

```

## CONTRIBUTING

Please look at [CONTRIBUTING.md](./CONTRIBUTING.md) on how to contribute.

### Test locally

You can test the action locally by building the docker image and use with the correct parameters.

#### Docker build

``` bash
docker build . -t sonar
```

#### Docker run

Set your environment variables as given in the statement below. All the fields after a `-e`:

``` bash
docker run -e INPUT_PROJECTNAME -e INPUT_PROJECTKEY -e INPUT_URL -e INPUT_BASEDIR -e INPUT_SCMPROVIDER -e INPUT_SOURCEENCODING -e INPUT_ENABLEPULLREQUESTDECORATION -e INPUT_ONLYCONFIG -e INPUT_ISCOMMUNITYEDITION -e INPUT_RUNQUALITYGATE -e INPUT_QUALITYGATETIMEOUT -e INPUT_TOKEN -e GITHUB_REF -e GITHUB_SHA sonar
```

## Philips Forest

This module is part of the Philips Forest.

```
                                                     ___                   _
                                                    / __\__  _ __ ___  ___| |_
                                                   / _\/ _ \| '__/ _ \/ __| __|
                                                  / / | (_) | | |  __/\__ \ |_
                                                  \/   \___/|_|  \___||___/\__|

                                                                            CI
```

Talk to the forestkeepers in the `forest`-channel on Slack.

[![Slack](https://philips-software-slackin.now.sh/badge.svg)](https://philips-software-slackin.now.sh)
