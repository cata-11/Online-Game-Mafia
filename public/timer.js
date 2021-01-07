(function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;

        let five_min = minute*5;

        let endTime = new Date().getTime()+five_min,

        x = setInterval(function() {    
  
          let now = new Date().getTime(),
              remaining = endTime - now;
  
            document.getElementById("minutes").innerText = Math.floor((remaining % (hour)) / (minute)),
            document.getElementById("seconds").innerText = Math.floor((remaining % (minute)) / second);
  
          if (remaining < 0) {
            clearInterval(x);
          }
        }, 0)
        //console.log(new Date(endTime));
    }());