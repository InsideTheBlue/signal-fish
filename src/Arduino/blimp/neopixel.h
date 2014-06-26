#ifndef NEOPIXEL_H
#define NEOPIXEL_H

// IMPORTANT: To reduce NeoPixel burnout risk, add 1000 uF capacitor across
// pixel power leads, add 300 - 500 Ohm resistor on first pixel's data input
// and minimize distance between Arduino and first pixel.  Avoid connecting
// on a live circuit...if you must, connect GND first.

const int NEOPIXEL_PIN = 9;
const int LED_COUNT = 20;

// Parameter 1 = number of pixels in strip
// Parameter 2 = Arduino pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(LED_COUNT, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

int ledInput;

void neoPixelSetup() {
  pinMode(NEOPIXEL_PIN, OUTPUT);
  
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
}

int mode = 0;
volatile int submode = 0;
volatile int submodeDir = 1;

int r = 10;
int g = 10;
int b = 255;

void setLedMode(int m){
  if(m == mode){
   return; 
  }
  mode = m;
  submode = 0; 
  if(m == 0){
    r = random(0,255);
    g = random(0,255);
    b = random(0,255);
  }else if(m == 1){
    r = random(10,255);
    g = random(10,255);
    b = 255;
  }else if(m == 2){
    r = random(0,255);
    g = random(0,255);
    b = random(0,255);
  }
}


void ledInterrupt(){
  /*
  for(int i = 0; i < LED_COUNT; ++i){
    //digitalWrite(LEDPIN, !digitalRead(LEDPIN));
    if(strip.getPixelColor(i) == 0){
      strip.setPixelColor(i,255,255,255);
    }else{
      strip.setPixelColor(i,0,0,0);
    }
  }
  strip.show();
  */
  if (mode == 0){
    
    strip.setBrightness(255);
  
    for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i,0,0,0);
    }
  
    if(submode == 0){
      strip.setPixelColor(6,r,g,b);
      strip.setPixelColor(5,r,g,b);
    }else if (submode == 1){
      strip.setPixelColor(6,r,g,b);
      strip.setPixelColor(5,r,g,b);
      strip.setPixelColor(4,r,g,b);
      strip.setPixelColor(7,r,g,b);
    }else if(submode == 2){
      strip.setPixelColor(6,r,g,b);
      strip.setPixelColor(5,r,g,b);
      strip.setPixelColor(4,r,g,b);
      strip.setPixelColor(7,r,g,b);
      strip.setPixelColor(3,r,g,b);
      strip.setPixelColor(8,r,g,b);
    }else if (submode == 3){
      strip.setPixelColor(4,r,g,b);
      strip.setPixelColor(7,r,g,b);
      strip.setPixelColor(3,r,g,b);
      strip.setPixelColor(8,r,g,b); 
    }else if(submode == 4){
      strip.setPixelColor(3,r,g,b);
      strip.setPixelColor(8,r,g,b);
      strip.setPixelColor(2,r,g,b);
      strip.setPixelColor(9,r,g,b);
      strip.setPixelColor(1,r,g,b);
      strip.setPixelColor(10,r,g,b);
    }else if(submode == 5){
      strip.setPixelColor(2,r,g,b);
      strip.setPixelColor(9,r,g,b);
      strip.setPixelColor(1,r,g,b);
      strip.setPixelColor(10,r,g,b);
      strip.setPixelColor(0,r,g,b);
      strip.setPixelColor(11,r,g,b);
    }else if(submode == 6){
      strip.setPixelColor(1,r,g,b);
      strip.setPixelColor(10,r,g,b);
      strip.setPixelColor(0,r,g,b);
      strip.setPixelColor(11,r,g,b);
      strip.setPixelColor(19,r,g,b);
      strip.setPixelColor(12,r,g,b);
    }else if(submode == 7){
      strip.setPixelColor(0,r,g,b);
      strip.setPixelColor(11,r,g,b);
      strip.setPixelColor(19,r,g,b);
      strip.setPixelColor(12,r,g,b);
      strip.setPixelColor(18,r,g,b);
      strip.setPixelColor(13,r,g,b);
    }else if(submode == 8){
      strip.setPixelColor(19,r,g,b);
      strip.setPixelColor(12,r,g,b);
      strip.setPixelColor(18,r,g,b);
      strip.setPixelColor(13,r,g,b);
      strip.setPixelColor(17,r,g,b);
      strip.setPixelColor(14,r,g,b);
    }else if(submode == 9){
        strip.setPixelColor(18,r,g,b);
        strip.setPixelColor(13,r,g,b);
        strip.setPixelColor(17,r,g,b);
        strip.setPixelColor(14,r,g,b);
        strip.setPixelColor(16,r,g,b);
        strip.setPixelColor(15,r,g,b);
    }else if (submode == 10){
      strip.setPixelColor(17,r,g,b);
      strip.setPixelColor(14,r,g,b);
      strip.setPixelColor(16,r,g,b);
      strip.setPixelColor(15,r,g,b);
    }else if (submode == 11){
      strip.setPixelColor(16,r,g,b);
      strip.setPixelColor(15,r,g,b);
    }
    submode = submode == 11 ? 0 : submode + 1;
  }else if( mode == 1){
    for(uint16_t i=0; i<strip.numPixels(); i++) {
          strip.setPixelColor(i,0,0,0);
      }
    if(submode == 0){
      submode = 1;
      strip.setPixelColor(6,r,g,b);
      strip.setPixelColor(7,r,g,b);
      strip.setPixelColor(8,r,g,b);
      strip.setPixelColor(9,r,g,b);
      strip.setPixelColor(10,r,g,b);
      strip.setPixelColor(11,r,g,b);
      strip.setPixelColor(12,r,g,b);
      strip.setPixelColor(13,r,g,b);
      strip.setPixelColor(14,r,g,b);
      strip.setPixelColor(15,r,g,b);
    }else{
      submode = 0;
      strip.setPixelColor(5,r,g,b);
      strip.setPixelColor(4,r,g,b);
      strip.setPixelColor(3,r,g,b);
      strip.setPixelColor(2,r,g,b);
      strip.setPixelColor(1,r,g,b);
      strip.setPixelColor(0,r,g,b);
      strip.setPixelColor(19,r,g,b);
      strip.setPixelColor(18,r,g,b);
      strip.setPixelColor(17,r,g,b);
      strip.setPixelColor(16,r,g,b);
    }
  }else if (mode == 2){
    for(uint16_t i=0; i<strip.numPixels(); i++) {
          strip.setPixelColor(i,r,g,b);
      }
      strip.setBrightness(submode);
      if(submode >= 250){
        submodeDir = -10; 
        submode = 250;
      }else if(submode <= 0){
        submodeDir = 10;
        submode = 0;
      }
      submode = submode + submodeDir;
  }
  
  strip.show();
}

