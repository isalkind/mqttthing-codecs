/**
 * Codec for Zooz Temperature Humidity XS Sensor (ZSE44)
 * 
 * th6320zw-codec.js
 */

'use strict';

/**
 * Initialise codec for accessory
 * @param {object} params Initialisation parameters object
 * @param {function} params.log Logging function
 * @param {object} params.config Configuration
 * @param {function} params.publish Function to publish a message directly to MQTT
 * @param {function} params.notify Function to send MQTT-Thing a property notification
 * @return {object} Encode and/or decode functions
 */
function init( params ) { // eslint-disable-line no-unused-vars

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
     * Decode received temperature. Always receive fahrenheit. Local representation is always celsius.
     * @param {*} message Recieved temperature
     * @param {*} info 
     * @param {*} output 
     * @returns Decoded celsius temperature
     */
    function decodeTemperature(message, info, output) { // eslint-disable-line no-unused-vars
        return (message - 32) * 0.5556;
    }

    // return encode and decode functions
    return { 
        properties: {
            currentTemperature: {
                decode: decodeTemperature
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
