#ifndef INTERRUPT_H
#define INTERRUPT_H

// from http://www.engblaze.com/microcontroller-tutorial-avr-and-arduino-timer-interrupts/
// great tutorial on arduino interrupts
void interruptSetup(){
  
  // initialize Timer1
  cli();             // disable global interrupts
  TCCR1A = 0;        // set entire TCCR1A register to 0
  TCCR1B = 0;
  // set compare match register to desired timer count:
  // on a 16MHz board 15624 is 1s, for 100ms, 1562; 50ms: 781;
  OCR1A = 1562;
  // turn on CTC mode:
  TCCR1B |= (1 << WGM12);
  // Set CS10 and CS12 bits for 1024 prescaler:
  TCCR1B |= (1 << CS10);
  TCCR1B |= (1 << CS12);
  TIMSK1 |= (1 << OCIE1A);  // enable timer compare interrupt:
  sei();           // enable global interrupts
}

// the interrupt function should be as short as possible and 
// should not include any calls to delay() or millis()
ISR(TIMER1_COMPA_vect) {
  ledInterrupt();
  motorInterrupt();
}

#endif

