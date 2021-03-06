"use strict";

const {
  BASE_AGENT_ID,
  AUX_AGENT_ID,
  STARTUP_AGENT_ID,
  NIGHTCALL_DIR_PLACEHOLDER_REGEX,
  AGENT_ID_PLACEHOLDER_REGEX,
  MINUTES_PLACEHOLDER_REGEX,
  HOURS_PLACEHOLDER_REGEX
} = require("../util/constants");

const removeLaunchAgents = async agents => {
  const removeLaunchAgentPromises = [];
  agents.forEach(({ id }) => {
    removeLaunchAgentPromises.push(this.removeLaunchAgent(id));
  });
  return Promise.all(removeLaunchAgentPromises);
};

const removeLaunchAgentFiles = async agents => {
  const removeLaunchAgentFilePromises = [];
  agents.forEach(({ id }) => {
    removeLaunchAgentFilePromises.push(this.removeLaunchAgentFile(id));
  });
  return Promise.all(removeLaunchAgentFilePromises);
};

const scheduleUpdate = async date => {
  const fixedDate = new Date(date.getTime() + 60 * 1000);
  const minutes = fixedDate.getMinutes();
  const hours = fixedDate.getHours();

  this.state.setAppState({ nextUpdate: fixedDate });
  this.logger.debug(`Scheduling next update to ${fixedDate}`);
  this.logger.debug(`Current pid: ${process.pid}`);

  const loadedLaunchAgents = await this.getLoadedLaunchAgents(BASE_AGENT_ID);
  const filteredLoadedLaunchAgents = loadedLaunchAgents.filter(
    ({ id, isRunning }) => id !== STARTUP_AGENT_ID && !isRunning
  );
  await removeLaunchAgents(filteredLoadedLaunchAgents);
  await removeLaunchAgentFiles(filteredLoadedLaunchAgents);
  const currentlyRunningAgent = loadedLaunchAgents.find(
    ({ isRunning }) => isRunning
  );
  const targetAgentId =
    currentlyRunningAgent && currentlyRunningAgent.id === BASE_AGENT_ID
      ? AUX_AGENT_ID
      : BASE_AGENT_ID;

  const contents = await this.readFile(
    `${process.cwd()}/src/templates/base.plist`
  );

  await this.writeLaunchAgentFile(
    targetAgentId,
    contents
      .replace(NIGHTCALL_DIR_PLACEHOLDER_REGEX, process.cwd())
      .replace(AGENT_ID_PLACEHOLDER_REGEX, targetAgentId)
      .replace(MINUTES_PLACEHOLDER_REGEX, minutes)
      .replace(HOURS_PLACEHOLDER_REGEX, hours)
  );

  await this.loadLaunchAgent(targetAgentId);

  this.logger.debug(`Update scheduled.`);
};

module.exports = ({ state, osProxy, fsProxy, logger }) => {
  this.state = state;
  this.loadLaunchAgent = osProxy.loadLaunchAgent;
  this.getLoadedLaunchAgents = osProxy.getLoadedLaunchAgents;
  this.removeLaunchAgent = osProxy.removeLaunchAgent;
  this.readFile = fsProxy.readFile;
  this.writeLaunchAgentFile = fsProxy.writeLaunchAgentFile;
  this.removeLaunchAgentFile = fsProxy.removeLaunchAgentFile;
  this.logger = logger;
  return scheduleUpdate;
};
