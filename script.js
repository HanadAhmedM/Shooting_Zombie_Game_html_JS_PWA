const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
const gravity = 4.5;
let animationId;
let gameOver = false;
// Platform class (same as before)
class Platform {
    constructor({ imageSrc, x, y }) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.imageLoaded = false;

        this.image.onload = () => {
            this.imageLoaded = true;
        };

        this.position = { x: x || 0, y: y || 0}; // Set x and y positions
        this.width = canvas.width; // Each platform can span the full width of the canvas
        this.height = canvas.height; // Set a fixed height for platforms
    }

    draw() {
        if (this.imageLoaded) {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    updateImage(imageSrc) {
        this.image.src = imageSrc;
    }
}

// Player class
class Player {
    constructor() {
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 0, y: 0 };
        this.width = 200;
        this.height = 400;
        this.image = new Image();
        this.image.src = './Image/player.png';
        this.imageLoaded = false;
        this.isFlipped = false;
        this.bulletAngle = 0; // Angle in radians
        this.isAlive = true; // Add a flag to track if the player is alive
 
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }
    handleDeath() {
        this.isAlive = false; // Set the player state to dead
        console.log("Player has been killed by a zombie!");
        
        gameOver = true; // Set the gameOver flag
        cancelAnimationFrame(animationId); // Stop the game loop
        displayGameOverMessage();
    }
    draw() {
        if (this.imageLoaded) {
            c.save();
            if (this.isFlipped) {
                c.translate(this.position.x + this.width, this.position.y);
                c.scale(-1, 1);
                c.drawImage(this.image, 0, 0, this.width, this.height);
            } else {
                c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
            }
            c.restore();
        }

        // Draw the bullet direction indicator
        this.drawBulletDirection();
    }

    drawBulletDirection() {
        // Calculate the gun position relative to the player’s position
        const gunX = this.isFlipped ? this.position.x +50 : this.position.x + this.width -50;
        const gunY = (this.position.y + this.height / 2 ) +7;
    
        c.beginPath();
        c.moveTo(gunX, gunY);
        
        // Calculate the end point of the line based on the angle and direction
        const lineLength = 50; // Length of the indicator line
        const lineEndX = gunX + lineLength * Math.cos(this.bulletAngle) * (this.isFlipped ? -1 : 1);
        const lineEndY = gunY + lineLength * Math.sin(this.bulletAngle);
        
        c.lineTo(lineEndX, lineEndY);
        c.strokeStyle = 'yellow';
        c.lineWidth = 3;
        c.stroke();
        c.closePath();
    }

    update() {
        if (!this.isAlive) return;
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
    }
}

// Bullet class
class Bullet {
    constructor({ x, y, angle, direction }) {
        this.position = { x: x, y: y };
        this.velocity = {
            x: Math.cos(angle) * 10 * direction,
            y: Math.sin(angle) * 10
        };
        this.radius = 5;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'red';
        c.fill();
        c.closePath();
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
    }
}
// Zombie class
class Zombie {
    constructor({ x, y }) {
        this.position = { x: x, y: y };
        this.velocity = { x: 0, y: 0 };
        this.width = 220; // Adjusted zombie width for better gameplay balance
        this.height = 220; // Adjusted zombie height for better gameplay balance
        this.alive = true;
        this.image = new Image();
        this.image.src = './Image/zombi.gif'; // Using a sprite sheet as an example
        this.imageLoaded = false;
        this.frameCount = 2; // Example frame count for sprite sheet
        this.currentFrame = 0;
        this.frameWidth = 0;
        this.frameInterval = 10; // Adjust to control animation speed
        this.frameTick = 0;

        this.image.onload = () => {
            this.imageLoaded = true;
            this.frameWidth = this.image.width / this.frameCount;
        };
    }

    draw() {
        if (this.imageLoaded && this.alive) {
            c.drawImage(
                this.image,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.image.height,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            );
        }
    }

    update(player) {
        if (gameOver) return; // Stop updating if the game is over
        if (this.alive) {
            const directionX = player.position.x - this.position.x;
            const directionY = player.position.y - this.position.y;
            const distance = Math.sqrt(directionX ** 2 + directionY ** 2);
    
            this.velocity.x = (directionX / distance) * 2;
            this.velocity.y = (directionY / distance) * 2;
    
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
    
            this.animate();
            this.draw();
    
            if (this.checkCollisionWithPlayer(player)) {
                player.handleDeath(); // Call the method within the Player class
            }
        }
    }

    animate() {
        this.frameTick++;
        if (this.frameTick >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.frameTick = 0;
        }
    }

    checkCollisionWithPlayer(player) {
        return (
            this.position.x < player.position.x + player.width &&
            this.position.x + this.width > player.position.x &&
            this.position.y < player.position.y + player.height &&
            this.position.y + this.height > player.position.y
        );
    }
}

// Array to hold bullets
const bullets = [];
const Zombies = [];

// Array to hold platforms
const platforms = [];
const platformImages = [
    './Image/Platform1.png',
    './Image/Platform2.png',
    './Image/Platform3.png'
];