/*
void loop() {
  
 //pixBlink(255,0,20,60,40);

 // pixSwipe(255,255,255, 60);
  
}
*/
void pixBlink(int r,int g,int b, int s1,int s2){
 for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i,r,g,b);
      strip.show();
      
  }
  delay(s1);
  
    for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, 0,0,0);
      strip.show();
      
  }
  delay(s2);
}

void pixSwipe(int r,int g,int b, int s){
  
 
   strip.setBrightness(255);
  
for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  

strip.setPixelColor(6,r,g,b);
strip.setPixelColor(5,r,g,b);
strip.show();
delay(s);
  

 
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  
strip.setPixelColor(6,r,g,b);
strip.setPixelColor(5,r,g,b);
strip.setPixelColor(4,r,g,b);
strip.setPixelColor(7,r,g,b);
strip.show();
delay(s);
  
    for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
strip.setPixelColor(6,r,g,b);
strip.setPixelColor(5,r,g,b);
strip.setPixelColor(4,r,g,b);
strip.setPixelColor(7,r,g,b);
strip.setPixelColor(3,r,g,b);
strip.setPixelColor(8,r,g,b);
strip.show();
delay(s);

  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  strip.setPixelColor(4,r,g,b);
strip.setPixelColor(7,r,g,b);
strip.setPixelColor(3,r,g,b);
strip.setPixelColor(8,r,g,b);
strip.show();
delay(s);



  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  strip.setPixelColor(3,r,g,b);
strip.setPixelColor(8,r,g,b);
strip.setPixelColor(2,r,g,b);
strip.setPixelColor(9,r,g,b);
strip.setPixelColor(1,r,g,b);
strip.setPixelColor(10,r,g,b);
strip.show();
delay(s);


  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  strip.setPixelColor(2,r,g,b);
strip.setPixelColor(9,r,g,b);
strip.setPixelColor(1,r,g,b);
strip.setPixelColor(10,r,g,b);
strip.setPixelColor(0,r,g,b);
strip.setPixelColor(11,r,g,b);
strip.show();
delay(s);


  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  strip.setPixelColor(1,r,g,b);
strip.setPixelColor(10,r,g,b);
strip.setPixelColor(0,r,g,b);
strip.setPixelColor(11,r,g,b);
strip.setPixelColor(19,r,g,b);
strip.setPixelColor(12,r,g,b);
strip.show();
delay(s);


  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  strip.setPixelColor(0,r,g,b);
strip.setPixelColor(11,r,g,b);
strip.setPixelColor(19,r,g,b);
strip.setPixelColor(12,r,g,b);
strip.setPixelColor(18,r,g,b);
strip.setPixelColor(13,r,g,b);
strip.show();
delay(s);

  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  strip.setPixelColor(19,r,g,b);
strip.setPixelColor(12,r,g,b);
strip.setPixelColor(18,r,g,b);
strip.setPixelColor(13,r,g,b);
strip.setPixelColor(17,r,g,b);
strip.setPixelColor(14,r,g,b);
strip.show();
delay(s);

  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  strip.setPixelColor(18,r,g,b);
strip.setPixelColor(13,r,g,b);
strip.setPixelColor(17,r,g,b);
strip.setPixelColor(14,r,g,b);
strip.setPixelColor(16,r,g,b);
strip.setPixelColor(15,r,g,b);
strip.show();
delay(s);


  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
  strip.setPixelColor(17,r,g,b);
strip.setPixelColor(14,r,g,b);
strip.setPixelColor(16,r,g,b);
strip.setPixelColor(15,r,g,b);
strip.show();
delay(s);

  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i,0,0,0);
  }
