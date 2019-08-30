window.onload = function() {
  const score = document.querySelector('.score');
  const startScreen = document.querySelector('.startScreen');
  const gameArea = document.querySelector('.gameArea');
  const gameMessage = document.querySelector('.gameMessage');
  let leftMouseButtonOnlyDown = false;
  document.body.onmousedown = setLeftButtonState;
  document.body.onmousemove = setLeftButtonState;
  document.body.onmouseup = setLeftButtonState;
  document.body.ontouchstart= setLeftButtonState;
  

  document.addEventListener('click', start, { once: true });
  document.addEventListener('touchstart', start, { once: true});


  let keys = {};
  let player = {};


  function start() {
    player.speed = 5;
    player.score = 0;
    player.inplay = true;
    gameArea.innerHTML = '';
    gameMessage.classList.add('hide');
    startScreen.classList.add('hide');
    let bird = document.createElement('div');
    bird.setAttribute('class', 'bird');
    let wing = document.createElement('span');
    wing.setAttribute('class', 'wing');
    wing.pos = 15;
    wing.style.top = wing.pos + 'px';
    bird.appendChild(wing);
    gameArea.appendChild(bird);
    player.x = bird.offsetLeft;
    player.y = bird.offsetTop;

    player.pipe = 0;
    let spacing = 400;
    let howMany = Math.floor(gameArea.offsetWidth / spacing);
    for (let x = 0; x < howMany; x++) {
      buildPipes(player.pipe * spacing);
    }

    window.requestAnimationFrame(playGame);
  }

  function buildPipes(startPos) {
    let totalHeight = gameArea.offsetHeight;
    let totalWidth = gameArea.offsetWidth;
    player.pipe++;
    let pipecolor = getRandomColor();
    let pipe1 = document.createElement('div');
    pipe1.start = startPos + totalWidth;
    pipe1.classList.add('pipe', 'pipe1');
    pipe1.innerHTML = '<br>';
    pipe1.height = Math.floor(Math.random() * 450);
    pipe1.style.height = pipe1.height + 'px';
    pipe1.style.left = pipe1.start + 'px';
    pipe1.style.top = '0px';
    pipe1.x = pipe1.start;
    pipe1.id = player.pipe;
    pipe1.style.backgroundColor = pipecolor;
    gameArea.appendChild(pipe1);

    let pipeSpace = Math.floor(Math.random() * 250) + 220;
    let pipe2 = document.createElement('div');
    pipe2.start = pipe1.start;
    pipe2.classList.add('pipe', 'pipe2');
    pipe2.innerHTML = '<br>';
    pipe2.style.height = totalHeight - pipe1.height - pipeSpace + 'px';
    pipe2.style.left = pipe1.start + 'px';
    pipe2.style.bottom = '0px';
    pipe2.x = pipe1.start;
    pipe2.id = player.pipe;
    pipe2.style.backgroundColor = pipecolor;
    gameArea.appendChild(pipe2);
  }

  function movePipes(bird) {
    let lines = document.querySelectorAll('.pipe');
    let counter = 0;
    lines.forEach(function(item) {
      item.x -= player.speed;
      item.style.left = item.x + 'px';
      if (item.x < 0) {
        item.parentElement.removeChild(item);
        counter++;
      }
      if (isCollide(item, bird)) {
        playGameOver(bird);
      }
    });
    counter = counter / 2;
    for (let x = 0; x < counter; x++) {
      buildPipes(0);
    }
  }

  function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
      aRect.bottom < bRect.top ||
      aRect.top > bRect.bottom ||
      aRect.right < bRect.left ||
      aRect.left > bRect.right
    );
  }

  function playGame() {
    if (player.inplay) {
      let bird = document.querySelector('.bird');
      let wing = document.querySelector('.wing');
      movePipes(bird);
      if (leftMouseButtonOnlyDown || (leftMouseButtonOnlyDown && player.y > 0)) {
        player.y -= player.speed * 5;
      }

      if (leftMouseButtonOnlyDown) {
        bird.style.webkitTransform = 'rotate(-45deg)';
      } else {
        bird.style.webkitTransform = 'rotate(45deg)';
      }
      player.y += player.speed * 1.5;

      if (player.y > gameArea.offsetHeight) {
        playGameOver(bird);
      }
      bird.style.top = player.y + 'px';
      bird.style.left = player.x + 'px';
      window.requestAnimationFrame(playGame);
      player.score++;
      score.innerText = 'Score.' + player.score;
    }
  }

  function playGameOver(bird) {
    player.inplay = false;
    gameMessage.classList.remove('hide');
    bird.classList.add('slide-bottom');
    setTimeout(function() {
      bird.style.display = 'none';
      gameMessage.innerHTML =
        'Game over<br> High Score: ' + player.score + '<br><strong>Click here to try again<strong>';
      document.addEventListener('click', start, { once: true });
    }, 1000);
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function setLeftButtonState(e) {
    debounce(
      e => {
        leftMouseButtonOnlyDown = e.buttons === undefined ? e.which === 1 : e.buttons === 1;
      },
      500,
      true,
    )(e);
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
};

 // Mobile browsers do not support buzz bindOnce event
 if(isIncompatible.any())
 {
    // Show or score
    showScore();
 }
 else
 {
    // The hit sound begins and then the death sound then shows the score
    soundHit.play().bindOnce("ended", function() {
       soundDie.play().bindOnce("ended", function() {
          showScore();
       });
    });
 }

 function showScore()
 {
   player.score
 }


 // Defining browser support for the previously defined Buzz event
 var isIncompatible = {
  Android: function() {
  return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
  return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
  return navigator.userAgent.match(/Opera Mini/i);
  },
  Safari: function() {
  return (navigator.userAgent.match(/OS X.*Safari/) && ! navigator.userAgent.match(/Chrome/));
  },
  Windows: function() {
  return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
  return ( isIncompatible . Android () ||  isIncompatible . BlackBerry () ||  isIncompatible . iOS () ||  isIncompatible . Opera () ||  isIncompatible . Safari () ||  isIncompatible . Windows ());
  }
};