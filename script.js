// Enhanced JavaScript for Suzu vs The Hats
document.addEventListener('DOMContentLoaded', function() {
  // Game elements
  const gameContainer = document.getElementById('game-container');
  const introScreen = document.getElementById('intro-screen');
  const startBtn = document.getElementById('start-btn');
  const scoreboard = document.getElementById('score');
  const timerDisplay = document.getElementById('time');
  const player = document.getElementById('player');
  const hatsContainer = document.getElementById('hats-container');
  const obstaclesContainer = document.getElementById('obstacles-container');
  const winMessage = document.getElementById('win-message');
  const gameOverMessage = document.getElementById('game-over');
  const nextLevelBtn = document.getElementById('next-level-btn');
  const restartBtn = document.getElementById('restart-btn');
  
  // Audio elements
  const bgMusic = document.getElementById('bg-music');
  const collectSound = document.getElementById('collect-sound');
  const winSound = document.getElementById('win-sound');
  
  // Game variables
  let score = 0;
  let timeLeft = 60;
  let gameActive = false;
  let timerInterval;
  let playerPosition = { x: 570, y: 440 };
  const playerSpeed = 10;
  const keys = {};
  
  // Hat positions (randomized)
  const hatPositions = [
    { x: 200, y: 150 },
    { x: 800, y: 300 },
    { x: 500, y: 500 }
  ];
  
  // Obstacle positions and sizes
  const obstacles = [
    { x: 300, y: 200, width: 150, height: 30 },
    { x: 600, y: 400, width: 30, height: 150 },
    { x: 400, y: 100, width: 200, height: 30 },
    { x: 100, y: 350, width: 30, height: 200 }
  ];
  
  // Initialize game
  function initGame() {
    // Reset game state
    score = 0;
    timeLeft = 60;
    gameActive = true;
    playerPosition = { x: 570, y: 440 };
    player.style.left = playerPosition.x + 'px';
    player.style.top = playerPosition.y + 'px';
    
    // Update UI
    scoreboard.textContent = score;
    timerDisplay.textContent = timeLeft;
    
    // Clear containers
    hatsContainer.innerHTML = '';
    obstaclesContainer.innerHTML = '';
    
    // Create hats
    hatPositions.forEach((pos, index) => {
      const hat = document.createElement('div');
      hat.className = 'hat';
      hat.style.left = pos.x + 'px';
      hat.style.top = pos.y + 'px';
      hat.dataset.id = index;
      hatsContainer.appendChild(hat);
    });
    
    // Create obstacles
    obstacles.forEach(obstacle => {
      const obstacleEl = document.createElement('div');
      obstacleEl.className = 'obstacle';
      obstacleEl.style.left = obstacle.x + 'px';
      obstacleEl.style.top = obstacle.y + 'px';
      obstacleEl.style.width = obstacle.width + 'px';
      obstacleEl.style.height = obstacle.height + 'px';
      obstaclesContainer.appendChild(obstacleEl);
    });
    
    // Start game loop and timer
    startGameLoop();
    startTimer();
    
    // Play background music
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log("Audio play failed:", e));
  }
  
  // Start game loop
  function startGameLoop() {
    function gameLoop() {
      if (!gameActive) return;
      
      // Move player based on keys pressed
      if (keys['ArrowUp'] || keys['KeyW']) {
        movePlayer(0, -playerSpeed);
      }
      if (keys['ArrowDown'] || keys['KeyS']) {
        movePlayer(0, playerSpeed);
      }
      if (keys['ArrowLeft'] || keys['KeyA']) {
        movePlayer(-playerSpeed, 0);
      }
      if (keys['ArrowRight'] || keys['KeyD']) {
        movePlayer(playerSpeed, 0);
      }
      
      // Check for hat collisions
      checkHatCollisions();
      
      requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
  }
  
  // Move player with boundary checking
  function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    
    // Boundary checking
    if (newX >= 0 && newX <= gameContainer.offsetWidth - player.offsetWidth) {
      playerPosition.x = newX;
    }
    if (newY >= 0 && newY <= gameContainer.offsetHeight - player.offsetHeight) {
      playerPosition.y = newY;
    }
    
    // Update player position
    player.style.left = playerPosition.x + 'px';
    player.style.top = playerPosition.y + 'px';
    
    // Add moving animation
    player.classList.add('moving');
    clearTimeout(player.moveTimeout);
    player.moveTimeout = setTimeout(() => {
      player.classList.remove('moving');
    }, 100);
  }
  
  // Check for collisions with hats
  function checkHatCollisions() {
    const hats = document.querySelectorAll('.hat');
    const playerRect = player.getBoundingClientRect();
    
    hats.forEach(hat => {
      const hatRect = hat.getBoundingClientRect();
      
      // Simple collision detection
      if (
        playerRect.left < hatRect.right &&
        playerRect.right > hatRect.left &&
        playerRect.top < hatRect.bottom &&
        playerRect.bottom > hatRect.top
      ) {
        collectHat(hat);
      }
    });
  }
  
  // Collect a hat
  function collectHat(hat) {
    if (hat.classList.contains('collected')) return;
    
    hat.classList.add('collected');
    score++;
    scoreboard.textContent = score;
    
    // Play collection sound
    collectSound.currentTime = 0;
    collectSound.play().catch(e => console.log("Audio play failed:", e));
    
    // Check for win condition
    if (score >= 3) {
      winGame();
    }
    
    // Remove hat after animation
    setTimeout(() => {
      hat.remove();
    }, 500);
  }
  
  // Start the timer
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }
  
  // Win the game
  function winGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    // Play win sound
    winSound.play().catch(e => console.log("Audio play failed:", e));
    
    // Show win message
    setTimeout(() => {
      winMessage.style.display = 'block';
    }, 1000);
  }
  
  // End the game (time out)
  function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    // Show game over message
    setTimeout(() => {
      gameOverMessage.style.display = 'block';
    }, 500);
  }
  
  // Event listeners
  startBtn.addEventListener('click', function() {
    introScreen.style.display = 'none';
    initGame();
  });
  
  nextLevelBtn.addEventListener('click', function() {
    // This will be implemented when we have more levels
        window.location.href = 'level2.html';

    winMessage.style.display = 'none';
    introScreen.style.display = 'flex';
  });
  
  restartBtn.addEventListener('click', function() {
    gameOverMessage.style.display = 'none';
    initGame();
  });
  
  // Keyboard controls
  document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    keys[e.code] = true;
  });
  
  document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
    keys[e.code] = false;
  });
  
  // Prevent arrow key scrolling
  window.addEventListener('keydown', function(e) {
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  }, false);
});