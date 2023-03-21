class entryTimer {
  seconds;
  minutes;
  hours;
  start;
  time;
  elapsed;
  target;
  timeout;

  constructor(elem) {
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.time = 0;
    this.target = elem;
  }

  get seconds() {
    return this.seconds;
  }
  get minutes() {
    return this.minutes;
  }
  get hours() {
    return this.hours;
  }

  progressTimer = () => {
    this.time += 100;
    this.elapsed = Math.floor(this.time / 100) / 10;
    if (Math.round(this.elapsed) == this.elapsed) {
      this.elapsed += ".0";
    }
    this.seconds = Math.floor(this.elapsed) % 60;
    this.minutes = Math.floor(Math.floor(this.elapsed) / 60) % 60;
    this.hours = Math.floor(Math.floor(this.elapsed) / 3600);

    this.updateDisplay();

    //adjust for delay while setting next timeout
    let diff = new Date().getTime() - this.start - this.time;
    this.timeout = setTimeout(this.progressTimer, 100 - diff);
  };

  updateDisplay = () => {
    let d_hours = this.hours > 9 ? `${this.hours}` : `0${this.hours}`;
    let d_minutes = this.minutes > 9 ? `${this.minutes}` : `0${this.minutes}`;
    let d_seconds = this.seconds > 9 ? `${this.seconds}` : `0${this.seconds}`;

    this.target.innerHTML = `${d_hours}:${d_minutes}:${d_seconds}`;
  };

  startTimer = () => {
    this.start = new Date();
    this.target.value = this.start;
    this.start = this.start.getTime();
    this.progressTimer();
  };

  stopTimer = () => {
    clearTimeout(this.timeout);
  };
}