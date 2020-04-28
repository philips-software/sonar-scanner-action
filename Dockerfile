FROM philipssoftware/sonar-scanner:4.3
COPY . /actions/sonar-scanner-action

ENTRYPOINT ["node", "/actions/sonar-scanner-action/dist/index.js"]
