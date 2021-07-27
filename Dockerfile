FROM philipssoftware/sonar-scanner:4.6.2.2472
COPY . /actions/sonar-scanner-action

ENTRYPOINT ["node", "/actions/sonar-scanner-action/dist/index.js"]
