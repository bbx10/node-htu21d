# node-htu21d

Read temperature and humidity from an HTU21D sensor using node

## HTU21D

The HTU21D-F sensor measures temperature and humidity using an I2C interface.
The breakout board used for development and testing is the
[Adafruit HTU21D-F](http://www.adafruit.com/product/1899) connected to
a Raspberry Pi running Raspian.

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
$ npm install htu21d-i2c
```

## Usage

````javascript
var i2c_htu21d = require('htu21d-i2c');

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

## node.js v0.12.0

This works with the current version of i2c (0.2.1) and node 0.12.0. If using an
older version of node, use i2c@0.1.8.

## License

The MIT License (MIT)

Copyright (c) 2015 bbx10node@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
