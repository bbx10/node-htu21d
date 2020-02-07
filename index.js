/*
The MIT License (MIT)

Copyright (c) 2014-2015 bbx10node@gmail.com

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
*/

var i2c = require('i2c');
var fs=require('fs');

var MAX_TEMP_CONVERSION     = 50;   // milliseconds
var MAX_HUMI_CONVERSION     = 16;   // ms
var MAX_RESET_DELAY         = 15;   // ms

var HTU21D_I2CADDR          = 0x40;
var HTU21D_READTEMP_NH      = 0xF3;
var HTU21D_READHUMI_NH      = 0xF5;
var HTU21D_WRITEREG         = 0xE6;
var HTU21D_READREG          = 0xE7;
var HTU21D_RESET            = 0xFE;

// The regular versions of the READTEMP and READHUMI commands depend 
// on clock stretching/hold  which seems to be a problem the 
// raspberry pi i2c controller.

var htu21d = function (i2copts_arg) {
    var i2copts;
    var raspi_check;
    if (typeof i2copts_arg === 'undefined') {
        i2copts = {device: '/dev/i2c-1'};
        raspi_check = raspi_i2c_devname();
        if (raspi_check !== '') {
            //console.log('Raspberry Pi I2C device name is: ', raspi_check);
            i2copts.device = raspi_check;
        }
    }
    else {
        i2copts = i2copts_arg;
        if ((typeof i2copts.device === 'undefined') || (i2copts.device === '')) {
            raspi_check = raspi_i2c_devname();
            if (raspi_check !== '') {
                //console.log('Raspberry Pi I2C device name is: ', raspi_check);
                i2copts.device = raspi_check;
            }
        }
    }
    //console.log('i2c options: ', i2copts);
    this.i2c        = new i2c(HTU21D_I2CADDR, i2copts);
};

htu21d.prototype.readTemperature = function(callback) {
    var that = this;
    this.i2c.writeByte(HTU21D_READTEMP_NH, function(err, data) {
      if (err) {
        return callback(err, null);
      } else {
            setTimeout(function() {
                that.i2c.read(3, function(err, data) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        if ((data.length === 3) && calc_crc8(data, 3)) {
                            var rawtemp = ((data[0] << 8) | data[1]) & 0xFFFC;
                            var temperature = ((rawtemp / 65536.0) * 175.72) - 46.85;
                            //console.log("Temperature, C:", temperature.toFixed(1));
                            return callback(null, temperature.toFixed(1));
                        }
                    }
                });
            }, MAX_TEMP_CONVERSION);
        }
    });
};

htu21d.prototype.readHumidity = function(callback) {
    var that = this;
    this.i2c.writeByte(HTU21D_READHUMI_NH, function(err) {
        if (err) {
            return callback(err, null);
        }
        else {
            setTimeout(function() {
                that.i2c.read(3, function(err, data) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        if ((data.length === 3) && calc_crc8(data, 3)) {
                            var rawhumi = ((data[0] << 8) | data[1]) & 0xFFFC;
                            var humidity = ((rawhumi / 65536.0) * 125.0) - 6.0;
                            //console.log("Relative Humidity, %:", humidity);
                            return callback(null, humidity.toFixed(1));
                        }
                    }
                });
            }, MAX_HUMI_CONVERSION);
        }
    });

};

// buf = 3 bytes from the HTU21D-F for temperature or humidity
//       2 data bytes and 1 crc8 byte
// len = number of bytes in buf but it must be 3.
// return value < 0 error
// return value = 0 CRC good
// return value > 0 CRC bad
function calc_crc8(buf, len)
{
    var dataandcrc;
    // Generator polynomial: x**8 + x**5 + x**4 + 1 = 1001 1000 1
    var poly = 0x98800000;
    var i;

    if (len === null) return -1;
    if (len != 3) return -1;
    if (buf === null) return -1;

    // Justify the data on the MSB side. Note the poly is also
    // justified the same way.
    dataandcrc = (buf[0] << 24) | (buf[1] << 16) | (buf[2] << 8);
    for (i = 0; i < 24; i++) {
        if (dataandcrc & 0x80000000)
            dataandcrc ^= poly;
        dataandcrc <<= 1;
    }
    return (dataandcrc === 0);
}


// If the system is a Raspberry Pi return the correct i2c device name. Else
// return empty string.
function raspi_i2c_devname()
{
    try {
        var revisionBuffer = fs.readFileSync('/sys/module/bcm2708/parameters/boardrev');
        var revisionInt = parseInt(revisionBuffer.toString(), 10);
        //console.log('Raspberry Pi board revision: ', revisionInt);
        // Older boards use i2c-0, newer boards use i2c-1
        if ((revisionInt === 2) || (revisionInt === 3)) {
            return '/dev/i2c-0';
        }
        else {
            return '/dev/i2c-1';
        }
    }
    catch(e) {
        if (e.code === 'ENOENT') {
            //console.log('Not a Raspberry Pi');
            return '';
        }
        else {
            throw e;
        }
    }
}

module.exports = htu21d;
