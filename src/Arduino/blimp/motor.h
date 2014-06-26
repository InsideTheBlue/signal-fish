#ifndef MOTOR_H
#define MOTOR_H

//motor drivers one and two. 
PololuQik2s9v1 motor1(4, 2, 8);
PololuQik2s9v1 motor2(7, 6, A6);


//Max value the motors can run on auto (0-255)
const int AUTO_MOTOR_MAX = 128;
const int AUTO_BACK_MOTOR_MAX = 128;

int leftMotorInput = 0;
int rightMotorInput = 0;
int backMotorInput = 0;

int serverLeftMotor = 0;
int serverRightMotor = 0;
int serverBackMotor = 0;

boolean reverseFlag = false;

void motorSetup(){
  motor1.init();
  motor2.init();
}




//assumes left motor is connected 
//to the M0 input of motor driver 1
void setLeftMotor(int val){
  motor1.setM0Speed(val);
}

//assumes right motor is connected 
//to the M1 input of motor driver 1
void setRightMotor(int val){
  motor1.setM1Speed(val);
}


//assumes back motor is connected 
//to the M0 input of motor driver 2
void setBackMotor(int val){
  motor2.setM0Speed(val); 
}


// tell the motors what to do
void motorInterrupt(){
  setLeftMotor(leftMotorInput);
  setRightMotor(rightMotorInput);
  setBackMotor(backMotorInput);
}

#endif
