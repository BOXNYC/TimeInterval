
class TimeInterval {
  
  constructor( delay ) {
    this.delay = delay || 1000;
    this.events = [];
    this.seconds = Math.floor( Date.now() / 1000 );
    this.stamp = Math.floor( Date.now() / this.delay );
    this.paused = false;
  }
  
  timeCheck() {
    if ( !this.paused && this.events.length && this.minimumSecondsPast )
      this.triggerAll();
    if ( !this.paused ) requestAnimationFrame( this.timeCheck.bind( this ) );
  }
  
  triggerAll() {
    this.events.forEach( callback => callback.call( this, this.seconds ) );
    return this;
  }
  
  pause() {
    if ( !this.paused ) this.paused = true; 
    return this;
  }
  
  resume() {
    if ( !this.paused ) return this;
    this.stamp = Math.floor( Date.now() / this.delay );
    this.paused = false;
    requestAnimationFrame( this.timeCheck.bind( this ) );
    return this;
  }
  
  get minimumSecondsPast() {
    const newSecond = Math.floor( Date.now() / this.delay );
    if ( newSecond != this.stamp ) {
      this.seconds = Math.floor( Date.now() / 1000 );
      this.stamp = newSecond;
      return true;
    }
    return false;
  }
  
  set onTimeUpdate( callback ) {
    this.stamp = Math.floor( Date.now() / this.delay );
    this.events.push( callback );
    requestAnimationFrame( this.timeCheck.bind( this ) );
  }
  
  set removeTimeUpdate( callback ) {
    let index = this.events.indexOf( callback );
    if ( index !== -1 ) this.events.splice( index, 1 );
  }
  
}

window.timeIntervals = [];

window.setTimeInterval = ( callback, delay ) => {
  const interval = new TimeInterval( delay );
  interval.onTimeUpdate = callback;
  const id = window.timeIntervals.length;
  window.timeIntervals[ id ] = interval;
  return id;
}

window.clearTimeInterval = id => {
  if ( !window.timeIntervals[ id ] ) return;
  window.timeIntervals[ id ].pause();
  window.timeIntervals[ id ] = null;
}
