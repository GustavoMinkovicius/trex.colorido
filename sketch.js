var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var trex, trex_correndo, trex_colidiu;
var solo, soloInvisivel, imagemDoSolo;

var grupodenuvens, imagemDaNuvem;
var grupodeobstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4;
var imagemDeFundo
var pontuacao=0;
var somDePulo, somDeColisao;

var fimDeJogo, reiniciar;


function preload(){
  somDePulo = loadSound("assets/sounds/jump.wav")
  somDeColisao = loadSound("assets/sounds/collided.wav")
  
  imagemDeFundo = loadImage("assets/backgroundImg.png")
  animacaoDeSol = loadImage("assets/sun.png");
  
  trex_correndo = loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  trex_colidiu = loadAnimation("assets/trex_collided.png");
  
  imagemDoSolo = loadImage("assets/ground.png");
  
  imagemDaNuvem = loadImage("assets/cloud.png");
  
  obstaculo1 = loadImage("assets/obstacle1.png");
  obstaculo2 = loadImage("assets/obstacle2.png");
  obstaculo3 = loadImage("assets/obstacle3.png");
  obstaculo4 = loadImage("assets/obstacle4.png");
  
  imgFimDeJogo = loadImage("assets/gameOver.png");
  imgReiniciar = loadImage("assets/restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sol = createSprite(width-50,100,10,10);
  sol.addAnimation("sun", animacaoDeSol);
  sol.scale = 0.1
  
  trex = createSprite(50,height-70,20,50);
  
  
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided", trex_colidiu);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  // trex.debug=true
  
  soloInvisivel = createSprite(width/2,height-10,width,125);  
  soloInvisivel.shapeColor = "#f4cbaa";
  
  solo = createSprite(width/2,height,width,2);
  solo.addImage("ground",imagemDoSolo);
  solo.x = width/2
  solo.velocityX = -(6 + 3*pontuacao/100);
  
  fimDeJogo = createSprite(width/2,height/2- 50);
  fimDeJogo.addImage(imgFimDeJogo);
  
  reiniciar = createSprite(width/2,height/2);
  reiniciar.addImage(imgReiniciar);
  
  fimDeJogo.scale = 0.5;
  reiniciar.scale = 0.1;

  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
 
  // soloInvisivel.visible =false

  grupodenuvens = new Group();
  grupodeobstaculos = new Group();
  
  pontuacao = 0;
}

function draw() {
  //trex.debug = true;
  background(imagemDeFundo);
  textSize(20);
  fill("black")
  text("Pontuação: "+ pontuacao,30,50);
  
  
  if (estadoJogo === JOGAR){
    pontuacao = pontuacao + Math.round(getFrameRate()/60);
    solo.velocityX = -(6 + 3*pontuacao/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      somDePulo.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
  
    trex.collide(soloInvisivel);
    gerarNuvens();
    gerarObstaculos();
  
    if(grupodeobstaculos.isTouching(trex)){
        somDeColisao.play()
        estadoJogo = ENCERRAR;
    }
  }
  else if (estadoJogo === ENCERRAR) {
      fimDeJogo.visible = true;
      reiniciar.visible = true;
    
    //define velocidade de cada objeto do jogo como 0
      solo.velocityX = 0;
      trex.velocityY = 0
      grupodeobstaculos.setVelocityXEach(0);
      grupodenuvens.setVelocityXEach(0);
    
    //altera a animação do Trex
      trex.changeAnimation("collided", trex_colidiu);
    
    //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
     grupodeobstaculos.setVelocityXEach(-1);
     grupodenuvens.setVelocityXEach(-1);  
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    var nuvem = createSprite(width+20,height-300,40,10);
    nuvem.y = Math.round(random(100,220));
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 300;
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //adicionando nuvem ao grupo
   grupodenuvens.add(nuvem);
  }
  
}

function gerarObstaculos(){
 if (frameCount % 60 === 0){
   var obstaculo = createSprite(600,height-95,20,30);
    obstaculo.setCollider('circle',0,0,45)
    // obstaculo.debug = true
  
    obstaculo.velocityX = -(6 + 3*pontuacao/100);
    
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      default: break;
    }
    
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.3;
    obstaculo.lifetime = 300;
    obstaculo.depth = trex.depth;
    trex.depth +=1;
    //adicionar cada obstáculo ao grupo
    grupodeobstaculos.add(obstaculo);
 }
}

function reset(){
  estadoJogo = JOGAR;
  fimDeJogo.visible = false;
  reiniciar.visible = false;
  
  grupodeobstaculos.destroyEach();
  grupodenuvens.destroyEach();
  
  trex.changeAnimation("running",trex_correndo);
  
  pontuacao = 0;

}
