/**
 * Codec for Honeywell T6 Pro Z-Wave (TH6320ZW)
 * 
 * th6320zw-codec.js
 */

'use strict';

const targetTemperatureProperty = 'targetTemperature';

/**
 * Initialise codec for accessory
 * @param {object} params Initialisation parameters object
 * @param {function} params.log Logging function
 * @param {object} params.config Configuration
 * @param {function} params.publish Function to publish a message directly to MQTT
 * @param {function} params.notify Function to send MQTT-Thing a property notification
 * @return {object} Encode and/or decode functions
 */
function init( params ) {
    // extract parameters for convenience
    let { config, publish, notify } = params;

    // state info needed for encode/decode
    let theTemperatureDisplayUnits = 'FAHRENHEIT';

    /**
     * Encode message before sending.
     * The output function may be called to deliver an encoded value for the property later.
     * @param {string} message Message from mqttthing to be published to MQTT
     * @param {object} info Object giving contextual information
     * @param {string} info.topic MQTT topic to be published
     * @param {string} info.property Property associated with publishing operation
     * @param {function} output Function which may be called to deliver the encoded value asynchronously
     * @returns {string} Processed message (optionally)
     */
    function encode( message, info, output ) { // eslint-disable-line no-unused-vars
        return message;
    }

    /**
     * Decode received message, and optionally return decoded value.
     * The output function may be called to deliver a decoded value for the property later.
     * @param {string} message Message received from MQTT
     * @param {object} info Object giving contextual information
     * @param {string} info.topic MQTT topic received
     * @param {string} info.property Property associated with subscription
     * @param {function} output Function which may be called to deliver the decoded value asynchronously
     * @returns {string} Processed message (optionally)
     */
    function decode( message, info, output ) { // eslint-disable-line no-unused-vars
        return message;
    }

    /**
     * Encode heating/cooling state for sending to MQTT. We also set the target temperature
     * appropriately when heat or cool is selected. Thermostat keeps seperate target temperature
     * values for heating and cooling.
     * @param {*} message Heating/cooling state to encode
     * @param {*} info 
     * @param {*} output 
     * @returns Encoded heating/cooling state
     */
    function encodeHeatingCoolingState(message, info, output) { // eslint-disable-line no-unused-vars
        switch (message) {
            case 'OFF':  return 0;
            case 'HEAT': return 1;
            case 'COOL': return 2;
            default:     return undefined; // unsupported state (probably 'AUTO')
        }
    }

    /**
     * Decode recieved heating cooling/state.
     * @param {*} message Heating/cooling state to decode
     * @param {*} info 
     * @param {*} output 
     * @returns Decoded heating/cooling state
     */
    function decodeHeatingCoolingState(message, info, output) { // eslint-disable-line no-unused-vars
        switch (parseInt(message)) {
            case 0:  return 'OFF';
            case 1:  return 'HEAT';
            case 2:  return 'COOL';
            default: return undefined;
        }
    }

    /**
     * Encode the target temperature. Publish the heating or cooling
     * threshold temperature depending on the heating/cooling state instead.
     * @param {*} message Target temperature to encode
     * @param {*} info 
     * @param {*} output 
     * @returns Nothing
     */
    function encodeTargetTemperature(message, info, output) {
        let temperature = encodeTemperature(message, info, output);

        publish(config.topics.setHeatingThresholdTemperature, temperature);
        publish(config.topics.setCoolingThresholdTemperature, temperature);

        return undefined;
    }

    /**
     * Encode temperature for sending to MQTT. Local representation is
     * always celsius. Convert as necessary.
     * @param {*} message Celcius temperature for sending
     * @param {*} info 
     * @param {*} output 
     * @returns Encoded temperature for sending
     */
    function encodeTemperature(message, info, output) { // eslint-disable-line no-unused-vars
        if (theTemperatureDisplayUnits == 'FAHRENHEIT') {
            return Math.round( (message * 1.8) + 32 );
        } else {
            return message;
        }
    }

    /**
     * Decode received temperature. Local representation is always celsius.
     * Convert as necessary. For some reason, even though units may be
     * in fahrenheit, the thermostat will send celsius. Account for this
     * by assuming any temp received <= 32 is already in celsius.
     * @param {*} message Recieved temperature
     * @param {*} info 
     * @param {*} output 
     * @returns Decoded celsius temperature
     */
    function decodeTemperature(message, info, output) { // eslint-disable-line no-unused-vars
        // Local units are always celsius. Convert as necessary.
        if (theTemperatureDisplayUnits == 'FAHRENHEIT' && message > 32) {
            return (message - 32) * 0.5556;
        } else {
            return message;
        }
    }

    /**
     * Encode the termperature display units for sending.
     * @param {*} message Local temperature display unit
     * @param {*} info 
     * @param {*} output 
     * @returns Encoded temperature display unit
     */
    function encodeTemperatureDisplayUnits(message, info, output) { // eslint-disable-line no-unused-vars
        switch (message) {
            case 'FAHRENHEIT': return 0;
            case 'CELSIUS':    return 1;
            default:           return undefined;
        }
    }

    /**
     * Decode the received temperature display unit to its local representation.
     * @param {*} message Thermostat temperature display unit
     * @param {*} info 
     * @param {*} output 
     * @returns Decoded temperature display unit
     */
    function decodeTemperatureDisplayUnits(message, info, output) { // eslint-disable-line no-unused-vars
        let displayUnits = undefined;
        switch (parseInt(message)) {
            case 0: displayUnits = 'FAHRENHEIT'; break;
            case 1: displayUnits = 'CELSIUS';    break;
        }

        if (displayUnits) {
            theTemperatureDisplayUnits = displayUnits;
        }

        return displayUnits;
    }

    /**
     * Encode the cooling threshold temperature for sending.
     * @param {*} message Local threshold cooling temperature
     * @param {*} info 
     * @param {*} output 
     * @returns Encoded threshold cooling temperature
     */
    function encodeCoolingThresholdTemperature(message, info, output) { // eslint-disable-line no-unused-vars
        return undefined;
        // theCoolingThresholdTemperature = encodeTemperature(message, info, output);
        // return theCoolingThresholdTemperature;
    }

    /**
     * Decode the received cooling threshold temperature. We also notify
     * the target temperature if the current heating/cooling state is cooling.
     * @param {*} message Recieved cooling threshold temperature
     * @param {*} info 
     * @param {*} output 
     * @returns Decoded cooling threshold temperature
     */
    function decodeCoolingThresholdTemperature(message, info, output) {
        notify(targetTemperatureProperty, decodeTemperature(message, info, output));

        return undefined;
    }

    /**
     * Encode the heating threshold temperature for sending.
     * @param {*} message Local threshold heating temperature
     * @param {*} info 
     * @param {*} output 
     * @returns Encoded threshold heating temperature
     */
    function encodeHeatingThresholdTemperature(message, info, output) { // eslint-disable-line no-unused-vars
        return undefined;
        // theHeatingThresholdTemperature = encodeTemperature(message, info, output);
        // return theHeatingThresholdTemperature;
    }

    /**
     * Decode the received heating threshold temperature. We also notify
     * the target temperature if the current heating/cooling state is heating.
     * @param {*} message Recieved heating threshold temperature
     * @param {*} info 
     * @param {*} output 
     * @returns Decoded heating threshold temperature
     */
    function decodeHeatingThresholdTemperature(message, info, output) {
        notify(targetTemperatureProperty, decodeTemperature(message, info, output));

        return undefined;
    }

    // return encode and decode functions
    return { 
        properties: {
            currentHeatingCoolingState: {
                decode: decodeHeatingCoolingState
            },
            targetHeatingCoolingState: {
                encode: encodeHeatingCoolingState,
                decode: decodeHeatingCoolingState
            },
            currentTemperature: {
                decode: decodeTemperature
            },
            targetTemperature: {
                encode: encodeTargetTemperature
            },
            temperatureDisplayUnits: {
                encode: encodeTemperatureDisplayUnits,
                decode: decodeTemperatureDisplayUnits
            },
            coolingThresholdTemperature: {
                encode: encodeCoolingThresholdTemperature,
                decode: decodeCoolingThresholdTemperature
            },
            heatingThresholdTemperature: {
                encode: encodeHeatingThresholdTemperature,
                decode: decodeHeatingThresholdTemperature
            }
        },
        encode, 
        decode 
    };
}

// export initialisation function
module.exports = {
    init
};
