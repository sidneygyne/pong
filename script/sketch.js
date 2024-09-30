let playerY, computerY, ballX, ballY, ballSpeedX, ballSpeedY;
let paddleHeight, paddleWidth, ballSize, borderThickness;
let backgroundImage; // Imagem de fundo
let playerPaddleImage, computerPaddleImage; // Imagem raquetes
let ballImage; // // Imagem da bola
let ballScale = 1; // Escala da bola
let squashDuration = 10; // Duração da animação
let squashTimer = 0; // Temporizador para controlar a animação
let ballAngle = 0; // Ângulo inicial da bola
let bounceSound; // Som bola raquete
let goalSound; // Som de Goll
let playerScore = 0;
let computerScore = 0;
let goalScored = false; // Flag para garantir que o placar seja atualizado uma vez por gol
const maxBallSpeed = 15; // Limite de aumento da velocidade em 15 vezes
const winningScore = 5; // Definir o número de pontos necessários para vencer
let selectedOption = 0; // Variável para rastrear a seleção atual (índice)
let gameStarted = false;
let difficulty = 'easy';
const difficultyOptions = ["Fácil", "Médio", "Difícil"];

let initialScreen = true; // Variável para controlar se a tela inicial está sendo exibida
let startButtonX, startButtonY, startButtonWidth, startButtonHeight;

//Desenha os botoes de dificuldade
let buttonX, buttonY = [], buttonWidth, buttonHeight;

function setup() {
    createCanvas(600, 400);

    // Inicializar a tela inicial
    startButtonWidth = 200;
    startButtonHeight = 50;
    startButtonX = width / 2 - startButtonWidth / 2;
    startButtonY = height / 2 + 50;

        // Carregar a imagem de fundo da tela inicial
       // backgroundImage = loadImage('sprites/fundo_inicio.jfif');

    buttonWidth = 200;
    buttonHeight = 50;
    buttonX = width / 2 - buttonWidth / 2;
    let initialY = height / 2 - 75;
    buttonY = [height / 2 - 60, height / 2, height / 2 + 60]; // Posição dos botões
    paddleWidth = 10;
    paddleHeight = 100;
    ballSize = 15;
    borderThickness = 5;
    playerY = height / 2 - paddleHeight / 2;
    computerY = height / 2 - paddleHeight / 2;

    // Carrega sons e imagens
    backgroundImage = loadImage('sprites/fundo2.png');
    playerPaddleImage = loadImage('sprites/barra01.png');
    computerPaddleImage = loadImage('sprites/barra02.png');
    ballImage = loadImage('sprites/bola.png');
    bounceSound = loadSound('sounds/bounce.wav');
    goalSound = loadSound('sounds/goal.wav');
    resetBall();

    // Inicializar a posição dos botões
    for (let i = 0; i < difficultyOptions.length; i++) {
        buttonY[i] = initialY + i * 60;
    }
}

