"use strict";

const { homedir } = require("os");const RETRY_TIMEOUT = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

const NIGHT = "night";
const DAY = "day";

const AUTO = "auto";

const STORAGE_APP_STATE_KEY = "app-state";
const STORAGE_LOCATION_PREFIX = "location-";

const BASE_AGENT_ID = "local.nightcall.base";
const AUX_AGENT_ID = "local.nightcall.aux";
const STARTUP_AGENT_ID = "local.nightcall.startup";
const AGENT_REGEX = /local\.nightcall\.\w+/;

const NIGHTCALL_DIR_PLACEHOLDER_REGEX = /\$NIGHTCALL_DIR/g;
const AGENT_ID_PLACEHOLDER_REGEX = /\$AGENT_ID/g;
const MINUTES_PLACEHOLDER_REGEX = /\$MINUTES/g;
const HOURS_PLACEHOLDER_REGEX = /\$HOURS/g;

const NIGHTCALL_DATA_DIR = `${homedir()}/.nightcall`

module.exports = {
  RETRY_TIMEOUT,
  TWENTY_FOUR_HOURS,
  NIGHT,
  DAY,
  AUTO,
  STORAGE_APP_STATE_KEY,
  STORAGE_LOCATION_PREFIX,
  BASE_AGENT_ID,
  AUX_AGENT_ID,
  STARTUP_AGENT_ID,
  AGENT_REGEX,
  NIGHTCALL_DIR_PLACEHOLDER_REGEX,
  AGENT_ID_PLACEHOLDER_REGEX,
  MINUTES_PLACEHOLDER_REGEX,
  HOURS_PLACEHOLDER_REGEX,
  NIGHTCALL_DATA_DIR
};
