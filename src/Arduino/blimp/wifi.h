#ifndef WIFI_H
#define WIFI_H


/*
Adafruit Wifi Module
https://www.adafruit.com/products/1510

*/

#define WLAN_SSID       "myNetwork"        // cannot be longer than 32 characters!
#define WLAN_PASS       "myPassword"
// Security can be WLAN_SEC_UNSEC, WLAN_SEC_WEP, WLAN_SEC_WPA or WLAN_SEC_WPA2
#define WLAN_SECURITY   WLAN_SEC_WPA2


// These are the interrupt and control pins
#define ADAFRUIT_CC3000_IRQ   3  // MUST be an interrupt pin!
// These can be any two pins
#define ADAFRUIT_CC3000_VBAT  5
#define ADAFRUIT_CC3000_CS    10
// Use hardware SPI for the remaining pins
// On an UNO, SCK = 13, MISO = 12, and MOSI = 11
Adafruit_CC3000 cc3000 = Adafruit_CC3000(ADAFRUIT_CC3000_CS, ADAFRUIT_CC3000_IRQ, ADAFRUIT_CC3000_VBAT,
                                         SPI_CLOCK_DIVIDER); // you can change this clock speed

void setupWifi(){
  if (!cc3000.begin()){
    Serial.println(F("Unable to initialise the CC3000! Check your wiring?"));
    while(1);
  }

}




/*
  This function performs a scan and prints out all the wifi networks 
  and each network's signal strength.
  
  This function blocks the main loop, so it should not be called too often.
*/
String listSSIDResults(void)
{
  uint8_t valid, rssi, sec, index;
  char ssidname[33]; 
  String output = "";
  index = cc3000.startSSIDscan();
  while (index) {
    index--;
    valid = cc3000.getNextSSID(&rssi, &sec, ssidname);
    // invalid ssid characters: + . ] ? $ TAB and trailing spaces
   // if(valid){
      output += String(ssidname) + '$' + String(rssi); 
  //    if(index > 0){
        output += '?';
   //   }
   // }
  }
  cc3000.stopSSIDscan();  
  return output;
}

#endif