function draw() {


    if (initialScreen) {
        drawInitialScreen(); // Mostrar a tela inicial
        return;
    }

    if (!gameStarted) {
        drawDifficultySelectionScreen(); // Mostrar a tela de seleção
        return; // Não prosseguir para o jogo enquanto a dificuldade não for selecionada
    }

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

    // Funções para mover a raquete do computador: Dificil, médio e fácil
    function moveComputerPaddleHard() {
        let targetY = ballY - paddleHeight / 2;
        let computerSpeed = 6; // Velocidade alta para o nível difícil
        let errorMargin = 10; // Menor margem de erro para movimentos mais precisos

        if (abs(computerY - targetY) > errorMargin) {
            if (computerY < targetY) {
                computerY += computerSpeed;
            } else if (computerY > targetY) {
                computerY -= computerSpeed;
            }
        }

        computerY = constrain(computerY, borderThickness, height - paddleHeight - borderThickness);
    }
    function moveComputerPaddleMedium() {
        let targetY = ballY - paddleHeight / 2;
        let computerSpeed = 4; // Velocidade média
        let errorMargin = 20; // Margem de erro média

        if (abs(computerY - targetY) > errorMargin) {
            if (computerY < targetY) {
                computerY += computerSpeed;
            } else if (computerY > targetY) {
                computerY -= computerSpeed;
            }
        }

        computerY = constrain(computerY, borderThickness, height - paddleHeight - borderThickness);
    }
    function moveComputerPaddleEasy() {
        let targetY = ballY - paddleHeight / 2;
        let computerSpeed = 2; // Velocidade baixa para o nível fácil
        let errorMargin = 40; // Margem de erro maior

        if (abs(computerY - targetY) > errorMargin) {
            if (computerY < targetY) {
                computerY += computerSpeed;
            } else if (computerY > targetY) {
                computerY -= computerSpeed;
            }
        }

        computerY = constrain(computerY, borderThickness, height - paddleHeight - borderThickness);
    }


    // Chamar a função para mover a raquete do computador conforme nivel de fificuldade escolhido
    if (difficulty === 'easy') {
        moveComputerPaddleEasy();
    } else if (difficulty === 'medium') {
        moveComputerPaddleMedium();
    } else if (difficulty === 'hard') {
        moveComputerPaddleHard();
    }


    // Direção da bola com base no toque das raquetes
    function handlePaddleCollision(paddleY, isComputer = false) {
        ballSpeedX *= -1;

        // Definir escala para o "esmagamento"
        ballScale = 0.6; // Achata a bola
        squashTimer = squashDuration; // Reiniciar o temporizador da animação

        // Tocar o som de colisão
        bounceSound.play(); // Toca o som de colisão com a raquete

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
    } else if (ballX - ballSize / 2 <= 30 && ballX + ballSpeedX - ballSize / 2 > 30) {
        handlePaddleCollision(playerY);
    }

    // Verificar colisão com o computador
    if (ballX + ballSize / 2 >= width - 30 && ballY >= computerY && ballY <= computerY + paddleHeight) {
        handlePaddleCollision(computerY, true);
    } else if (ballX + ballSize / 2 >= width - 30 && ballX + ballSpeedX + ballSize / 2 < width - 30) {
        handlePaddleCollision(computerY, true);
    }




    // Verificar gol (bola fora dos limites)
    if (!goalScored && ballX - ballSize / 2 <= 0) {
        computerScore++; // Computador marca um ponto
        goalSound.play(); // Tocar o som de gol
        goalScored = true; // Marcar que o gol foi detectado
        setTimeout(resetBallAfterGoal, 1000); // Reiniciar a bola após 1 segundo
    } else if (!goalScored && ballX + ballSize / 2 >= width) {
        playerScore++; // Jogador marca um ponto
        goalSound.play(); // Tocar o som de gol
        goalScored = true; // Marcar que o gol foi detectado
        setTimeout(resetBallAfterGoal, 1000); // Reiniciar a bola após 1 segundo
    }

    // Controlar o jogador com o mouse
    playerY = constrain(mouseY - paddleHeight / 2, 0, height - paddleHeight);

    // Lógica para restaurar a escala da bola
    if (squashTimer > 0) {
        squashTimer--;
    } else {
        ballScale = lerp(ballScale, 1, 0.1); // Gradualmente volta à escala normal (1x)
    }

    // Exibir o placar
    textAlign(CENTER);
    textSize(32);
    fill(255); // Cor do texto (branco)
    text(playerScore, width / 4, 50); // Placar do jogador
    text(computerScore, 3 * width / 4, 50); // Placar do computador

    function resetBallAfterGoal() {
        resetBall();
        goalScored = false; // Reiniciar a flag para permitir a contagem de gols novamente
    }

    // Verificar se alguém ganhou
    if (playerScore >= winningScore || computerScore >= winningScore) {
        textSize(64);
        text(playerScore >= winningScore ? "Player Wins!" : "Computer Wins!", width / 2, height / 2);
        noLoop(); // Parar o jogo
        return;
    }
}

// Reseta posição da bola
function resetBall() {
    ballX = width / 2;
    ballY = random(height / 4, 3 * height / 4); // Posição aleatória próxima do centro verticalmente
    ballSpeedX = random([-4, 4]); // Movimento aleatório horizontal
    ballSpeedY = random([-3, 3]); // Movimento aleatório vertical
}

