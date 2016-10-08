var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var led = new five.Led(13);
  led.blink(1500);

  // Digital
  var PWD = new five.Pin(10);
  var LEFT = new five.Pin(11);
  var RIGT = new five.Pin(12);

  LEFT.high()
  RIGT.low()
  PWD.write(128);


});