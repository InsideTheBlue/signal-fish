#ifndef SONAR_H
#define SONAR_H

#include "compass.h"

//the distance at which an object is considered too close to the sonar (cm);
const int SONAR_MIN_DISTANCE = 100; // 1 m

const int sonar1=A0;
const int sonar2=A1;
const int sonar3=A2;
//sonar 4 is not used
const int sonar4=A3;


int readSonar(int _pin){
  long anVolt, inches, cm;
  int sum=0;//Create sum variable so it can be averaged
  int avgrange=60;//Quantity of values to average (sample size)
  for(int i = 0; i < avgrange ; i++)
  {
    //read once and ignore
    analogRead(_pin);
    //Used to read in the analog voltage output that is being sent by the MaxSonar device.
    //Scale factor is (Vcc/512) per inch. A 5V supply yields ~9.8mV/in
    //Arduino analog pin goes from 0 to 1024, so the value has to be divided by 2 to get the actual inches
    anVolt = analogRead(_pin)/2;
    sum += anVolt;
  //  delay(2);
  }  
  inches = sum/avgrange;
  cm = inches * 2.54;
/*  Serial.print(inches);
  Serial.print("in, ");
  Serial.print(cm);
  Serial.print("cm");
  Serial.println();
  */
  //reset sample total
  sum = 0;
  return cm;
}


void checkSonar(){
  //Serial.print("sonar calc,");
  
  int frontSonar = readSonar(sonar1);
  
  //reset reverse flag;
  reverseFlag = false;
  
  
  //we only care to turn if there is something in front of us
  //otherwise we should be happy to just follow the wall if we want
  if(frontSonar < SONAR_MIN_DISTANCE){
  //  Serial.print("something in front ");
  //  Serial.print(frontSonar);
  //  Serial.println(SONAR_MIN_DISTANCE);
    //we only need to read these if the front sonar is triggered, otherwise it's a waste of time
    int leftSonar = readSonar(sonar2);
    int rightSonar = readSonar(sonar3);
    // something ahead and something  to the left, but not to the right
     if(leftSonar < SONAR_MIN_DISTANCE && rightSonar > SONAR_MIN_DISTANCE){
     //  Serial.print(leftSonar);
     //  Serial.println(" turn right");
       //turn right;
       requiredHeading = currentHeading + AUTO_HEADING_DELTA;
       if(requiredHeading >= 360){
          requiredHeading -= 360; 
       }
     }else if (leftSonar < SONAR_MIN_DISTANCE && rightSonar < SONAR_MIN_DISTANCE){
       //something ahead and on both sides, go back;
     //  Serial.println(" reverse flag set");
       reverseFlag = true;
     
     //default action if blocked in front is turn left
     }else{// this case also applies to the opposite case of the "turn right" case, i.e. (rightSonar < SONAR_MIN_DISTANCE && leftSonar < SONAR_MIN_DISTANCE)
      //turn left;
     //  Serial.print(rightSonar);
     // Serial.println(" turn left");
       requiredHeading = currentHeading - AUTO_HEADING_DELTA;
       if(requiredHeading < 0){
          requiredHeading += 360; 
       } 
     }
  }else{
  //  Serial.println("no obstacles");
  }  
  
}

#endif
