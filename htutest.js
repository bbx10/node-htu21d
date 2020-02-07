var i2c_htu21d = require('./index.js');

// If using a Raspberry Pi, do not specify the i2c device name.
// The correct name will be used based on the board revision.
// Older boards use /dev/i2c-0, newer ones use /dev/i2c-1.
// If using any other board, specify the device name.
// For example: i2c_htu21d({device: '/dev/i2c-1/'});
var htu21df = new i2c_htu21d();

htu21df.readTemperature(function (err, temp) {
    console.log('Temperature, C:', temp);

    htu21df.readHumidity(function (err, humidity) {
        console.log('Humidity, RH %:', humidity);

        console.log('new i2c_htu21d({});');
        var htu21df_1 = new i2c_htu21d({});
        console.log("new i2c_htu21d({device: ''});");
        var htu21df_2 = new i2c_htu21d({device: ''});
        console.log("new i2c_htu21d({device: '/dev/i2c-1'});");
        var htu21df_3 = new i2c_htu21d({device: '/dev/i2c-1'});
        console.log("new i2c_htu21d({otherops: 'nada'});");
        var htu21df_4 = new i2c_htu21d({otherops: 'nada'});
        console.log("new i2c_htu21d({device: '/dev/i2c-9'});");
        try {
            var htu21df_5 = new i2c_htu21d({device: '/dev/i2c-9'});
        } catch (e) {
            console.log('i2c fail');
        }
    });
});

