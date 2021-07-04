FROM philipssoftware/sonar-scanner:4.4.0.2170
COPY . /actions/sonar-scanner-action

ENTRYPOINT ["node", "/actions/sonar-scanner-action/dist/index.js"]
