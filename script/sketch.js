let playerY, computerY, ballX, ballY, ballSpeedX, ballSpeedY;
let paddleHeight, paddleWidth, ballSize, borderThickness;
let backgroundImage; // Imagem de fundo
let playerPaddleImage, computerPaddleImage; // Imagem raquetes
let ballImage; // // Imagem da bola
let ballScale = 1; // Escala da bola
let squashDuration = 10; // Duração da animação
let squashTimer = 0; // Temporizador para controlar a animação
let ballAngle = 0; // Ângulo inicial da bola
const maxBallSpeed = 15; // Limite de aumento da velocidade em 15 vezes



function setup() {
    createCanvas(600, 400);
    paddleWidth = 10;
    paddleHeight = 100;
    ballSize = 15;
    borderThickness = 5;
    playerY = height / 2 - paddleHeight / 2;
    computerY = height / 2 - paddleHeight / 2;
    backgroundImage = loadImage('sprites/fundo2.png');
    playerPaddleImage = loadImage('sprites/barra01.png');
    computerPaddleImage = loadImage('sprites/barra02.png');
    ballImage = loadImage('sprites/bola.png');
    resetBall();
}

function draw() {
     // Desenhar a imagem de fundo
    image(backgroundImage, 0, 0, width, height);

    // Remover as bordas de qualquer forma desenhada
    noStroke();

    // Definir a cor das barras superior e inferior
    fill(color("#318cd5")); // Cor vermelha para as barras

    // Desenhar a barra superior
    rect(0, 0, width, borderThickness);

    // Desenhar a barra inferior
    rect(0, height - borderThickness, width, borderThickness);

    // Definir a cor das raquetes e da bola (opcional, se quiser diferenciar)
    fill(255); // Cor branca para raquetes e bola

    // Restringir a raquete do jogador dentro dos limites das barras
    playerY = constrain(mouseY - paddleHeight / 2, borderThickness, height - paddleHeight - borderThickness);

    // Desenhar a raquete do jogador
    image(playerPaddleImage, 20, playerY, paddleWidth, paddleHeight);

    // Desenhar a raquete do computador
    image(computerPaddleImage, width - 30, computerY, paddleWidth, paddleHeight);

    // Calcular a velocidade total da bola (usando a magnitude da velocidade)
    let ballSpeed = sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
    
    // Atualizar o ângulo da bola com base na velocidade
    ballAngle += ballSpeed * 0.05; // Ajustar o fator de rotação conforme necessário

// Desenhar a bola com rotação
    push(); // Salvar o estado atual de transformação
    translate(ballX, ballY); // Mover o ponto de origem para a posição da bola
    rotate(ballAngle); // Aplicar a rotação
    scale(ballScale); // Aplicar a escala na bola
    image(ballImage, -ballSize / 2, -ballSize / 2, ballSize, ballSize); // Desenhar a imagem da bola
    pop(); // Restaurar o estado de transformação

    // Movimentar a bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Verificar colisão com as barras superior e inferior
    if (ballY - ballSize / 2 <= borderThickness || ballY + ballSize / 2 >= height - borderThickness) {
        ballSpeedY *= -1;

        // Evitar que a bola fique em linha reta vertical
        if (abs(ballSpeedY) < 15) { // Se a velocidade vertical for muito baixa
            ballSpeedY = random(2, 4, 6) * (ballSpeedY < 0 ? -1 : 1); // Força uma mudança de direção
        }
    }

    // Função para aumentar a velocidade da bola
    function increaseSpeed() {
        // Aumenta a velocidade horizontal e vertical, mas com um limite
        if (abs(ballSpeedX) < maxBallSpeed) {
            ballSpeedX *= 1.1; // Aumenta a velocidade horizontal, limitado pelo valor máximo
        }
        
        if (abs(ballSpeedY) < maxBallSpeed) {
            ballSpeedY *= 1.1; // Aumenta a velocidade vertical, limitado pelo valor máximo
        }
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

        // Definir escala para o "esmagamento"
        ballScale = 0.6; // Achata a bola
        squashTimer = squashDuration; // Reiniciar o temporizador da animação

        // Resto do código de colisão...
        let impactPoint;
        if (isComputer) {
            let offset = random(-paddleHeight / 4, paddleHeight / 4);
            impactPoint = (ballY + offset - paddleY) - paddleHeight / 2;
        } else {
            impactPoint = (ballY - paddleY) - paddleHeight / 2;
        }

        let normalizedImpact = impactPoint / (paddleHeight / 2);
        ballSpeedY = normalizedImpact * 3;

        // Evitar movimento horizontal em linha reta (quase zero)
        if (abs(ballSpeedY) < 1) {
            ballSpeedY = random(1, 3) * (ballSpeedY < 0 ? -1 : 1); // Força um ângulo se for muito reto
        }

        increaseSpeed(); // Aumentar a velocidade da bola
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

    // Lógica para restaurar a escala da bola
    if (squashTimer > 0) {
        squashTimer--;
    } else {
        ballScale = lerp(ballScale, 1, 0.1); // Gradualmente volta à escala normal (1x)
    }
}

// Reseta posição da bola
function resetBall() {
    ballX = width / 2;
    ballY = random(height / 4, 3 * height / 4); // Posição aleatória próxima do centro verticalmente
    ballSpeedX = random([-4, 4]); // Movimento aleatório horizontal
    ballSpeedY = random([-3, 3]); // Movimento aleatório vertical
}

