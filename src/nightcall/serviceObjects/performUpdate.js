"use strict";

const suncalc = require("suncalc");

const { NIGHT, DAY, RETRY_TIMEOUT } = require("../util/constants");

const performUpdate = async () => {
  this.showDialog("Nightcall update");
  const updateTimer = Date.now();
  this.logger.debug("Updating data...");

  const appState = await this.state.getAppState();

  const { locationSetManually } = appState;
  let { location } = appState;

  if (!locationSetManually) {
    try {
      location = await this.findLocation();
    } catch (err) {
      this.logger.error(err);
    }
  }

  if (location) {
    let { sunrise, sunset } = suncalc.getTimes(
      new Date(),
      location.lat,
      location.lng
    );

    this.state.setAppState({
      location,
      sunrise,
      sunset
    });

    this.logger.debug(`Daytime for ${location.lat},${location.lng}:`);
    this.logger.debug(`Sunrise: ${sunrise}`);
    this.logger.debug(`Sunset: ${sunset}`);

    const now = new Date();
    if (now < sunrise || now > sunset) {
      this.changeTheme(NIGHT);
      this.scheduleUpdate(sunrise);
    } else {
      this.changeTheme(DAY);
      this.scheduleUpdate(sunset);
    }

    this.logger.debug(`Update took ${Date.now() - updateTimer} ms`);
  } else {
    const nextUpdate = new Date(Date.now() + RETRY_TIMEOUT);
    this.logger.debug(`Unable to find location. Next retry: ${nextUpdate}`);
    this.scheduleUpdate(nextUpdate);
  }
};

module.exports = ({
  state,
  findLocation,
  changeTheme,
  scheduleUpdate,
  osProxy,
  logger
}) => {
  this.state = state;
  this.findLocation = findLocation;
  this.changeTheme = changeTheme;
  this.scheduleUpdate = scheduleUpdate;
  this.showDialog = osProxy.showDialog;
  this.logger = logger;

  return performUpdate;
};
