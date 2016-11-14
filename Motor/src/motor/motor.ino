// Lavy Motor A pripojeny medzi A+ a A-
int PIN_EN1 = 10; // ovladanie rychlosti
int PIN_IN1 = 11; // smer
int PIN_IN2 = 12; // smer

// Pravy Motor B pripojeny medzi B+ a B-
int PIN_EN2 = 5; // ovladanie rychlosti
int PIN_IN3 = 6; // smer
int PIN_IN4 = 7; // smer

// the setup function runs once when you press reset or power the board
void setup() {
  pinMode(PIN_EN1, OUTPUT);
  pinMode(PIN_IN1, OUTPUT);
  pinMode(PIN_IN2, OUTPUT);

  pinMode(PIN_EN2, OUTPUT);
  pinMode(PIN_IN3, OUTPUT);
  pinMode(PIN_IN4, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  uint8_t i;
  
  // motor ide dopredu a postupne zrychluje
  for (i=0; i<255; i++) {
    motor(0, i, 1);  
    delay(10);
 }
 // a spomaluje
  for (i=255; i!=0; i--) {
    motor(0, i, 1);   
    delay(10);
 }

 // motor ide dopredu a postupne zrychluje
  for (i=0; i<255; i++) {
    motor(1, i, 1);  
    delay(10);
 }
 // a spomaluje
  for (i=255; i!=0; i--) {
    motor(1, i, 1);   
    delay(10);
 }

}

// Funkcia pre chod motorov
// motor:    0 pre lavy motor A,   1 pre pravy motor B
// rychlost: 0 neide vobec,      255 ide plnou rychlostou
// smer:     0 ide vzad,           1 ide vpred

void motor(int motor, int rychlost, int smer){
  boolean inPin1 = LOW;
  boolean inPin2 = HIGH;

  if(smer == 1){
    inPin1 = HIGH;
    inPin2 = LOW;
  }

  if(motor == 0){
    digitalWrite(PIN_IN1, inPin1);
    digitalWrite(PIN_IN2, inPin2);
    analogWrite(PIN_EN1, rychlost);
  }

  if(motor == 1){
    digitalWrite(PIN_IN3, inPin2);
    digitalWrite(PIN_IN4, inPin1);
    analogWrite(PIN_EN2, rychlost);
  }
 
}
