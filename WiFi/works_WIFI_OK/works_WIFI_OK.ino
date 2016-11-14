#include <SoftwareSerial.h>
 
#define DEBUG false
// Lavy Motor A pripojeny medzi A+ a A-
int PIN_EN1 = 10; // ovladanie rychlosti
int PIN_IN1 = 11; // smer
int PIN_IN2 = 12; // smer

// Pravy Motor B pripojeny medzi B+ a B-
int PIN_EN2 = 5; // ovladanie rychlosti
int PIN_IN3 = 6; // smer
int PIN_IN4 = 7; // smer
 
SoftwareSerial esp8266(2,3); // make RX Arduino line is pin 2, make TX Arduino line is pin 3.
                             // This means that you need to connect the TX line from the esp to the Arduino's pin 2
                             // and the RX line from the esp to the Arduino's pin 3
void setup()
{
  Serial.begin(9600);
  esp8266.begin(115200); // your esp's baud rate might be different
  
  pinMode(PIN_EN1, OUTPUT);
  pinMode(PIN_IN1, OUTPUT);
  pinMode(PIN_IN2, OUTPUT);

  pinMode(PIN_EN2, OUTPUT);
  pinMode(PIN_IN3, OUTPUT);
  pinMode(PIN_IN4, OUTPUT);

  pinMode(13, OUTPUT);
  
  digitalWrite(13, LOW);
   
  sendCommand("AT+RST\r\n",2000,DEBUG); // reset module
  sendCommand("AT+CWMODE=1\r\n",1000,DEBUG); // configure as access point
  sendCommand("AT+CWJAP=\"Doma WIFI\",\"00024D2B8315A\"\r\n",3000,DEBUG);
  delay(10000);
  sendCommand("AT+CIFSR\r\n",1000,DEBUG); // get ip address
  sendCommand("AT+CIPMUX=1\r\n",1000,DEBUG); // configure for multiple connections
  sendCommand("AT+CIPSERVER=1,80\r\n",1000,DEBUG); // turn on server on port 80
  
  digitalWrite(13, HIGH);
  Serial.println("Server Ready");
}
 
void loop()
{
  if(esp8266.available()) // check if the esp is sending a message 
  {
 
    
    if(esp8266.find("+IPD,"))
    {
     digitalWrite(13, LOW);
     delay(1000); // wait for the serial buffer to fill up (read all the serial data)
     // get the connection id so that we can then disconnect
     int connectionId = esp8266.read()-48; // subtract 48 because the read() function returns 
                                           // the ASCII decimal value and 0 (the first decimal number) starts at 48
          
     esp8266.find("pin="); // advance cursor to "pin="
          
     int pinNumber = (esp8266.read()-48); // get first number i.e. if the pin 13 then the 1st number is 1
     int secondNumber = (esp8266.read()-48);
     if(secondNumber>=0 && secondNumber<=9)
     {
      pinNumber*=10;
      pinNumber +=secondNumber; // get second number, i.e. if the pin number is 13 then the 2nd number is 3, then add to the first number
     }
     
     // Serial.print(pinNumber);
     
     //digitalWrite(pinNumber, !digitalRead(pinNumber)); // toggle pin    
     
     // build string that is send back to device that is requesting pin toggle
     String content;
     content = "Pin ";
     content += pinNumber;     

     if (pinNumber == 1){
      content += "LEFT";
     }

     if (pinNumber == 2){
      content += "RIGHT";
     }

     if (pinNumber == 3){
      content += "TOP";
     }

     if (pinNumber == 4){
      content += "BACK";
     }
     
     sendHTTPResponse(connectionId,content);
     
     // make close command
     String closeCommand = "AT+CIPCLOSE="; 
     closeCommand+=connectionId; // append connection id
     closeCommand+="\r\n";
     
     sendCommand(closeCommand,1000,DEBUG); // close connection
     setMotorPower(pinNumber);
     digitalWrite(13, HIGH);
    }
  }
}
 
