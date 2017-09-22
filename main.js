const axios = require('axios');
const noble = require('noble');
(async () => {
  try {
    /*
    const state = await axios.post('http://192.168.1.1/osc/state', {});
    console.log(state.data);
    const ble_off = await axios.post('http://192.168.1.1/osc/commands/execute',
      {
        "name": "camera.setOptions",
        "parameters": {
          "options": {
            "_bluetoothPower": "OFF"
          }
        }
      }
    );

    console.log(ble_off.data);
    const ble = await axios.post('http://192.168.1.1/osc/commands/execute',
      {
        "name": "camera._setBluetoothDevice",
        "parameters": {
          "uuid": "11111111-1111-1111-1111-111111111111",
        }
      }
    );
    console.log(ble.data);

    const ble_on = await axios.post('http://192.168.1.1/osc/commands/execute',
      {
        "name": "camera.setOptions",
        "parameters": {
          "options": {
            "_bluetoothPower": "ON"
          }
        }
      }
    );
    console.log(ble_on.data);
    */

    const ble_on = await axios.post('http://192.168.1.1/osc/commands/execute',
      {
        "name": "camera.setOptions",
        "parameters": {
          "options": {
            "_bluetoothPower": "ON"
          }
        }
      }
    );
    console.log(ble_on.data);


    noble.on('stateChange', function(state) {
      if (state === 'poweredOn') {
        noble.startScanning([]);
      } else {
        noble.stopScanning();
      }
    });
    noble.on('discover', function(peripheral) {
      peripheral.connect(function(error) {
        if(error){
          console.log('per error', error);
          return;
        }
        console.log('connected to peripheral: ', peripheral);
        peripheral.discoverServices([], function(error, services) {
          for(let i = 0 ; i < services.length; i++){
            var deviceInformationService = services[i];
            console.log('discovered device information service', deviceInformationService.uuid);
            deviceInformationService.discoverCharacteristics([], function(error, characteristics) {
              for(let j = 0; j < characteristics.length; j++){
                const Characteristic = characteristics[j];
                console.log('  discovered manufacturer name characteristic', Characteristic.uuid);
                setInterval(() => {
                  Characteristic.read(function(error, data) {
                      console.log('    characteristic read: ' + data, error);
                  });
                }, 1000);
              }
            });
          }
        });
      });
    });
  }catch(e){
    console.error(e);
  }
})();
