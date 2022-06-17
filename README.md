# Sonar Scanner Action

A GitHub action to configure and run the SonarQube scanner inside a [SonarQube Docker container](https://hub.docker.com/r/philipssoftware/sonar-scanner) and connect to a self hosted Sonar.

The action support the following features

- Configure scanner
- Configure scanner for pull request decoration
- Run sonar scanner
- Export scanner configuration for consuming by e.g. `gradle`, `maven`.

<!-- action-docs-description -->
## Description

Static Analysis using SonarQube


<!-- action-docs-description -->
<!-- action-docs-inputs -->
## Inputs

| parameter | description | required | default |
| - | - | - | - |
| projectName | Sonar Project name | `true` |  |
| projectKey | Sonar Project Key | `true` |  |
| baseDir | Project Base Directory | `false` |  |
| token | Sonar Login Token | `true` |  |
| url | Sonar Server url | `true` |  |
| scmProvider | SCM provider | `false` | git |
| sourceEncoding | Encoding of the source files | `false` | UTF-8 |
| enablePullRequestDecoration | Decorate a pull request. PR, branch and base are extracted from the pull request event | `false` |  |
| onlyConfig | Generate sonar configuration, scanner will not be invoked. Sonar parameters are available as output | `false` | false |
| isCommunityEdition | Flags if your SonarQube instance is Community edition. Skips setting PRs/branches and defaults to master | `false` | false |
| runQualityGate | Run the quality gate associated to this repo in SonarQube | `false` |  |
| qualityGateTimeout | Number of seconds until build is failed for not passing quailty gate. Defaulted to 300 by SonarQube | `false` |  |
| organization | Organization in case of using sonarcloud | `false` |  |



<!-- action-docs-inputs -->
<!-- action-docs-outputs -->
## Outputs

| parameter | description |
| - | - |
| sonarParameters | Sonar parameters generate based on input. |



<!-- action-docs-outputs -->

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
### Invoke the scanner with SonarQube Cloud

_Argument `organization` is available since 1.4.0_

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
        url: https://sonarcloud.io
        organization: organization-on-sonarcloud
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
