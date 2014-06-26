#ifndef BAROMETER_H
#define BAROMETER_H

/* 
   Connections
   ===========
   Connect SCL to analog 5
   Connect SDA to analog 4
   Connect VDD to 5V DC
   Connect GROUND to common ground
*/  
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

/*
Since we don't really care what the actual height is,
we just need to the changes in height, 
*/
const float seaLevelPressure = SENSORS_PRESSURE_SEALEVELHPA;

const float ALTITUDE_THRESHOLD = 0.25;


float requiredAltitude = -1.0;
float currentAltitude;
float lastAltitude;

//
float averageAlt = 0.0;

void barometerSetup(void) 
{
  /* Initialise the sensor */
  if(!bmp.begin())
  {
    /* There was a problem detecting the BMP085 ... check your connections */
    Serial.print("Ooops, no BMP085 detected ... Check your wiring or I2C ADDR!");
    while(1);
  }
}



//Returns the number of meters above sea level
float readAltitude(){  
  /* Get a new sensor event */ 
  sensors_event_t event;
  bmp.getEvent(&event);
  
  float alt = -1.0;
  
  if (event.pressure){
    float temperature;
    bmp.getTemperature(&temperature);
    
    alt = bmp.pressureToAltitude(seaLevelPressure, event.pressure, temperature) + 100;
    
    if(averageAlt != 0.0){
      averageAlt = (averageAlt + alt)/2.0; 
    }else{
      averageAlt = alt; 
    }
  }
  
  
  return alt;
}


void checkAltitude(){
  //Serial.print("alt calc, ");
   currentAltitude = readAltitude();
  //Serial.print(currentAltitude);
  //Serial.print(", ");
  //Serial.println(requiredAltitude);
  if(currentAltitude == -1.0){
    currentAltitude = lastAltitude; 
  }else{
    lastAltitude = currentAltitude;
  }
  
  //if the altitude requirement has not yet been set
  if(requiredAltitude == -1.0){
    requiredAltitude = currentAltitude;
  }
   
  // if the server isn't telling me to change altitude
  // if we didn't do this check, when you want to change altitude,
  // the blimp would always counteract you to get back to the original height
  if(serverBackMotor == 0){
    if(currentAltitude > requiredAltitude + ALTITUDE_THRESHOLD){
    //  Serial.println("go down");
      //go down
      backMotorInput = -AUTO_BACK_MOTOR_MAX;
    }else if (currentAltitude < requiredAltitude - ALTITUDE_THRESHOLD){
    //  Serial.println("go up.");
      //go up 
      backMotorInput = AUTO_BACK_MOTOR_MAX;
    }else{
    // Serial.print("go nowheres: ");
    // Serial.println( requiredAltitude - currentAltitude);
    }
  }else{
    backMotorInput = serverBackMotor;
  }
}


#endif
