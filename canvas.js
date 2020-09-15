////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);	
}

var canvasContainer, mainContainer, categoryContainer, gameContainer, lettersContainer, imageContainer, resultContainer;
var bg, timerTxt, descTxt, resultTxt, resultTimerTxt, questionIconTxt, revealButton, startButton, buttonReplay, correctAnimate, correctData, correctFrame, arrowLeft, arrowRight, categoryTxt, categoryTitleTxt, categoryTitleShadowTxt, iconAudioPlay, iconAudioStop, iconFacebook, iconTwitter, iconWhatsapp, shareTxt;
$.letters={};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	touchAreaContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	categoryContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	lettersContainer = new createjs.Container();
	imageContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	confirmContainer = new createjs.Container();
	optionsContainer = new createjs.Container();
	
	imageContainer.x = canvasW/2;
	imageContainer.y = canvasH/100 * 73;
	
	var _frameW=75;
	var _frameH=55;
	var _frame = {"regX": (_frameW/2), "regY": (_frameH/2), "height": _frameH, "count": 16, "width": _frameW};
	var _animations = {static:{frames: [0]},
						correct:{frames: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], speed: 1, next:'correctLast'},
						correctLast:[15]};
	//game
	correctData = new createjs.SpriteSheet({
		"images": [loader.getResult("correct").src],
		"frames": _frame,
		"animations": _animations
	});
	
	correctAnimate = new createjs.Sprite(correctData, "static");
	correctAnimate.framerate = 20;
	correctAnimate.x = canvasW/2;
	correctAnimate.y = canvasH/100*75;
	
	bg = new createjs.Shape();
	bg.graphics.beginFill("#19BD9B").drawRect(0, 0, canvasW, canvasH);
	
	for(n=0;n<letters_arr.length; n++){
		$.letters[letters_arr[n].letter] = new createjs.Bitmap(loader.getResult(letters_arr[n].letter));
		$.letters[letters_arr[n].letter].x = -500;
		createHitarea($.letters[letters_arr[n].letter]);
		centerReg($.letters[letters_arr[n].letter]);
		mainContainer.addChild($.letters[letters_arr[n].letter]);
		allletters_arr.push(letters_arr[n].letter);
	}
	
	timerTxt = new createjs.Text();
	timerTxt.font = "50px multicolore";
	timerTxt.color = "#ffffff";
	timerTxt.text = '00:00';
	timerTxt.textAlign = "center";
	timerTxt.textBaseline='alphabetic';
	timerTxt.x = canvasW/2;
	timerTxt.y = canvasH/100*30;
	
	descTxt = new createjs.Text();
	descTxt.font = "25px rimouski";
	descTxt.color = "#ffffff";
	descTxt.text = '';
	descTxt.textAlign = "center";
	descTxt.textBaseline='alphabetic';
	descTxt.lineWidth = canvasW/100 * 70;
	descTxt.x = canvasW/2;
	descTxt.y = canvasH/100*76;
	descTxt.lineHeight = 28;
	descTxt.textBaseline = "alphabetic";
	
	questionIconTxt = new createjs.Text();
	questionIconTxt.font = "30px multicolore";
	questionIconTxt.color = "#ffffff";
	questionIconTxt.text = '?';
	questionIconTxt.textAlign = "center";
	questionIconTxt.textBaseline='alphabetic';
	questionIconTxt.x = canvasW/2;
	questionIconTxt.y = canvasH/100*70;
	
	iconAudioPlay = new createjs.Bitmap(loader.getResult('iconAudioPlay'));
	iconAudioStop = new createjs.Bitmap(loader.getResult('iconAudioStop'));
	centerReg(iconAudioPlay);
	createHitarea(iconAudioPlay);
	centerReg(iconAudioStop);
	createHitarea(iconAudioStop);
	iconAudioPlay.x = iconAudioStop.x = canvasW/2;
	iconAudioPlay.y = iconAudioStop.y = canvasH/100*68;
	
	revealButton= new createjs.Text();
	revealButton.font = "30px multicolore";
	revealButton.color = "#ffffff";
	revealButton.text = revealText;
	revealButton.textAlign = "center";
	revealButton.textBaseline='alphabetic';
	revealButton.x = canvasW/2;
	revealButton.y = canvasH/100*70;
	revealButton.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(-200, -30, 400, 35));
	
	resultTxt = new createjs.Text();
	resultTxt.font = "50px multicolore";
	resultTxt.color = "#ffffff";
	resultTxt.text = resultTitleText;
	resultTxt.textAlign = "center";
	resultTxt.textBaseline='alphabetic';
	resultTxt.x = canvasW/2;
	resultTxt.y = canvasH/100*45;
	
	startButton = new createjs.Text();
	startButton.font = "30px multicolore";
	startButton.color = "#ffffff";
	startButton.text = loadingText;
	startButton.textAlign = "center";
	startButton.textBaseline='alphabetic';
	startButton.x = canvasW/2;
	startButton.y = canvasH/100*75;
	
	resultTimerTxt = new createjs.Text();
	resultTimerTxt.font = "50px multicolore";
	resultTimerTxt.color = "#ffffff";
	resultTimerTxt.text = resultTitleText;
	resultTimerTxt.textAlign = "center";
	resultTimerTxt.textBaseline='alphabetic';
	resultTimerTxt.x = canvasW/2;
	resultTimerTxt.y = canvasH/100*53;
	
	buttonReplay = new createjs.Text();
	buttonReplay.font = "30px multicolore";
	buttonReplay.color = "#ffffff";
	buttonReplay.text = buttonReplayText;
	buttonReplay.textAlign = "center";
	buttonReplay.textBaseline='alphabetic';
	buttonReplay.x = canvasW/2;
	buttonReplay.y = canvasH/100*60;
	buttonReplay.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(-200, -30, 400, 40));	
	
	arrowLeft = new createjs.Bitmap(loader.getResult('arrow'));
	arrowRight = new createjs.Bitmap(loader.getResult('arrow'));
	centerReg(arrowLeft);
	centerReg(arrowRight);
	
	arrowLeft.x = canvasW/100 * 10;
	arrowRight.x = canvasW/100 * 90;
	arrowLeft.scaleX = -1;
	arrowLeft.y = arrowRight.y = canvasH/2;
	
	createHitarea(arrowLeft);
	createHitarea(arrowRight);
	
	categoryTxt = new createjs.Text();
	categoryTxt.font = "30px multicolore";
	categoryTxt.color = "#ffffff";
	categoryTxt.text = categoryText;
	categoryTxt.textAlign = "center";
	categoryTxt.textBaseline='alphabetic';
	categoryTxt.x = canvasW/2;
	categoryTxt.y = canvasH/100*70;
	
	categoryTitleTxt = new createjs.Text();
	categoryTitleTxt.font = "150px multicolore";
	categoryTitleTxt.color = "#ffffff";
	categoryTitleTxt.text = 'RIDDLE';
	categoryTitleTxt.textAlign = "center";
	categoryTitleTxt.textBaseline='alphabetic';
	categoryTitleTxt.x = canvasW/2;
	categoryTitleTxt.y = canvasH/100 * 58;
	
	categoryTitleShadowTxt = new createjs.Text();
	categoryTitleShadowTxt.font = "150px multicolore";
	categoryTitleShadowTxt.color = "#000000";
	categoryTitleShadowTxt.text = 'RIDDLE';
	categoryTitleShadowTxt.textAlign = "center";
	categoryTitleShadowTxt.textBaseline='alphabetic';
	categoryTitleShadowTxt.alpha = .2;
	categoryTitleShadowTxt.x = canvasW/2;
	categoryTitleShadowTxt.y = (canvasH/100 * 58)+10;
	
	shareTxt = new createjs.Text();
	shareTxt.font = "30px multicolore";
	shareTxt.color = "#ffffff";
	shareTxt.text = shareText;
	shareTxt.textAlign = "center";
	shareTxt.textBaseline='alphabetic';
	shareTxt.x = canvasW/2;
	shareTxt.y = canvasH/100 * 72;
	
	iconFacebook = new createjs.Bitmap(loader.getResult('iconFacebook'));
	iconTwitter = new createjs.Bitmap(loader.getResult('iconTwitter'));
	iconWhatsapp = new createjs.Bitmap(loader.getResult('iconWhatsapp'));
	centerReg(iconFacebook);
	createHitarea(iconFacebook);
	centerReg(iconTwitter);
	createHitarea(iconTwitter);
	centerReg(iconWhatsapp);
	createHitarea(iconWhatsapp);
	iconFacebook.x = canvasW/100*40;
	iconTwitter.x = canvasW/2;
	iconWhatsapp.x = canvasW/100*60;
	iconFacebook.y = iconTwitter.y = iconWhatsapp.y = canvasH/100 * 80;
	
	//option
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	centerReg(itemExit);
	itemExit.x = canvasW/2;
	itemExit.y = canvasH/2;
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	buttonConfirm.x = canvasW/100* 35;
	buttonConfirm.y = canvasH/100 * 63;
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	buttonCancel.x = canvasW/100 * 65;
	buttonCancel.y = canvasH/100 * 63;
	
	confirmMessageTxt = new createjs.Text();
	confirmMessageTxt.font = "35px multicolore";
	confirmMessageTxt.color = "#fff";
	confirmMessageTxt.textAlign = "center";
	confirmMessageTxt.textBaseline='alphabetic';
	confirmMessageTxt.text = exitMessage;
	confirmMessageTxt.x = canvasW/2;
	confirmMessageTxt.y = canvasH/100 *44;
	
	confirmContainer.addChild(itemExit, buttonConfirm, buttonCancel, confirmMessageTxt);
	confirmContainer.visible = false;
	
	mainContainer.addChild(startButton);
	categoryContainer.addChild(arrowLeft, arrowRight, categoryTxt, categoryTitleShadowTxt, categoryTitleTxt);
	gameContainer.addChild(timerTxt, descTxt, questionIconTxt, iconAudioPlay, iconAudioStop, lettersContainer, imageContainer, correctAnimate, revealButton)
	resultContainer.addChild(resultTxt, buttonReplay, resultTimerTxt);
	
	
	touchAreaContainer.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, canvasW, canvasH));	
	canvasContainer.addChild(bg, mainContainer, categoryContainer, touchAreaContainer, gameContainer, resultContainer, confirmContainer, optionsContainer, buttonSettings);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		buttonSettings.x = (canvasW - offset.x) - 60;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 75;
		if(curPage != 'game'){
			buttonExit.visible = false;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
		}else{
			buttonExit.visible = true;
			buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
			buttonSoundOn.x = buttonSoundOff.x;
			buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+(distanceNum);
			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*2);
			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*3);
		}
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}