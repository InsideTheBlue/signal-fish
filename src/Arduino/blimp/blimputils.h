#ifndef BLIMP_UTILS_H
#define BLIMP_UTILS_H

//TRIG
#include <math.h>
//END TRIG

/*
from
http://stackoverflow.com/questions/9072320/split-string-into-string-array

This function sort of emulates String.split() functionality. 
It takes a string, searches for the nth time the supplied 
separator appears (where n is the index value supplied) 
and returns the string between n and the next separator. 
*/
String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}

float deg2Rad(int deg){
 return (deg * M_PI)/180; 
}

int rad2Deg(float rad){
 return int((rad * 180)/M_PI); 
}

/*
This function will return the size and direction of the shortest distance (in degrees) of 2 angles
*/
int turnDirection(int newAngle,int oldAngle){
 float oldRad =  deg2Rad(oldAngle);
 float newRad = deg2Rad(newAngle);
 
 float angle = atan2(sin(newRad-oldRad), cos(newRad-oldRad));
 //return -ve for left, +ve for right
 return rad2Deg(angle);
}



#endif
