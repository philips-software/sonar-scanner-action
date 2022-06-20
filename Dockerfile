FROM philipssoftware/sonar-scanner:4.7.0.2747
COPY . /actions/sonar-scanner-action

ENTRYPOINT ["node", "/actions/sonar-scanner-action/dist/index.js"]
