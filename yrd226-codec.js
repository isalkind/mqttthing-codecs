/**
 * Codec for Yale Assure Lock (YRD226) w/ z-wave module
 * 
 * yrd226-codec.js
 */

'use strict';

const targetStateProperty = 'lockTargetState';

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
    let { notify } = params;

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
     * Encode lock state for sending via MQTT. Local state representation -> Remote state representation
     * @param {*} message Lock state to be published to MQTT
     * @param {*} info 
     * @param {*} output 
     * @returns Encoded lock state to be published to MQTT
     */
    function encodeLockState(message, info, output) { // eslint-disable-line no-unused-vars
        switch (message) {
            case 'U': return 0;
            case 'S': return 255;
            default:  return undefined;
        }
    }

    /**
     * Decode remote lock state after receipt. Remote state representation -> Local state reprentation
     * @param {*} message Lock state received from MQTT
     * @param {*} info 
     * @param {*} output 
     * @returns Decoded lock state received from MQTT
     */
    function decodeLockState(message, info, output) { // eslint-disable-line no-unused-vars
        switch (parseInt(message)) {
            case 0:   return 'U';
            case 255: return 'S';
            default:  return '?';
        }
    }

    /**
     * Decode current lock state upon receipt. We also set the target lock state
     * to the same value to maintain state consistency.
     * @param {*} message Lock state received from MQTT
     * @param {*} info 
     * @param {*} output 
     * @returns Decoded lock state received from MQTT
     */
    function decodeLockCurrentState(message, info, output) {
        let decodedValue = decodeLockState(message, info, output);

        notify(targetStateProperty, decodedValue);

        return decodedValue;
    }

    function decodeBatteryLevel(message, info, output) { // eslint-disable-line no-unused-vars
        return message;
    }

    function decodeStatusLowBattery(message, info, output) { // eslint-disable-line no-unused-vars
        return message;
    }

    // return encode and decode functions
    return {
        properties: {
            lockTargetState: {
                encode: encodeLockState,
                decode: decodeLockState
            },
            lockCurrentState: {
                decode: decodeLockCurrentState
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