// Função para desenhar a tela inicial
function drawInitialScreen() {
    background(0);

    // Desenhar a imagem de fundo da tela inicial
    image(backgroundImage, 0, 0, width, height);

    // Definir o estilo do texto
    textAlign(CENTER);
    textSize(64);
    fill(255);

    // Mostrar o texto do título
    text("Pong Game", width / 2, height / 2 - 100);

    // Verificar se o mouse está sobre o botão de start
    if (mouseX >= startButtonX && mouseX <= startButtonX + startButtonWidth &&
        mouseY >= startButtonY && mouseY <= startButtonY + startButtonHeight) {
        fill("#FFD700"); // Mudar a cor quando o mouse está sobre o botão
    } else {
        fill(255); // Cor normal do botão
    }

  // Verifica se o botão está selecionado (com teclado ou mouse)
    if (selectedOption === 0) {
        fill("#FFD700");  // Cor de destaque
    } else {
        fill(255);  // Cor normal
    }

    // Desenhar o botão de start
    rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight, 30);
    fill(0);
    textSize(32);
    text("Iniciar", width / 2, startButtonY + startButtonHeight / 1.4);

     // Desenha instruções
     fill(255);
     textSize(20);
     text("Precione ENTER ou CLICK para iniciar", width / 2, height - 50);  // Exibe uma dica de controle na tela
 
}

function drawDifficultySelectionScreen() {
    background(0);

    // Desenhar a imagem de fundo da tela inicial
    image(backgroundImage, 0, 0, width, height);
    
    textAlign(CENTER);
    textSize(32);
    fill(255);

    let mouseOverOption = -1; // Variável para rastrear se o mouse está sobre algum botão

    for (let i = 0; i < difficultyOptions.length; i++) {
        // Verifica se o mouse está sobre o botão
        if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
            mouseY >= buttonY[i] && mouseY <= buttonY[i] + buttonHeight) {
            mouseOverOption = i; // Atualiza para o índice do botão onde o mouse está
            selectedOption = i;  // Atualiza também a seleção do teclado com o índice do mouse
            fill("#FFD700"); // Cor do botão destacado pelo mouse
        } else if (i === selectedOption && mouseOverOption === -1) {
            // Se o mouse não estiver sobre nenhum botão, use a seleção do teclado
            fill("#FFD700"); // Cor do botão destacado pelo teclado
        } else {
            fill(255); // Cor padrão do botão
        }

        // Desenhar o botão
        rect(buttonX, buttonY[i], buttonWidth, buttonHeight, 30);

        // Desenhar o texto do botão
        fill(0);
        text(difficultyOptions[i], width / 2, buttonY[i] + buttonHeight / 1.4);
    }
}

function applyDifficultySelection() {
    switch (selectedOption) {
        case 0:
            difficulty = 'easy';
            break;
        case 1:
            difficulty = 'medium';
            break;
        case 2:
            difficulty = 'hard';
            break;
    }
    // Iniciar o jogo com a dificuldade selecionada
    //console.log("Dificuldade selecionada:", difficulty);
}

// Função para verificar clique na tela inicial
function mousePressed() {
    if (initialScreen) {
        // Verifica se o botão "Start" foi clicado
        if (mouseX >= startButtonX && mouseX <= startButtonX + startButtonWidth &&
            mouseY >= startButtonY && mouseY <= startButtonY + startButtonHeight) {
            initialScreen = false; // Sair da tela inicial
        }
    } else if (!gameStarted) {
        for (let i = 0; i < difficultyOptions.length; i++) {
            if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
                mouseY >= buttonY[i] && mouseY <= buttonY[i] + buttonHeight) {
                selectedOption = i;
                applyDifficultySelection();

                gameStarted = true; // Iniciar o jogo
            }
        }
    }
}

function keyPressed() {
    // Verifica se estamos na tela inicial
    if (initialScreen) {
        if (keyCode === ENTER) {
            // Quando a tecla Enter for pressionada, inicie a seleção de dificuldade
            initialScreen = false;
        }
    } 
    // Verifica se estamos na tela de seleção de dificuldade
    else if (!gameStarted) {
        if (keyCode === UP_ARROW) {
            selectedOption = (selectedOption - 1 + difficultyOptions.length) % difficultyOptions.length;
        } else if (keyCode === DOWN_ARROW) {
            selectedOption = (selectedOption + 1) % difficultyOptions.length;
        } else if (keyCode === ENTER) {
            applyDifficultySelection();
            gameStarted = true;  // Começa o jogo com a dificuldade selecionada
        }
    }
}