/*
* Name: sendData
* Description: Function used to send data to ESP8266.
* Params: command - the data/command to send; timeout - the time to wait for a response; debug - print to Serial window?(true = yes, false = no)
* Returns: The response from the esp8266 (if there is a reponse)
*/
String sendData(String command, const int timeout, boolean debug)
{
    String response = "";
    
    int dataSize = command.length();
    char data[dataSize];
    command.toCharArray(data,dataSize);
           
    esp8266.write(data,dataSize); // send the read character to the esp8266
    if(debug)
    {
      Serial.println("\r\n====== HTTP Response From Arduino ======");
      Serial.write(data,dataSize);
      Serial.println("\r\n========================================");
    }
    
    long int time = millis();
    
    while( (time+timeout) > millis())
    {
      while(esp8266.available())
      {
        
        // The esp has data so display its output to the serial window 
        char c = esp8266.read(); // read the next character.
        response+=c;
      }  
    }
    
    if(debug)
    {
      Serial.print(response);
    }
    
    return response;
}
 
/*
* Name: sendHTTPResponse
* Description: Function that sends HTTP 200, HTML UTF-8 response
*/
void sendHTTPResponse(int connectionId, String content)
{
     
     // build HTTP response
     String httpResponse;
     String httpHeader;
     // HTTP Header
     httpHeader = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n"; 
     httpHeader += "Content-Length: ";
     httpHeader += content.length();
     httpHeader += "\r\n";
     httpHeader += "Access-Control-Allow-Origin: *";
     httpHeader +="Connection: close\r\n\r\n";
     httpResponse = httpHeader + content + " "; // There is a bug in this code: the last character of "content" is not sent, I cheated by adding this extra space
     sendCIPData(connectionId,httpResponse);
}
 
/*
* Name: sendCIPDATA
* Description: sends a CIPSEND=<connectionId>,<data> command
*
*/
void sendCIPData(int connectionId, String data)
{
   String cipSend = "AT+CIPSEND=";
   cipSend += connectionId;
   cipSend += ",";
   cipSend +=data.length();
   cipSend +="\r\n";
   sendCommand(cipSend,1000,DEBUG);
   sendData(data,1000,DEBUG);
}
 
/*
* Name: sendCommand
* Description: Function used to send data to ESP8266.
* Params: command - the data/command to send; timeout - the time to wait for a response; debug - print to Serial window?(true = yes, false = no)
* Returns: The response from the esp8266 (if there is a reponse)
*/
String sendCommand(String command, const int timeout, boolean debug)
{
    String response = "";
           
    esp8266.print(command); // send the read character to the esp8266
    
    long int time = millis();
    
    while( (time+timeout) > millis())
    {
      while(esp8266.available())
      {
        
        // The esp has data so display its output to the serial window 
        char c = esp8266.read(); // read the next character.
        response+=c;
      }  
    }
    
    if(debug)
    {
      Serial.print(response);
    }
    
    return response;
}


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

void setMotorPower(int pinNumber){

// LEFT
 if (pinNumber == 1){
      motor(0, 255, 0);
      delay(2000);
      motor(0, 0, 0);
     }

// RIGHT
     if (pinNumber == 2){
       motor(1, 255, 0);
      delay(2000);
      motor(1, 0, 0);
     }

// TOP
     if (pinNumber == 3){
      motor(0, 255, 0);
      motor(1, 255, 0);
      delay(1500);
      motor(0, 0, 0);
      motor(1, 0, 0);
     }
// BACK
     if (pinNumber == 4){
      motor(0, 255, 1);
      motor(1, 255, 1);
      delay(1500);
      motor(0, 0, 0);
      motor(1, 0, 0);
     }

      // ROTATE
      if (pinNumber == 5){
      motor(0, 255, 1);      
      delay(10000);
      motor(0, 0, 0);      
     }
  
}