// Create multiple platforms covering the canvas width
platformImages.forEach((imageSrc, index) => {
    platforms.push(new Platform({
        imageSrc: imageSrc,
        x: imageSrc.width, // Spread platforms across the width
        y: 0 // Set y position to 0 to cover the top
    }));
});



const player = new Player();

const keys = {
    right: { pressed: false },
    left: { pressed: false },
    up: { pressed: false },
    down: { pressed: false }
};

function spawnZombies   () {
    setInterval(() => {
        const y = Math.random() * (canvas.height - 100); // Random height within the canvas
        Zombies.push(new Zombie({ x: canvas.width, y: y, spriteSheet: './Image/zombi.gif', frameCount: 0 }));
    }, 2000); // Spawn a new zombie every 2 seconds
}

function checkBulletZombieCollision(bullet, zombie) {
    return (
        bullet.position.x < zombie.position.x + zombie.width &&
        bullet.position.x + bullet.radius > zombie.position.x &&
        bullet.position.y < zombie.position.y + zombie.height &&
        bullet.position.y + bullet.radius > zombie.position.y
    ); // Check collision between bullet and zombie
}
function animate() {
    if (gameOver) {
        displayGameOverMessage(); // Display game over message when game is over
        return;
    }

    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
   
    // Draw all platforms
    platforms.forEach(platform => platform.draw());
   
   // Update and draw the player
   player.update();
    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.update();
        if (bullet.position.x < 0 || bullet.position.x > canvas.width || bullet.position.y < 0 || bullet.position.y > canvas.height) {
            bullets.splice(index, 1);
        }
    });
      
    // Update and draw zombies
    Zombies.forEach((zombie, index) => {
        zombie.update(player);
        bullets.forEach((bullet, bulletIndex) => {
            if (checkBulletZombieCollision(bullet, zombie)) {
                // Remove zombie and bullet on collision
                Zombies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });



    // Handle player movement
    if (keys.right.pressed) {
        player.velocity.x = 5;
        player.isFlipped = false;
    } else if (keys.left.pressed) {
        player.velocity.x = -5;
        player.isFlipped = true;
    } else {
        player.velocity.x = 0;
    }

    // Adjust bullet angle
    if (keys.up.pressed) {
        player.bulletAngle -= 0.05; // Rotate up
    }
    if (keys.down.pressed) {
        player.bulletAngle += 0.05; // Rotate down
    }
}
function displayGameOverMessage() {
    c.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black background
    c.fillRect(0, 0, canvas.width, canvas.height); // Cover the whole canvas

    c.font = 'bold 80px Arial';
    c.fillStyle = 'red';
    c.textAlign = 'center';
    c.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    c.font = 'bold 40px Arial';
    c.fillStyle = 'white';
    c.fillText('Press Enter to Restart', canvas.width / 2, canvas.height / 2 + 100);
}

function restartGame() {
    // Reset game state variables
    gameOver = false;
    player.isAlive = true;
    player.position = { x: 100, y: 100 }; // Reset player position
    player.velocity = { x: 0, y: 0 };
    player.bulletAngle = 0; // Reset bullet angle
    player.isFlipped = false;

    // Clear zombies and bullets
    Zombies.length = 0;
    bullets.length = 0;

    // Reset platform index
    currentPlatformIndex = 0;
    platforms.forEach(platform => platform.draw());

    // Restart the animation loop
    animate();
}
function handlePlayerDeath() {
    console.log("Player has been killed by a zombie!");
    // You can display a game over screen or restart the game
    // Stop the animation loop or disable player controls
    cancelAnimationFrame(animationId); // Stops the game loop
    alert('Game Over! You were killed by a zombie.');
}
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65: // 'A' key
            keys.left.pressed = true;
            break;
        case 68: // 'D' key
            keys.right.pressed = true;
            break;
        case 87: // 'W' key
            player.velocity.y = -20;
            break;
        case 32: // Space key
            const direction = player.isFlipped ? -1 : 1;
            const bulletX = player.isFlipped ? player.position.x  : player.position.x + player.width;
            const bulletY = (player.position.y + player.height / 2) +7;
            bullets.push(new Bullet({ x: bulletX, y: bulletY, angle: player.bulletAngle, direction: direction }));
            break;
        case 38: // Up arrow
            keys.up.pressed = true;
            break;
        case 40: // Down arrow
            keys.down.pressed = true;
            break;
        case 13: // Enter key
            if (gameOver) {
                restartGame(); // Restart the game if Enter is pressed after game over
            }
            break;
    }
});

addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: // 'A' key
            keys.left.pressed = false;
           
            break;
        case 68: // 'D' key
            keys.right.pressed = false;
          
            break;
        case 38: // Up arrow
            keys.up.pressed = false;
            break;
        case 40: // Down arrow
            keys.down.pressed = false;
            break;
    }
});

function init() {
    animate();
    spawnZombies();
}

// Start the game
init();