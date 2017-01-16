# Motor Arduino

## Propojení motorů s řadičem
Motory v arduino je možné ovládat pouze skr převodník. Dobrý článek popisující technické záležitosti motoru a jeho zapojení najdete např. [zde](http://zschlebnice.sk/kopr/arduino_hbridge.php). Já použil [L293d shield od Deek Robot](http://www.deek-robot.com/productShow.asp?id=17), který umožňuje zapojit dva motory a externí napájení, které je nutné pro silnější motory. Umožňuje připojit až 25V, což by samotné Arduino nikdy nebylo schopné dodat. K propojení s externím zdrojem, můžete použít battery pack pro 4xAAA tužkové baterie. Připojíte je na GND a VIN piny (na obrázku níýe to jsou piny DC9-24V). Dva motory pak připojíte vedle. Pro každý motor dva kabely. První zapojíte na A+, A-, druhý na B+ a B-. Samotné motory pak budeme ovládat přímo, programováním Arduina a nakonec přes JavaScript, tj programováním v NodeJS [s knihovnou](http://johnny-five.io/)

<img src='https://raw.githubusercontent.com/jjarcik/Arduino-Robot/master/Docs/imgs/aaa_pack.jpg' height="200"/>
<img src='https://raw.githubusercontent.com/jjarcik/Arduino-Robot/master/Docs/imgs/drive_l293d_desc.jpg' height="400"/>


## Propojení řadiče s Arduinem Uno
Teď už stačí jen propojit motorshield s Arduinem. K ovládání každého motoru použijeme tři kabely, dva pro směr a jeden pro rychlost. Kabely pro směr napojíme na IN1, IN2 (první motor) a IN3,IN4 (pro druhý motor). Kabely pro rychlost napojíme na EN1 (první motor) a EN2 (druhý motor). Toť vše co máme připojené k shieldu. Nyní musíme zbylých 6 konců (3 a 3) od motor shieldu propojit s Arduinem. Vybereme si libovolných 6 volných PINů na Arduino. Já volil 10,11,12 pro první motor a 5,6,7 pro druhý motor. 

## Programování motorů

### Arduino IDE:
Nejprve motory otestujeme přes Arduino IDE
```
// Motor A pripojeny medzi A+ a A-
int PIN_EN1 = 10; // ovladanie rychlosti
int PIN_IN1 = 11; // smer
int PIN_IN2 = 12; // smer

// the setup function runs once when you press reset or power the board
void setup() {
  pinMode(PIN_EN1, OUTPUT);
  pinMode(PIN_IN1, OUTPUT);
  pinMode(PIN_IN2, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  uint8_t i;

  // motor jde dopredu a postupne zrychluje
  for (i=0; i<255; i++) {
    motor(i, 1);
    delay(10);
 }
 // a spomaluje
  for (i=255; i!=0; i--) {
    motor(i, 1);
    delay(10);
 }
}

void motor(int rychlost, int smer){
  boolean inPin1 = LOW;
  boolean inPin2 = HIGH;

  if(smer == 1){
    inPin1 = HIGH;
    inPin2 = LOW;
  }

  digitalWrite(PIN_IN1, inPin1);
  digitalWrite(PIN_IN2, inPin2);
  analogWrite(PIN_EN1, rychlost);

}

```

### Propojení přes johnny five

```
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
  
  // poloviční rychlost
  PWD.write(128);
});
```
