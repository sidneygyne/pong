let playerY, computerY, ballX, ballY, ballSpeedX, ballSpeedY;
let paddleHeight, paddleWidth, ballSize, borderThickness;

function setup() {
    createCanvas(600, 400);
    paddleWidth = 10;
    paddleHeight = 100;
    ballSize = 15;
    borderThickness = 5;
    playerY = height / 2 - paddleHeight / 2;
    computerY = height / 2 - paddleHeight / 2;
    resetBall();
}

function draw() {
    background(0);

    // Desenhar a barra superior
    rect(0, 0, width, borderThickness);

    // Desenhar a barra inferior
    rect(0, height - borderThickness, width, borderThickness);

    // Desenhar a raquete do jogador
    rect(20, playerY, paddleWidth, paddleHeight);

    // Desenhar a raquete do computador
    rect(width - 30, computerY, paddleWidth, paddleHeight);

    // Desenhar a bola
    ellipse(ballX, ballY, ballSize);

    // Movimentar a bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Verificar colisão com as barras superior e inferior
    if (ballY - ballSize / 2 <= borderThickness || ballY + ballSize / 2 >= height - borderThickness) {
        ballSpeedY *= -1;
    }

    // Função para aumentar a velocidade da bola
    function increaseSpeed() {
        ballSpeedX *= 1.1; // Aumentar a velocidade horizontal
        ballSpeedY *= 1.1; // Aumentar a velocidade vertical
    }
    // Função para mover a raquete do computador de maneira mais inteligente
    function moveComputerPaddle() {
        let targetY = ballY - paddleHeight / 2; // O alvo é o centro da bola
        let computerSpeed = 4; // Velocidade da raquete do computador

        // Movimentar suavemente a raquete do computador em direção ao alvo (centro da bola)
        if (computerY < targetY) {
            computerY += computerSpeed; // Mover para baixo
        } else if (computerY > targetY) {
            computerY -= computerSpeed; // Mover para cima
        }

        // Impedir que a raquete do computador saia dos limites do canvas
        computerY = constrain(computerY, 0, height - paddleHeight);
    }

    // Verificar colisão com o jogador
    if (ballX - ballSize / 2 <= 30 && ballY >= playerY && ballY <= playerY + paddleHeight) {
        ballSpeedX *= -1;
        increaseSpeed(); // Chama a função para aumentar a velocidade
    }

    // Verificar colisão com o computador
    if (ballX + ballSize / 2 >= width - 30 && ballY >= computerY && ballY <= computerY + paddleHeight) {
        ballSpeedX *= -1;
        increaseSpeed(); // Chama a função para aumentar a velocidade
    }

    // Chamar a função para mover a raquete do computador
    moveComputerPaddle();

    // Verificar gol (bola fora dos limites)
    if (ballX - ballSize / 2 <= 0 || ballX + ballSize / 2 >= width) {
        resetBall();
    }

    // Controlar o jogador com o mouse
    playerY = constrain(mouseY - paddleHeight / 2, 0, height - paddleHeight);
}

function resetBall() {
    ballX = width / 2;
    ballY = height / 2;
    ballSpeedX = random([-4, 4]); // Movimento aleatório horizontal
    ballSpeedY = random([-3, 3]); // Movimento aleatório vertical
}