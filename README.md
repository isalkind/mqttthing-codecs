# mqttthing-codecs

 Codecs for [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing)

- th6320zw-codec.js - **Honeywell T6 Pro Z-Wave (TH6320ZW)**
- yrx226-codec.js - **Yale Assure Lock (YRD226) w/ z-wave module**
  - These Yale lock models *may* also be compatible, but have not been verified: YRC226 / YRC246 / YRD256 / YRC256 / YRD446
- zse44-codec.js - **Zooz Temperature Humidity XS Sensor (ZSE44)**

## Install

Place the codecs in the Homebridge config directory (the same directory as config.json).

## Configuration

### th6320zw-codec.js

Example with base topic name of `zwave/Kitchen/Thermostat`, replace as appropriate.

```json
{
    "type": "thermostat",
    "name": "Kitchen Thermostat",
    "logMqtt": false,
    "codec": "th6320zw-codec.js",
    "topics": {
        "getOnline": "zwave/Kitchen/Thermostat/status",
        "getCoolingThresholdTemperature": "zwave/Kitchen/Thermostat/67/0/setpoint/2",
        "setCoolingThresholdTemperature": "zwave/Kitchen/Thermostat/67/0/setpoint/2/set",
        "getCurrentHeatingCoolingState": "zwave/Kitchen/Thermostat/66/0/state",
        "getCurrentRelativeHumidity": "zwave/Kitchen/Thermostat/49/0/Humidity",
        "getCurrentTemperature": "zwave/Kitchen/Thermostat/49/0/Air_temperature",
        "getHeatingThresholdTemperature": "zwave/Kitchen/Thermostat/67/0/setpoint/1",
        "setHeatingThresholdTemperature": "zwave/Kitchen/Thermostat/67/0/setpoint/1/set",
        "getTargetHeatingCoolingState": "zwave/Kitchen/Thermostat/64/0/mode",
        "setTargetHeatingCoolingState": "zwave/Kitchen/Thermostat/64/0/mode/set",
        "getTargetTemperature": "zwave/Kitchen/Thermostat/49/0/Target_temperature",
        "setTargetTemperature": "zwave/Kitchen/Thermostat/49/0/Target_temperature/set",
        "getTemperatureDisplayUnits": "zwave/Kitchen/Thermostat/112/0/2",
        "setTemperatureDisplayUnits": "zwave/Kitchen/Thermostat/112/0/2/set"
    },
    "onlineValue": "true",
    "offlineValue": "false",
    "restrictHeatingCoolingState": [
        0,
        1,
        2
    ],
    "accessory": "mqttthing"
}
```

### yrd226-codec.js

Example with base topic name of `zwave/Entryway/Lock`, replace as appropriate.

```json
{
    "type": "lockMechanism",
    "name": "Entryway Lock",
    "logMqtt": false,
    "codec": "yrd226-codec.js",
    "topics": {
        "getOnline": "zwave/Entryway/Lock/status",
        "getBatteryLevel": "zwave/Entryway/Lock/128/0/level",
        "getLockCurrentState": "zwave/Entryway/Lock/98/0/currentMode",
        "getLockTargetState": "zwave/Entryway/Lock/98/0/targetMode",
        "setLockTargetState": "zwave/Entryway/Lock/98/0/targetMode/set",
        "getStatusLowBattery": "zwave/Entryway/Lock/128/0/isLow"
    },
    "onlineValue": "true",
    "offlineValue": "false",
    "accessory": "mqttthing"
}
````

### zse44-codec.js

Example with base topic name of `zwave/Bathroom/Sensor`, replace as appropriate.

```json
{
    "type": "temperatureSensor",
    "name": "Bathroom Temperature Sensor",
    "codec": "zse44-codec.js",
    "topics": {
        "getOnline": "zwave/Bathroom/Sensor/status",
        "getBatteryLevel": "zwave/Bathroom/Sensor/128/0/level",
        "getCurrentTemperature": "zwave/Bathroom/Sensor/49/0/Air_temperature",
        "getStatusLowBattery": "zwave/Bathroom/Sensor/128/0/isLow"
    },
    "onlineValue": "true",
    "offlineValue": "false",
    "accessory": "mqttthing"
}
```
