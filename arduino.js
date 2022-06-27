/* jslint browser: true */
/* global  */

// usb port connection
let port;

// sensor vars
let sensorData,
    ambientLight,
    i = 0,
    loop;

// difference in light depending on ambient light
let lightDiff = 20;

// all sensor data
let allData = {
    sensor1: false,
    sensor2: false,
    sensor3: false,
    sensorError: false,
    btn1: false,
    btn2: false,
    btn3: false
};

// determines if sensor is available
let arduinoActive = true;

// runs after connection with device
function connect() {
    port.connect().then(() => {
        console.clear();
        port.onReceive = data => {
            let textDecoder = new TextDecoder();
            onUpdate(textDecoder.decode(data));
        }
        port.onReceiveError = error => {
            console.error(error);
        };
    }, error => {
        console.error(error);
    });
}

// connects with device
function connectArduino() {
    if (port) {
        port.disconnect();
        port = null;
        clearInterval(loop);
    } else {
        serial.requestPort().then(selectedPort => {
            port = selectedPort;
            connect();

        }).catch(error => {
            console.error(error);
        });
    }
}

// checks if ports are available
serial.getPorts().then(ports => {
    if (ports.length == 0) {
        console.log('No sensors/buttons found.');
        arduinoActive = false;
    } else {
        console.log('Connecting...');
        port = ports[0];
        connect();
    }
});

// sets data to send to app
function onUpdate(data) {

    // CREATE DATA ARRAY ////////////////////////////
    sensorData = data.split(',');
    // convert text to numbers
    sensorData = sensorData.map(numStr => parseInt(numStr));

    // SET AMBIENT LIGHT ////////////////////////////
    if (i < 100) {
        ambientLight = sensorData;
        console.log("ambientLight = " + ambientLight);
        i++;
        return;
    }

    // START LOOP
    if (i == 100) {
        loop = setInterval(function () {
            console.log("ambientLight = " + ambientLight);
            console.log("sensorData = " + sensorData);
            console.table(allData);
        }, 1000);
        i++;
    }

    // PRODUCT PICKUPS ///////////////////////////////
    allData.sensor1 = (sensorData[0] + lightDiff < ambientLight[0]) ? true : false;
    allData.sensor2 = (sensorData[1] + lightDiff < ambientLight[1]) ? true : false;
    allData.sensor3 = (sensorData[2] + lightDiff < ambientLight[2]) ? true : false;
    // check if more than one is lighter
    allData.sensorError = ((allData.sensor1 ? 0 : 1) + (allData.sensor2 ? 0 : 1) + (allData.sensor3 ? 0 : 1) >= 2) ? true : false;

    // PRODUCT BUTTONS
    allData.btn1 = (sensorData[3] == 1) ? true : false;
    allData.btn2 = (sensorData[4] == 1) ? true : false;
    allData.btn3 = (sensorData[5] == 1) ? true : false;

}
