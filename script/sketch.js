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

    // Remover as bordas de qualquer forma desenhada
    noStroke();

    // Definir a cor das barras superior e inferior
    fill(255, 0, 0); // Cor vermelha para as barras

    // Desenhar a barra superior
    rect(0, 0, width, borderThickness);

    // Desenhar a barra inferior
    rect(0, height - borderThickness, width, borderThickness);

    // Definir a cor das raquetes e da bola (opcional, se quiser diferenciar)
    fill(255); // Cor branca para raquetes e bola

    // Restringir a raquete do jogador dentro dos limites das barras
    playerY = constrain(mouseY - paddleHeight / 2, borderThickness, height - paddleHeight - borderThickness);

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
        let computerSpeed = 3; // Velocidade da raquete do computador
        let errorMargin = 30; // Margem de erro para tornar o movimento mais natural

        // Se o computador estiver fora da margem de erro, ele se move em direção à bola
    if (abs(computerY - targetY) > errorMargin) {
        if (computerY < targetY) {
            computerY += computerSpeed; // Mover para baixo
        } else if (computerY > targetY) {
            computerY -= computerSpeed; // Mover para cima
        }
    }


        // Restringir a raquete do computador dentro dos limites das barras
        computerY = constrain(computerY, borderThickness, height - paddleHeight - borderThickness);
    }

    // Direção da bola com base no toque das raquetes
    function handlePaddleCollision(paddleY, isComputer = false) {
        ballSpeedX *= -1;
    
        // Se a colisão for com o computador, aplicar um deslocamento aleatório na posição de impacto
        let impactPoint;
        if (isComputer) {
            // Aplica um deslocamento pequeno para simular colisão em diferentes pontos da raquete
            let offset = random(-paddleHeight / 4, paddleHeight / 4); // Desloca até 1/4 da altura da raquete
            impactPoint = (ballY + offset - paddleY) - paddleHeight / 2;
        } else {
            impactPoint = (ballY - paddleY) - paddleHeight / 2;
        }
    
        let normalizedImpact = impactPoint / (paddleHeight / 2); // Valor entre -1 e 1
        ballSpeedY = normalizedImpact * 3; // Ajustar o ângulo de acordo com o ponto de impacto
    
        increaseSpeed(); // Aumenta a velocidade da bola
    }
    
    // Verificar colisão com o jogador
    if (ballX - ballSize / 2 <= 30 && ballY >= playerY && ballY <= playerY + paddleHeight) {
        handlePaddleCollision(playerY);
    }

    // Verificar colisão com o computador
    if (ballX + ballSize / 2 >= width - 30 && ballY >= computerY && ballY <= computerY + paddleHeight) {
        handlePaddleCollision(computerY, true); // Passa "true" para indicar que é a colisão com o computador
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

// Reseta posição da bola
function resetBall() {
    ballX = width / 2;
    ballY = random(height / 4, 3 * height / 4); // Posição aleatória próxima do centro verticalmente
    ballSpeedX = random([-4, 4]); // Movimento aleatório horizontal
    ballSpeedY = random([-3, 3]); // Movimento aleatório vertical
}

