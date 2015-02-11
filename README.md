# htu21d

Read temperature and humidity from an HTU21D sensor using node

## HTU21D

The HTU21D-F sensor measures temperature and humidity using an I2C interface.
The breakout board used for development and testing is the
[Adafruit HTU21d-F](http://www.adafruit.com/product/1899) and
a Raspberry Pi.

## Enable i2c on a Raspberry Pi

Be sure to enable support for i2c and install the i2c tools. Adafruit has a
[tutorial](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-4-gpio-setup/configuring-i2c)
covering this. I suggest adding one more step at the end so i2c can be used
without sudo. This step adds the user pi to the i2c group. Logout and log
back in to make this take effect.
```bash
$ sudo usermod -a -G i2c pi
```

### Install node.js on a Raspberry Pi

The node.js package in the Raspian repo is too old be used with this module.
Adafruit has another excellent page showing
[how to install the latest node.js version](https://learn.adafruit.com/raspberry-pi-hosting-node-red/setting-up-node-dot-js)
on the Pi.

## Install this module

```bash
$ npm install htu21d
```

## Usage

````javascript
var i2c_htu21d = require('./index.js');

// If using a Raspberry Pi, do not specify the i2c device name.
// The correct name will be used based on the board revision.
// Older boards use /dev/i2c-0, newer ones use /dev/i2c-1.
// If using any other board, specify the device name.
// For example: i2c_htu21d({device: '/dev/i2c-1/'});
var htu21df = new i2c_htu21d();

htu21df.readTemperature(function (temp) {
    console.log('Temperature, C:', temp);

    htu21df.readHumidity(function (humidity) {
        console.log('Humidity, RH %:', humidity);
    });
});
````
