let lastInterval;

function setCountDownTimer (seconds)
{
  if (typeof lastInterval !== 'undefined') 
  {
    clearInterval(lastInterval);
  }

  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  let sec = second*seconds;

  let endTime = new Date().getTime() + sec;

  lastInterval = setInterval(function() {    

    let now = new Date().getTime(),
        remaining = endTime - now;

      document.getElementById("minutes").innerText = Math.floor((remaining % (hour)) / (minute)),
      document.getElementById("seconds").innerText = Math.floor((remaining % (minute)) / second);

    if (remaining < 0) {
      clearInterval(lastInterval);
    }
  }, 0)

}

function setCountDownTime (seconds)
{

  const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  let sec = second*seconds;

  let endTime = new Date().getTime() + sec;
  
  let now = new Date().getTime(),
      remaining = endTime - now;

  document.getElementById("minutes").innerText = Math.floor((remaining % (hour)) / (minute)),
  document.getElementById("seconds").innerText = Math.floor((remaining % (minute)) / second);

}