strip.setPixelColor(16,r,g,b);
strip.setPixelColor(15,r,g,b);
strip.show();
delay(s);


}

void pixRoll(int r,int g, int b, int s){
    
    for(uint16_t i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i,0,0,0);
    }
    
    
    strip.setPixelColor(6,r,g,b);
    strip.setPixelColor(7,r,g,b);
    strip.setPixelColor(8,r,g,b);
    strip.setPixelColor(9,r,g,b);
    strip.setPixelColor(10,r,g,b);
    strip.setPixelColor(11,r,g,b);
    strip.setPixelColor(12,r,g,b);
    strip.setPixelColor(13,r,g,b);
    strip.setPixelColor(14,r,g,b);
    strip.setPixelColor(15,r,g,b);
    strip.show();
    delay(s);
    
    
    for(uint16_t i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i,0,0,0);
    }
    
    strip.setPixelColor(5,r,g,b);
    strip.setPixelColor(4,r,g,b);
    strip.setPixelColor(3,r,g,b);
    strip.setPixelColor(2,r,g,b);
    strip.setPixelColor(1,r,g,b);
    strip.setPixelColor(0,r,g,b);
    strip.setPixelColor(19,r,g,b);
    strip.setPixelColor(18,r,g,b);
    strip.setPixelColor(17,r,g,b);
    strip.setPixelColor(16,r,g,b);
    strip.show();
    delay(s);
    
    
}
/*
void sequenceSwipe2(int s){

}

//--
//--
void sequenceRandomize(int r,int g,int b, int s){

 
  
  int[] out;

int start = 0;
int ending = 42;
int count =random(5, 35);

	int num = start + Math.random()*(ending - start);

	for(i = 0; i < count; ++i){
		while(out.indexOf(num) != -1){
			num = start + Math.random()*(end - start);
		}
                strip.setPixelColor(num,r,g,b);
		out.push(num);
	}
  strip.show();
  delay(s);


}
//--
//--
void sequenceRoll(int r,int g int b, int s){
  
 for(int i=0;i<10;i++){
strip.setPixelColor(i+21,r,g,b);
strip.show();
}
 delay(s); 
  
  for(int i=0;i<10;i++){
strip.setPixelColor(i+1,r,g,b);
strip.show();
}
delay(s); 

 for(int i=0;i<10;i++){
strip.setPixelColor(22-i,r,g,b);
strip.show();
}
delay(s); 

 for(int i=0;i<10;i++){
strip.setPixelColor(42-1,r,g,b);
strip.show();
}
delay(s); 
  
}
//--
//--
void sequenceMotionBiColor(int r1,int g1,int b1,int r2,int g2,int b2,int s){

}
//--
//--
void sequenceBlink(int r,int g,int b,int s1, int s2){}
*/


#endif
