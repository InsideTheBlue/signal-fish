//WIFI
#include <Adafruit_CC3000.h>
#include <ccspi.h>
#include <SPI.h>
#include <string.h>
#include "wifi.h"
//END WIFI


//MOTORS
#include <SoftwareSerial.h>
#include <PololuQik.h>
#include "motor.h"
//END MOTORS

//LED
#include <Adafruit_NeoPixel.h>
#include "neopixel.h"
//END LED


//WIRE is used by both Compass and Barometer
#include <Wire.h>

//BAROMETER
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP085_U.h>
#include "barometer.h"
//END BAROMETER

#include "sonar.h"
#include "compass.h"
#include "blimputils.h"

//INTERRUPT
#include <avr/io.h>
#include <avr/interrupt.h>
#include "interrupt.h"
//END INTERRUPT


//Data for the serial events
String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete


long prevTime = 0;
const long waitTime = 100;
long prevWifiTime = 0;
const long wifiWaitTime = 10000;

boolean enabled = false;



void setup() {
  //set the baudrate to whatever your xbees are set at.
  //in our case, 38400
  Serial.begin(38400);
  motorSetup();
  neoPixelSetup();
  //Wire is used by compass and barometer, so init here
  Wire.begin();
  barometerSetup();
  compassSetup();
  inputString.reserve(200);
  interruptSetup();
}

/*
read the sensors and calculate any required movement to maintain altitude or avoid collision
*/
void checkSensors(){
  
  checkAltitude();
  checkSonar();
  checkCompass();
 
 //more important than anything, if we need to reverse, don't hang around, get reversing.
 if(reverseFlag){
 //  Serial.println("reverse flag triggered");
   leftMotorInput = -AUTO_MOTOR_MAX;
   rightMotorInput = -AUTO_MOTOR_MAX; 
 }
}

void loop() {
     int isEnabled;
     int setAlt = 0;
     int readWifi = 0;
     int serverHeading = -1;
     if (stringComplete) {      
        isEnabled = getValue(inputString,',',0).toInt();
        serverLeftMotor = getValue(inputString,',',1).toInt();
        serverRightMotor = getValue(inputString,',',2).toInt();
        serverBackMotor = getValue(inputString,',',3).toInt();
        ledInput = getValue(inputString,',',4).toInt();
        setAlt = getValue(inputString,',',5).toInt();
        readWifi = getValue(inputString,',',6).toInt();
        serverHeading = getValue(inputString,',',7).toInt();
     
        if(isEnabled == 1){
          enabled = true;  
        }else{
          enabled = false;
          //if not enabled we still need to allow motor input from the server
          leftMotorInput = serverLeftMotor;
          rightMotorInput = serverRightMotor;
          backMotorInput = serverBackMotor;
        }
        
        if(setAlt == 1){
          requiredAltitude = currentAltitude;
        }
        
        if(serverHeading != -1){
          requiredHeading = serverHeading; 
        }
        
        inputString = "";
        stringComplete = false;
     }
     
     //~100 milli loop
     long currentTime = millis();
     if(currentTime - waitTime > prevTime || prevTime == 0){
         prevTime = currentTime;
         
       
       if(enabled){
         //read the sensors and react accordingly
         checkSensors();
         
         String wifi = "";
         if(readWifi == 1){
           setLedMode(0);
           wifi = listSSIDResults();
           setLedMode(ledInput);
         }else{
           wifi = "NONE";
         }
         char sep = ']';
         Serial.print(requiredHeading);
         Serial.print(sep);
         Serial.print(requiredAltitude);
         Serial.print(sep);
         Serial.print(wifi);
         Serial.print('\n');
       }
     }
}



/*
  SerialEvent occurs whenever a new data comes in the
 hardware serial RX.  This routine is run between each
 time loop() runs, so using delay inside loop can delay
 response.  Multiple bytes of data may be available.
 */
 
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read(); 
    // add it to the inputString:
    inputString += inChar;

    if (inChar == '\n') {
      stringComplete = true;
    } 
  }
}
