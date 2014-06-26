#ifndef COMPASS_H
#define COMPASS_H

#include "motor.h"
#include "blimputils.h"


//when deciding to change heading, how much to alter the current heading by
const int AUTO_HEADING_DELTA = 5;

const int HEADING_THRESHOLD = 5;


//compass module
int HMC6352Address = 0x42;
// This is calculated in the setup() function
int slaveAddress;

int currentHeading = 0;
int requiredHeading = -1;

byte headingData[2];
int headingValue;


void compassSetup(){
  slaveAddress = HMC6352Address >> 1;   // This results in 0x21 as the address to pass to TWI
}



int readAngle(){

  Wire.beginTransmission(slaveAddress);
  Wire.write("A");              // The "Get Data" command
  Wire.endTransmission();
  //delay doesn't work when used in an interrupt
  delay(10);                   // The HMC6352 needs at least a 70us (microsecond) delay
  // after this command.  Using 10ms just makes it safe
  // Read the 2 heading bytes, MSB first
  // The resulting 16bit word is the compass heading in 10th's of a degree
  // For example: a heading of 1345 would be 134.5 degrees
  Wire.requestFrom(slaveAddress, 2);        // Request the 2 byte heading (MSB comes first)
  int i = 0;
  while(Wire.available() && i < 2) {
    headingData[i] = Wire.read();
    i++;
  }
  headingValue = headingData[0]*256 + headingData[1];  // Put the MSB and LSB together
  
  return (headingValue / 10);

}


void checkCompass(){
 // Serial.print("compass calc, ");
  currentHeading = readAngle();
  
  //if the altitude requirement has not yet been set
  if(requiredHeading == -1){
    requiredHeading = currentHeading;
  }
//  Serial.print(currentHeading);
//  Serial.print(", ");
//  Serial.println(requiredHeading);
  
  
  //first set the values of the motors to those from the server
  leftMotorInput = serverLeftMotor;
  rightMotorInput = serverRightMotor;
  
  
  int turnSize = turnDirection(requiredHeading,currentHeading);
  // if the difference between the two angles is greater than the threshold
  if(turnSize > HEADING_THRESHOLD || turnSize < -HEADING_THRESHOLD){
    if(turnSize > 0){
 //     Serial.println("turn right");
      //turn right
      // add the turn values to the server input to try and maintain the right heading
      leftMotorInput += AUTO_MOTOR_MAX;
      rightMotorInput += -AUTO_MOTOR_MAX;
    }else{
   //   Serial.println("turn left");
      //turn left
      // add the turn values to the server input to try and maintain the right heading
      leftMotorInput += -AUTO_MOTOR_MAX;
      rightMotorInput += AUTO_MOTOR_MAX;
    }
  }else{
   //   Serial.println("no turn");
  }
}



#endif

