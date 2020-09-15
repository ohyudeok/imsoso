////////////////////////////////////////////////////////////
// GAME
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */
//Game Text
var loadingText = 'LOADING...'; //text for loading xml

var logoWordParagraph1 = 'rearrange'; //text for logo paragraph 1
var logoWordParagraph2 = 'letters'; //text for logo paragraph 2
//Note all letters enter in logo must exist in letters_arr array list else it will stop the game

var startButtonText = 'TAP TO BEGIN'; //text for start button
var revealText = 'REVEAL ANSWER'; //text for reveal answer button
var showDescription = true; //show/hide description
var showRevealButton = true; // show/hide reveal button
var revealTimer = 15; //timer to show reveal answer button, default is 30 sec

var categoryPage = false; //show/hide category select page
var categoryAllOption = false; //add ALL category select option
var categoryText = 'go'; //text for category page
var categoryAllText = 'ALL'; //text for all category select option

var countdownTimer = 0; //default 0 for normal timer, set more than 0 for countdown timer (in sec);
var resultTitleText = 'BEST TIME'; //text for result page title
var resultText = 'YOU SOLVE [NUMBER] WORDS.'; //text for result page, [NUMBER] will replace with total solve words (countdown timer only)
var buttonReplayText = 'TRY AGAIN'; //text for replay button

var letterSpacing = 25; //spacing between letters
var letterShadowY = 15; //letter shadow distance
var letterDragScale = .3; //letter scale while dragging
var letterDragShadowY = 40; //letter shadow distance while dragging

var playBackgroundMusic = false; //play background music
var autoPlayDescAudio = false; //auto play description audio
var playAnswerAudio = false; //play answer audio when answer is correct or reveal answer
var showAudioDescIcon = true; //show/hide description audio icon

var exitMessage = 'Are you sure you want\nto quit the game?'; //quit game message

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareText ='SHARE IT NOW'; //text for share instruction
var shareTitle = 'Highscore on Rearrange Letters is [SCORE]';//social share score title
var shareMessage = '[SCORE] is mine new highscore on Rearrange Letters! Try it now!'; //social share score message

var limitWords = 0; //limit the amount of words, default 0 to disable 

var letters_arr = [{letter:'a', src:'assets/letter_a.png'},
					{letter:'b', src:'assets/letter_b.png'},
					{letter:'c', src:'assets/letter_c.png'},
					{letter:'d', src:'assets/letter_d.png'},
					{letter:'e', src:'assets/letter_e.png'},
					{letter:'f', src:'assets/letter_f.png'},
					{letter:'g', src:'assets/letter_g.png'},
					{letter:'h', src:'assets/letter_h.png'},
					{letter:'i', src:'assets/letter_i.png'},
					{letter:'j', src:'assets/letter_j.png'},
					{letter:'k', src:'assets/letter_k.png'},
					{letter:'l', src:'assets/letter_l.png'},
					{letter:'m', src:'assets/letter_m.png'},
					{letter:'n', src:'assets/letter_n.png'},
					{letter:'o', src:'assets/letter_o.png'},
					{letter:'p', src:'assets/letter_p.png'},
					{letter:'q', src:'assets/letter_q.png'},
					{letter:'r', src:'assets/letter_r.png'},
					{letter:'s', src:'assets/letter_s.png'},
					{letter:'t', src:'assets/letter_t.png'},
					{letter:'u', src:'assets/letter_u.png'},
					{letter:'v', src:'assets/letter_v.png'},
					{letter:'w', src:'assets/letter_w.png'},
					{letter:'x', src:'assets/letter_x.png'},
					{letter:'y', src:'assets/letter_y.png'},
					{letter:'z', src:'assets/letter_z.png'}];

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.playerData = {score:0};
$.editor = {enable:false};
var allletters_arr = [];
var gamePaused = true;

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	revealButton.cursor = "pointer";
	revealButton.addEventListener("click", function(evt) {
		revealAnswer();
	});
	
	buttonReplay.cursor = "pointer";
	buttonReplay.addEventListener("click", function(evt) {
		playSound('soundWhoosh');
		if(categoryPage){
			goPage('category');
		}else{
			goPage('game');
		}
	});
	
	iconAudioPlay.cursor = "pointer";
	iconAudioPlay.addEventListener("click", function(evt) {
		toggleAudioIcon(false);
		playAudioDesc('audioDesc'+word_arr[curWordCount].id);
	});
	
	iconAudioStop.cursor = "pointer";
	iconAudioStop.addEventListener("click", function(evt) {
		toggleAudioIcon(true);
		stopAudioDesc();
	});
	
	iconFacebook.cursor = "pointer";
	iconFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	iconTwitter.cursor = "pointer";
	iconTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	iconWhatsapp.cursor = "pointer";
	iconWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	//confirm
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleConfirm(false);
		stopGame(true);
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleConfirm(false);
	});
	
	//options
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		toggleConfirm(true);
		toggleOption();
	});
}
function setupGameButton(){
	touchAreaContainer.cursor = "pointer";
	touchAreaContainer.addEventListener("click", handlerMethod);
}

function removeGameButton(){
	touchAreaContainer.cursor = null;
	touchAreaContainer.removeEventListener("click", handlerMethod);
}

function handlerMethod(evt) {
	 switch (evt.type){
		 case 'click':
		 	if(curPage=='category'){
				//category page
				playSound('soundWhoosh');
				
				var touchX = (evt.stageX);
				if(touchX < canvasW/100 * 15){
					//left
					toggleCategory(false);
				}else if(touchX > canvasW/100 * 85){
					//right
					toggleCategory(true);
				}else{
					//choose
					goPage('game');
				}
			}else{
				//main page
				//after xml is loaded
				if(word_arr.length!=0){
					playSound('soundWhoosh');
					if(categoryPage){
						goPage('category');
					}else{
						goPage('game');
					}
				}
			}
		 	break;
	 }
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainLettersAnimate=false;
	mainContainer.visible=false;
	categoryContainer.visible=false;
	gameContainer.visible=false;
	resultContainer.visible=false;
	
	removeGameButton();
	stopAnimateButton(startButton);
	stopAnimateButton(buttonReplay);
	
	var targetContainer = ''
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			setupGameButton();
			startAnimateButton(startButton);
			mainLettersAnimate=true;
			
			if(playBackgroundMusic)
				playSound('music', true);
		break;
		
		case 'category':
			targetContainer = categoryContainer;
			
			setTimeout(function() {
				setupGameButton();
			}, 200);
			startAnimateButton(categoryTxt);
			displayCategoryName();
		break;
		
		case 'game':
			totalWords = currentWords = 0;
			targetContainer = gameContainer;
			startGame();
		break;
		
		case 'result':
			stopAudioDesc();
			if(gameTimerReverse){
				$.playerData.score = totalWords;
				resultTimerTxt.text = resultText.replace('[NUMBER]',totalWords);	
			}else{
				$.playerData.score = gameTimerCount;	
			}
			playSound('soundEnd');
			targetContainer = resultContainer;
			stopGame();
			//setupGameButton();
			startAnimateButton(buttonReplay);
			saveGame($.playerData.score);
		break;
	}
	
	targetContainer.alpha=0;
	targetContainer.visible=true;
	$(targetContainer)
	.clearQueue()
	.stop(true,true)
	.animate({ alpha:1 }, 500);
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
 function startGame(){	
	wordCount=0;
	if(!$.editor.enable){
		shuffle(word_arr);
	}
	
	loadWord();
	//buildLetters();
	
	if(!$.editor.enable){
		toggleGameTimer(true);
	}
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	gamePaused = true;
	stopAudioDesc();
	imageContainer.removeAllChildren();
	lettersContainer.removeAllChildren();
		
	toggleGameTimer(false);
}

/*!
 *
 * SAVE GAME - This is the function that runs to save game
 *
 */
function saveGame(score){
    /*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}


/*!
 * 
 * MAIN LETTERS - This is the function that runs to build main logo letters
 * 
 */
var logoWordY1 = 0;
var logoWordY2 = 0;
var logoWordWidth1 = 0;
var logoWordWidth2 = 0;
var mainLetterScale = 1;

$.mainLettersHolder = {};
$.mainLettersShadow = {};

function buildMainLetters(){
	mainLetterScale=1;
	
	logoWordWidth1 = 0;
	logoWordWidth2 = 0;
	
	logoWordY1 = (canvasH/100)*38;
	logoWordY2 = (canvasH/100)*58;
	
	var wordCount = 0;
	for(n=0; n<logoWordParagraph1.length; n++){
		var curLetter = logoWordParagraph1.substring(n,n+1).toLowerCase();
		$.mainLettersHolder[wordCount] = $.letters[curLetter].clone();
		$.mainLettersShadow[wordCount] = $.letters[curLetter].clone();
		$.mainLettersShadow[wordCount].filters = [
			new createjs.ColorFilter(0,0,0,.2, 0,0,0,0)
		];
		$.mainLettersShadow[wordCount].cache(0, 0, $.mainLettersHolder[wordCount].image.naturalWidth, $.mainLettersHolder[wordCount].image.naturalHeight);
		$.mainLettersHolder[wordCount].name = $.mainLettersShadow[wordCount].name = wordCount;
		mainContainer.addChild($.mainLettersShadow[wordCount], $.mainLettersHolder[wordCount]);
		
		if(n==logoWordParagraph1.length-1){
			logoWordWidth1+=$.mainLettersHolder[wordCount].image.naturalWidth;
		}else{
			logoWordWidth1+=($.mainLettersHolder[wordCount].image.naturalWidth+letterSpacing);
		}
		wordCount++;
	}
	
	for(n=0; n<logoWordParagraph2.length; n++){
		var curLetter = logoWordParagraph2.substring(n,n+1).toLowerCase();
		$.mainLettersHolder[wordCount] = $.letters[curLetter].clone();		
		$.mainLettersShadow[wordCount] = $.letters[curLetter].clone();
		$.mainLettersShadow[wordCount].filters = [
			new createjs.ColorFilter(0,0,0,.2, 0,0,0,0)
		];
		$.mainLettersShadow[wordCount].cache(0, 0, $.mainLettersHolder[wordCount].image.naturalWidth, $.mainLettersHolder[wordCount].image.naturalHeight);
		$.mainLettersHolder[wordCount].name = $.mainLettersShadow[n].name = wordCount;
		mainContainer.addChild($.mainLettersShadow[wordCount], $.mainLettersHolder[wordCount]);
		
		if(n==logoWordParagraph2.length-1){
			logoWordWidth2+=$.mainLettersHolder[wordCount].image.naturalWidth;
		}else{
			logoWordWidth2+=($.mainLettersHolder[wordCount].image.naturalWidth+letterSpacing);
		}
		wordCount++;
	}
	
	//get letters scale
	while(logoWordWidth1*mainLetterScale>canvasW/100*80){
		mainLetterScale -= .05;
	}
	
	//position letters base on new shuffle array
	var startX = 0;
	startX = (canvasW/2) - ((logoWordWidth1/2)*mainLetterScale);
	wordCount=0;
	for(n=0; n<logoWordParagraph1.length; n++){
		startX+=($.mainLettersHolder[wordCount].image.naturalWidth/2)*mainLetterScale;
		
		$.mainLettersHolder[wordCount].x=$.mainLettersShadow[wordCount].x=startX;
		$.mainLettersHolder[wordCount].y=logoWordY1;
		$.mainLettersShadow[wordCount].y=$.mainLettersHolder[wordCount].y+(letterShadowY*mainLetterScale);
		$.mainLettersHolder[wordCount].scaleX=$.mainLettersHolder[wordCount].scaleY=mainLetterScale;
		$.mainLettersShadow[wordCount].scaleX=$.mainLettersShadow[wordCount].scaleY=mainLetterScale;
		
		startX+=(($.mainLettersHolder[wordCount].image.naturalWidth/2)+letterSpacing)*mainLetterScale;
		wordCount++;
	}
	
	startX = (canvasW/2) - ((logoWordWidth2/2)*mainLetterScale);
	for(n=0; n<logoWordParagraph2.length; n++){
		startX+=($.mainLettersHolder[wordCount].image.naturalWidth/2)*mainLetterScale;
		
		$.mainLettersHolder[wordCount].x=$.mainLettersShadow[wordCount].x=startX;
		$.mainLettersHolder[wordCount].y=logoWordY2;
		$.mainLettersShadow[wordCount].y=$.mainLettersHolder[wordCount].y+(letterShadowY*mainLetterScale);
		$.mainLettersHolder[wordCount].scaleX=$.mainLettersHolder[wordCount].scaleY=mainLetterScale;
		$.mainLettersShadow[wordCount].scaleX=$.mainLettersShadow[wordCount].scaleY=mainLetterScale;
		
		startX+=(($.mainLettersHolder[wordCount].image.naturalWidth/2)+letterSpacing)*mainLetterScale;
		wordCount++;
	}
	
	mainLettersAnimate=true;
	startAnimateMainLetters();
}


/*!
 * 
 * ANIMATE MAIN LETTERS - This is the function that runs to animate landing letters
 * 
 */
var mainLettersAnimate = false;
var animateLoopCount = 2;
function startAnimateMainLetters(){
	if(mainLettersAnimate){
		var animateMainCount = Math.round(Math.random()*(logoWordParagraph1.length+logoWordParagraph2.length-2))
		
		var aniamteSpeed = 400;
		var delaySpeed = 50;
		if(animateLoopCount<=0){
			delaySpeed = Math.round(Math.random()*5)*100;
			delaySpeed+=1000;
			animateLoopCount = Math.round(Math.random()*2)+2;
		}
		
		var targetY = 0;
		if(animateMainCount<logoWordParagraph1.length){
			targetY = logoWordY1;
		}else{
			targetY = logoWordY2;
		}
		
		$.mainLettersShadow[animateMainCount].parent.addChild($.mainLettersShadow[animateMainCount]);
		$.mainLettersHolder[animateMainCount].parent.addChild($.mainLettersHolder[animateMainCount]);
		
		$($.mainLettersHolder[animateMainCount])
		.clearQueue()
		.stop(true,false)
		.animate({ scaleX:mainLetterScale+letterDragScale, scaleY:mainLetterScale+letterDragScale, y:(targetY)-((letterDragShadowY*mainLetterScale)/2)}, aniamteSpeed)
		.animate({ scaleX:mainLetterScale, scaleY:mainLetterScale, y:targetY}, aniamteSpeed)
		.animate({ y:targetY}, delaySpeed);
		
		$($.mainLettersShadow[animateMainCount])
		.clearQueue()
		.stop(true,false)
		.animate({ scaleX:mainLetterScale+letterDragScale, scaleY:mainLetterScale+letterDragScale, y:((targetY)-((letterDragShadowY*mainLetterScale)/2))+(letterDragShadowY*mainLetterScale)}, aniamteSpeed)
		.animate({ scaleX:mainLetterScale, scaleY:mainLetterScale, y:(targetY)+(letterShadowY*mainLetterScale)}, aniamteSpeed, function(){
			setTimeout(function() {
				animateLoopCount--;
				startAnimateMainLetters();
			}, delaySpeed);
		});
	}
}


/*!
 * 
 * START ANIMATE BUTTON - This is the function that runs to play blinking animation
 * 
 */
function startAnimateButton(obj){
	obj.alpha=0;
	$(obj)
	.animate({ alpha:1}, 500)
	.animate({ alpha:0}, 500, function(){
		startAnimateButton(obj);	
	});
}

/*!
 * 
 * STOP ANIMATE BUTTON - This is the function that runs to stop blinking animation
 * 
 */
function stopAnimateButton(obj){
	obj.alpha=0;
	$(obj)
	.clearQueue()
	.stop(true,true);
}

/*!
 * 
 * CREATE NEW WORD - This is the function that runs to create letters base on word
 * 
 */
var word_arr=[];
var wordCount = 0;
var curWordCount = 0;
var currentWord = '';
var letterScale = 1;
var lettersSequence_arr = [];
var descAudioExist = false;
var answerAudioExist = false;

$.lettersHolder = {};
$.lettersShadow = {};

/*!
 * 
 * WORD IMAGE PRELOADER - This is the function that runs to load word description image
 * 
 */
function loadWord(){
	toggleWordLoader(true);
	filterCategoryWord();
	imageFest=[];
	
	if(word_arr[wordCount].description == ''){
		imageFest.push({src:word_arr[wordCount].image, id:'imageDesc'+word_arr[wordCount].id})
	}
	if(word_arr[wordCount].audioDesc != ''){
		imageFest.push({src:word_arr[wordCount].audioDesc, id:'audioDesc'+word_arr[wordCount].id})
	}
	if(word_arr[wordCount].audioAnswer != ''){
		imageFest.push({src:word_arr[wordCount].audioAnswer, id:'audioAnswer'+word_arr[wordCount].id})
	}
	
	if(imageFest.length > 0){
		loadWordAssets();	
	}else{
		buildLetters();
	}
}

function buildLetters(){
	gamePaused = false;
	toggleWordLoader(false);
	if(!$.editor.enable){
		toggleRevealTimer(true);
	}
	toggleRevealButton(false);
	
	displayResult = false;
	revealAnswerReady = false;
	revealAnswerButton=false;
	lettersContainer.removeAllChildren();
	 
	touchCon = true;
	currentWord = word_arr[wordCount].answer;
	
	descTxt.text = word_arr[wordCount].description;
	curWordCount = wordCount;
	
	if(descTxt.text.length == 0){
		var curImageDesc = new createjs.Bitmap(imageLoader.getResult('imageDesc'+word_arr[wordCount].id));
		curImageDesc.regX = curImageDesc.image.naturalWidth/2;
		imageContainer.addChild(curImageDesc);
	}
	
	descAudioExist=false;
	answerAudioExist=false;
	
	if(word_arr[wordCount].audioDesc != ''){
		descAudioExist=true;
	}
	if(word_arr[wordCount].audioAnswer != ''){
		answerAudioExist=true;
	}
	
	wordCount++;
	
	hideAudioIcon();
	
	setTimeout(function() {
		if(descAudioExist){
			if(showAudioDescIcon){
				//hide question mark if icon enable
				questionIconTxt.alpha=0;
				toggleAudioIcon(true);
			}
			
			if(autoPlayDescAudio){
				setTimeout(function() {
					toggleAudioIcon(false);
					playAudioDesc('audioDesc'+word_arr[curWordCount].id);
				}, 1000);
			}
		}else{
			questionIconTxt.alpha=1;
		}
	}, 1000);
	
	correctAnimate.gotoAndPlay('static');
	
	descTxt.alpha=0;
	$(descTxt)
	.clearQueue()
	.stop(true,false)
	.animate({ alpha:0},1000)
	.animate({ alpha:1},500);
	
	letterScale=1;
	lettersSequence_arr = [];
	$.lettersHolder = {};
	$.lettersShadow = {};
	
	for(n=0; n<currentWord.length; n++){
		lettersSequence_arr.push(n);
		var curLetter = currentWord.substring(n,n+1);
		$.lettersHolder[n] = $.letters[curLetter].clone();		
		$.lettersShadow[n] = $.letters[curLetter].clone();
		$.lettersShadow[n].filters = [
			new createjs.ColorFilter(0,0,0,.2, 0,0,0,0)
		];
		$.lettersShadow[n].cache(0, 0, $.lettersHolder[n].image.naturalWidth, $.lettersHolder[n].image.naturalHeight);
		$.lettersHolder[n].name = $.lettersShadow[n].name = n;
		lettersContainer.addChild($.lettersShadow[n], $.lettersHolder[n]);
		
		buildDragAndDrop($.lettersHolder[n]);
	}
	shuffleLetters();
	startPlaceLetters();
}

function toggleWordLoader(con){
	if(con){
		descTxt.alpha=1;
		descTxt.text = 'LOADING...'
	}else{
		descTxt.text = '';
	}
}


/*!
 * 
 * SHUFFLE LETTERS - This is the function that runs to randomize letters
 * 
 */
function shuffleLetters(){
	shuffle(lettersSequence_arr);
	
	//suffle again if letters is not randam enough
	var matchCount = 0;
	for(n=0; n<lettersSequence_arr.length; n++){
		if(n==lettersSequence_arr[n]){
			matchCount++;
		}
	}
	
	if(matchCount > Math.floor(lettersSequence_arr.length/2)){
		shuffleLetters();
	}
}

/*!
 * 
 * POSITION LETTERS - This is the function that runs to place and position letters
 * 
 */
var wordWidth = 0;
function startPlaceLetters(){
	//get letters width
	getWordWidth(-1);
	
	//get letters scale
	while(wordWidth*letterScale>canvasW/100*80){
		letterScale -= .05;
	}
	
	//position letters base on new shuffle array
	var startX =  (canvasW/2) - ((wordWidth/2)*letterScale);
	for(n=0; n<lettersSequence_arr.length; n++){
		var targetID = lettersSequence_arr[n];
		startX+=($.lettersHolder[targetID].image.naturalWidth/2)*letterScale;
		
		$.lettersHolder[targetID].x=$.lettersShadow[targetID].x=startX;
		$.lettersHolder[targetID].y=canvasH/2;
		$.lettersShadow[targetID].y=(canvasH/2)+(letterShadowY*letterScale);
		$.lettersHolder[targetID].scaleX=$.lettersHolder[targetID].scaleY=letterScale;
		$.lettersShadow[targetID].scaleX=$.lettersShadow[targetID].scaleY=letterScale;
		
		startX+=(($.lettersHolder[targetID].image.naturalWidth/2)+letterSpacing)*letterScale;
	}
	
	lettersContainer.alpha=0;
	$(lettersContainer)
	.clearQueue()
	.stop(true,false)
	.animate({ alpha:1}, 500);
}


/*!
 * 
 * DRAG AND DROP EVENTS - This is the function that runs to add drag and drop event
 * 
 */
var touchCon=true;
function buildDragAndDrop(letter){
	letter.cursor = "pointer";
	letter.addEventListener("mousedown", function(evt) {
		playSound('soundDrag');
		toggleDragEvent(evt, 'drag', touchCon)
	});
	letter.addEventListener("pressmove", function(evt) {
		toggleDragEvent(evt, 'move', touchCon)
	});
	letter.addEventListener("pressup", function(evt) {
		playSound('soundDrop');
		toggleDragEvent(evt, 'release', touchCon)
	});	
}

function toggleDragEvent(obj, con, _touchCon){
	if(_touchCon){
		switch(con){
			case 'drag':
				highlightAnimate = true;
				
				//target shadow
				obj.target.parent.addChild($.lettersShadow[obj.target.name]);
				obj.target.parent.addChild(obj.target);
				obj.target.offset = {x:obj.target.x-(obj.stageX), y:obj.target.y- (obj.stageY)};
				obj.target.newY = (canvasH/2)-((letterDragShadowY*letterScale)/2);
				moveLetters(obj.target.name, obj.target.x, false);
				
				setTimeout(function() {
					 moveLetters(obj.target.name, obj.target.x, true);
				}, 500);
				
			break;
			
			case 'move':
				obj.target.x = (obj.stageX) + obj.target.offset.x;
				moveLetters(obj.target.name, obj.target.x, true);
				
				$.lettersShadow[obj.target.name].x = obj.target.x;
				$.lettersShadow[obj.target.name].y = obj.target.y + (letterDragShadowY*letterScale);
			break;
			
			case 'release':
				moveLetters(-1, obj.target.x, false);
				checkCorrectWord();
			break;
		}
	}
}


/*!
 * 
 * HIGHLIGHT AND MOVE LETTERS - This is the function that runs to set highlight and letters movement
 * 
 */
var lettersstore_arr = [];
function moveLetters(id, mouseX, dragging){
	lettersstore_arr = [];
	for(n=0; n<lettersSequence_arr.length; n++){
		if(dragging){
			//push to store array without dragging letter
			if(id != lettersSequence_arr[n]){
				lettersstore_arr.push({id:lettersSequence_arr[n], posX:$.lettersHolder[lettersSequence_arr[n]].x});
			}
		}else{
			//highlight dragging letter
			if(id==lettersSequence_arr[n]){
				$.lettersHolder[lettersSequence_arr[n]].newScaleX=$.lettersHolder[lettersSequence_arr[n]].newScaleY=letterScale+letterDragScale;
			}else{
				$.lettersHolder[lettersSequence_arr[n]].newScaleX=$.lettersHolder[lettersSequence_arr[n]].newScaleY=letterScale;
			}
			
			//push to store array
			lettersstore_arr.push({id:lettersSequence_arr[n], posX:$.lettersHolder[lettersSequence_arr[n]].x});
		}
	}
		
	//sort store array base on position x
	lettersstore_arr.sort(function(a, b){
		var a1= a.posX, b1= b.posX;
		if(a1== b1) return 0;
		return a1> b1? 1: -1;
	});
	
	if(dragging){
		//find sequence of dragging letter 
		var targetSpaceID=0;
		for(n=0; n<lettersstore_arr.length; n++){
			if(id!=lettersstore_arr[n].id){
				if(mouseX<lettersstore_arr[n].posX){
					targetSpaceID=n;
					n=lettersstore_arr.length;
				}else if(mouseX>lettersstore_arr[n].posX && n==lettersstore_arr.length-1){
					targetSpaceID=n+1;
				}
			}
		}
		
		//store new sequence to move array
		lettersstore_arr.splice(targetSpaceID, 0, {id:id, posX:$.lettersHolder[id].x});
		
		//get letters width
		getWordWidth(-1);
	}else{
		//get letters width without dragging letter
		getWordWidth(id);
	}
	
	var animateThrough=false;
	var startX =  (canvasW/2) - ((wordWidth/2)*letterScale);
	
	//position letters without dragging letter
	for(n=0; n<lettersstore_arr.length; n++){
		var targetID = lettersstore_arr[n].id;
		
		if(dragging){
			startX+=($.lettersHolder[targetID].image.naturalWidth/2)*letterScale;
			
			if(id != targetID){
				if(startX != $.lettersHolder[targetID].newX){
					$.lettersHolder[targetID].newX=startX;
					animateThrough=true;
				}
			}
			
			startX+=(($.lettersHolder[targetID].image.naturalWidth/2)+letterSpacing)*letterScale;
		}else{
			animateThrough=true;
			if(id != targetID){
				startX+=($.lettersHolder[targetID].image.naturalWidth/2)*letterScale;
				
				$.lettersHolder[targetID].newScaleX=$.lettersHolder[targetID].newScaleY=letterScale;
				$.lettersHolder[targetID].newX=startX;
				$.lettersHolder[targetID].newY=canvasH/2;
				
				startX+=(($.lettersHolder[targetID].image.naturalWidth/2)+letterSpacing)*letterScale;
			}	
		}
	}
	
	if(!dragging){
		//set new listing to sequence array
		if(id==-1){
			lettersSequence_arr = [];
			for(n=0; n<lettersstore_arr.length; n++){
				lettersSequence_arr.push(lettersstore_arr[n].id);
			}
		}	
	}
	
	if(animateThrough)
		animateLetter(id);
}


/*!
 * 
 * ANIMATE LETTERS - This is the function that runs to play letters animation
 * 
 */
var animateCon = false;
var highlightAnimate = false;
function animateLetter(id){
	animateCon = true;
	for(n=0; n<lettersSequence_arr.length; n++){
		var targetID = lettersSequence_arr[n];
		if(id!=targetID){
			$($.lettersHolder[targetID])
			.clearQueue()
			.stop(true,false)
			.animate({ x:$.lettersHolder[targetID].newX, 
					   y:$.lettersHolder[targetID].newY,
					   scaleX:$.lettersHolder[targetID].newScaleX,
					   scaleY:$.lettersHolder[targetID].newScaleY},
					   500, function(){
							animateCon=false;   
					   });
					   
			$($.lettersShadow[targetID])
			.clearQueue()
			.stop(true,false)
			.animate({ x:$.lettersHolder[targetID].newX, 
					   y:$.lettersHolder[targetID].newY+(letterShadowY*letterScale),
					   scaleX:$.lettersHolder[targetID].newScaleX,
					   scaleY:$.lettersHolder[targetID].newScaleY},
					   500, function(){
							animateCon=false;   
					   });
		}else{
			if(highlightAnimate){
				highlightAnimate=false;
				$($.lettersHolder[targetID])
				.clearQueue()
				.stop(true,false)
				.animate({ scaleX:$.lettersHolder[targetID].newScaleX,
						   scaleY:$.lettersHolder[targetID].newScaleY,
						   y:$.lettersHolder[targetID].newY},
						   500, function(){
								animateCon=false;   
						   });
						   
				$($.lettersShadow[targetID])
				.clearQueue()
				.stop(true,false)
				.animate({ scaleX:$.lettersHolder[targetID].newScaleX,
						   scaleY:$.lettersHolder[targetID].newScaleY,
						   y:$.lettersHolder[targetID].newY+(letterDragShadowY*letterScale)},
						   500, function(){
								animateCon=false;   
						   });
			}
		}
	}
}

/*!
 * 
 * CHECK CORRECT WORD - This is the function that runs to check if all ther letters sequence is correct to form the word
 * 
 */
function checkCorrectWord(){
	var noMatchLetter = 0;
	for(n=0; n<currentWord.length; n++){
		if(currentWord.substring(n,n+1)!=currentWord.substring(lettersSequence_arr[n], lettersSequence_arr[n]+1)){
			noMatchLetter++;
		}
	}
	
	if(noMatchLetter==0){
		stopAudioDesc();
		answerAudioComplete = true;
		if(playAnswerAudio && answerAudioExist){
			setTimeout(function() {
				answerAudioComplete = false;
				playAudioAnswer('audioAnswer'+word_arr[curWordCount].id);
			}, 500);
		}
		
		touchCon=false;
		toggleRevealTimer(false);
		toggleRevealButton(false);
		questionIconTxt.alpha=0;
		hideAudioIcon();
		
		setTimeout(function() {
			currentWords++;
			var animateSpeed = 300;
			var scale = .05
			for(n=0; n<lettersSequence_arr.length; n++){
				var targetID = lettersSequence_arr[n];
				$($.lettersHolder[targetID])
				.clearQueue()
				.stop(true,false)
				.animate({scaleX:letterScale+scale, scaleY:letterScale+scale},animateSpeed)
				.animate({scaleX:letterScale, scaleY:letterScale},animateSpeed);
				
				$($.lettersShadow[targetID])
				.clearQueue()
				.stop(true,false)
				.animate({scaleX:letterScale+scale, scaleY:letterScale+scale},animateSpeed)
				.animate({scaleX:letterScale, scaleY:letterScale},animateSpeed, function(){
					playTickAnimation();
				});
			}
		}, 500);
	}
}

var displayResult = false;
var answerAudioComplete = true;
var totalWords = 0;
var currentWords = 0;

function playTickAnimation(){
	if(!displayResult && answerAudioComplete){
		displayResult=true;
		descTxt.alpha=0;
		imageContainer.removeAllChildren();
		
		if(!revealAnswerReady){
			totalWords++;
			playSound('soundScore');
			correctAnimate.gotoAndPlay('correct');
		}
		
		if(!$.editor.enable){
			setTimeout(function() {
				if(checkWordEnd()){
					loadWord();	
				}else{
					goPage('result');
				}
			}, 1500);
		}
	}
}


/*!
 * 
 * GET WORD WIDTH - This is the function that runs to get total word width
 * 
 */
function getWordWidth(id){
	wordWidth = 0;
	for(n=0; n<lettersSequence_arr.length; n++){
		if(id != lettersSequence_arr[n]){
			if(n==lettersSequence_arr.length-1){
				//last word without spacing
				wordWidth+=$.lettersHolder[n].image.naturalWidth;
			}else{
				wordWidth+=($.lettersHolder[n].image.naturalWidth+letterSpacing);
			}
		}
	}
}


/*!
 * 
 * REVEAL TIMER - This is the function that runs to start reveal button timer
 * 
 */
var revealTimerInterval
var revealTimerCount = 0;
function toggleRevealTimer(con){
	if(showRevealButton){
		if(con){
			revealTimerCount = 0;
			clearInterval(revealTimerInterval);
			revealTimerInterval = setInterval(function(){ 
				if(!gamePaused){
					revealTimerCount+=1;
					if(revealTimerCount>=revealTimer){
						revealAnswerButton=true;
						playSound('soundReveal');
						toggleRevealButton(true);
						toggleRevealTimer(false);
					}
				}
			}, 1000);
		}else{
			clearInterval(revealTimerInterval);
			revealTimerInterval=null;
		}
	}
}

/*!
 * 
 * TOGGLE REVEAL BUTTON - This is the function that runs to show or hide reveal button
 * 
 */
function toggleRevealButton(con){
	if(con){
		hideAudioIcon();
		questionIconTxt.alpha=0;
		revealButton.visible=true;
		stopAnimateButton(revealButton);
		startAnimateButton(revealButton);
	}else{
		if(descAudioExist){
			toggleAudioIcon(true);
		}else{
			questionIconTxt.alpha=1;	
		}
		revealButton.visible=false;
		stopAnimateButton(revealButton);	
	}
}


/*!
 * 
 * REVEAL ANSWER - This is the function that runs to reveal answer animation
 * 
 */
var revealAnswerReady=false;
var revealAnswerButton=false;
function revealAnswer(){
	stopAudioDesc();
	playSound('soundAnimate');
	revealAnswerReady=true;
	toggleRevealButton(false);
	questionIconTxt.alpha=0;
	hideAudioIcon();
	touchCon=false;
	
	//get letters width
	getWordWidth(-1);
		
	//position letters base on new shuffle array
	lettersSequence_arr = [];
	var startX =  (canvasW/2) - ((wordWidth/2)*letterScale);
	var animateTotalSpeed = (1000/currentWord.length);
	var animateSpeed = 0;
	for(n=0; n<currentWord.length; n++){
		var targetID = n;
		startX+=($.lettersHolder[targetID].image.naturalWidth/2)*letterScale;
		
		$.lettersHolder[targetID].newX=$.lettersShadow[targetID].newX=startX;
		$.lettersHolder[targetID].newY=canvasH/2;
		$.lettersShadow[targetID].newY=(canvasH/2)+(letterShadowY*letterScale);
		$.lettersHolder[targetID].newScaleX=$.lettersHolder[targetID].newScaleY=letterScale;
		$.lettersShadow[targetID].newScaleX=$.lettersShadow[targetID].newScaleY=letterScale;
		
		startX+=(($.lettersHolder[targetID].image.naturalWidth/2)+letterSpacing)*letterScale;
		
		$($.lettersHolder[targetID])
		.clearQueue()
		.stop(true,false)
		.animate({ scaleX:$.lettersHolder[targetID].newScaleX},
				   animateSpeed)
		.animate({ x:$.lettersHolder[targetID].newX, 
				   y:$.lettersHolder[targetID].newY,
				   scaleX:$.lettersHolder[targetID].newScaleX,
				   scaleY:$.lettersHolder[targetID].newScaleY},
				   500);
				   
		$($.lettersShadow[targetID])
		.clearQueue()
		.stop(true,false)
		.animate({ scaleX:$.lettersHolder[targetID].newScaleX},
				   animateSpeed)
		.animate({ x:$.lettersHolder[targetID].newX, 
				   y:$.lettersHolder[targetID].newY+(letterShadowY*letterScale),
				   scaleX:$.lettersHolder[targetID].newScaleX,
				   scaleY:$.lettersHolder[targetID].newScaleY},
				   500);
		
		animateSpeed+=animateTotalSpeed;
		lettersSequence_arr.push(n);
	}
	
	setTimeout(function() {
		checkCorrectWord();
	}, animateSpeed);
	
	//animateCorrectAnswer();
}

function animateCorrectAnswer(){
	//find the wrong letters
	var moveID = -1;
	var replaceID = -1;
	
	var moveLetter
	var replaceLetter
	
	for(n=0; n<lettersSequence_arr.length; n++){
		if(currentWord.substring(n,n+1)!=currentWord.substring(lettersSequence_arr[n], lettersSequence_arr[n]+1)){
			highlightAnimate = true;
			
			moveID = lettersSequence_arr[n];
			moveLetter = $.lettersHolder[lettersSequence_arr[n]];
			moveLetter.parent.addChild(moveLetter);
			moveLetter.newY = (canvasH/2)-((letterDragShadowY*letterScale)/2);
			moveLetters(moveLetter.name, moveLetter.x, false);
			
			setTimeout(function() {
				 moveLetters(moveLetter.name, moveLetter.x, true);
			}, 500);
		}
	}
	
	if(moveID != -1){
		//find the correct position
		for(n=0; n<lettersSequence_arr.length; n++){
			//if is more than or last
			if(lettersSequence_arr[n]+1 == moveID || lettersSequence_arr[n]+1 == lettersSequence_arr.length){
				replaceID = lettersSequence_arr[n];
				replaceLetter = $.lettersHolder[lettersSequence_arr[n]];
				
				setTimeout(function() {
					$(moveLetter)
					.clearQueue()
					.stop(true,false)
					.animate({ x:replaceLetter.x+(replaceLetter.image.naturalWidth)}, 500, function(){
						moveLetters(-1, moveLetter.x, false);
					});
				}, 1000);
			}
		}
	}
	
	setTimeout(function() {
		animateCorrectAnswer();
	}, 2100);
}


/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
var gameTimerInterval
var gameTimerCount = 0;
var gameTimerReverse = false;
function toggleGameTimer(con){
	if(con){
		gameTimerCount = 0;
		if(countdownTimer != 0){
			gameTimerReverse = true;
			gameTimerCount = countdownTimer * 1000;
		}
		clearInterval(gameTimerInterval);
		gameTimerInterval = setInterval(function(){
			if(!gamePaused){
				if(gameTimerReverse){
					gameTimerCount-=1000;
				}else{
					gameTimerCount+=1000;
				}
				resultTimerTxt.text=timerTxt.text=millisecondsToTime(gameTimerCount);
				
				if(gameTimerCount==0){
					goPage('result');	
				}
			}
		}, 1000);
	}else{
		clearInterval(gameTimerInterval);
	}
}


/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTime(milli) {
      var milliseconds = milli % 1000;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);
	  
	  if(seconds<10){
		seconds = '0'+seconds;  
	  }
	  
	  if(minutes<10){
		minutes = '0'+minutes;  
	  }
	  return minutes + ":" + seconds;
}


/*!
 * 
 * SWITCH CATEGORY - This is the function that runs to select category name
 * 
 */
var category_arr=[];
var categoryNum=0;

function toggleCategory(con){
	if(con){
		categoryNum++;
		categoryNum=categoryNum>category_arr.length-1?0:categoryNum;
	}else{
		categoryNum--;
		categoryNum=categoryNum<0?category_arr.length-1:categoryNum;
	}
	displayCategoryName();
}

function displayCategoryName(){
	categoryTitleTxt.text = categoryTitleShadowTxt.text = category_arr[categoryNum];
}


/*!
 * 
 * FILTER CATEGORY WORD - This is the function that runs to filter category
 * 
 */
function filterCategoryWord(){
	//do nothing if category page is off
	if(!categoryPage){
		return;
	}
	
	if($.editor.enable){
		return;
	}
	
	//do nothing if category all is selected
	if(categoryAllOption && category_arr[categoryNum] == categoryAllText){
		return;
	}
	
	//filter the category
	for(n=wordCount;n<word_arr.length;n++){
		if(category_arr[categoryNum] == word_arr[n].category){
			wordCount = n;
			n = word_arr.length-1;
		}
	}
}


/*!
 * 
 * CHECK WORD END - This is the function that runs to check if the word is end
 * 
 */
function checkWordEnd(){	
	var lastCount = 0;
	if(limitWords != 0){
		var newlimitWords = limitWords;
		newlimitWords = newlimitWords > word_arr.length ? word_arr.length : newlimitWords;
		lastCount = newlimitWords;
		if(currentWords >= newlimitWords){
			return false;
		}
	}else{
		lastCount = word_arr.length;
	}
	
	//do nothing if category page is off
	if(!categoryPage){
		return (wordCount < lastCount);
	}
	
	//do nothing if category all is selected
	if(categoryAllOption && category_arr[categoryNum] == categoryAllText){
		return (wordCount < lastCount);
	}
	
	var categoryWordExist = false;	
	for(n=wordCount;n<word_arr.length;n++){
		if(category_arr[categoryNum] == word_arr[n].category){
			categoryWordExist = true;
		}
	}
	return categoryWordExist;
}


/*!
 * 
 * XML - This is the function that runs to load word from xml
 * 
 */
function loadXML(src){
	$.ajax({
       url: src,
       type: "GET",
       dataType: "xml",
       success: function (result) {
		   if($.editor.enable){
				edit.xmlFile = result;
			}
			
		    var wordCountNum = 0;
			audioFest=[];
			imageFest=[];
			
            $(result).find('item').each(function(){
				var thisWord = $(this).find('answer').text().toLowerCase();
				var validateWord = true;
				for(n=0; n<thisWord.length; n++){
					var findLetter = thisWord.substring(n,n+1);
					var existLetter = allletters_arr.indexOf(findLetter);
					if(existLetter==-1){
						validateWord=false;
					}
				}
				
				if(thisWord.length >= 3 && validateWord){
					var description = '';
					if($(this).find('description').text() != ''){
						description = $(this).find('description').text();
					}
					
					word_arr.push({id:wordCountNum, answer:$(this).find('answer').text().toLowerCase(), description:description, category:$(this).find('category').text().toLowerCase(), image:$(this).find('imageDesc').text(), audioDesc:$(this).find('audioDesc').text(), audioAnswer:$(this).find('audioAnswer').text()});
					category_arr.push($(this).find('category').text().toLowerCase());
					
					/*if($(this).find('imageDesc').text() != ''){
						imageFest.push({src:$(this).find('imageDesc').text(), id:'imageDesc'+wordCountNum})
					}
					
					if($(this).find('audioDesc').text() != ''){
						audioFest.push({src:$(this).find('audioDesc').text(), id:'audioDesc'+wordCountNum})
					}
					if($(this).find('audioAnswer').text() != ''){
						audioFest.push({src:$(this).find('audioAnswer').text(), id:'audioAnswer'+wordCountNum})
					}*/
				}
				wordCountNum++;
			});
			
			/*if(soundOn && audioFest.length>0){
				loadAnswerAudio();
			}else if(imageFest.length>0){
				loadDescriptionImage();
			}else{
				checkGameReady();
			}*/
			checkGameReady();
       }
	});
}

/*!
 * 
 * GAME READY TO START - This is the function that runs to check if game is ready
 * 
 */
function checkGameReady(){
	descTxt.visible=questionIconTxt.visible=showDescription;
	if(word_arr.length!=0){
		category_arr = unique(category_arr);
		if(categoryAllOption){
			category_arr.push(categoryAllText);
		}
		startButton.text = startButtonText;
		
		if($.editor.enable){
			loadEditPage();
			goPage('game');
		}
	}	
}

function toggleAudioIcon(con){
	if(showAudioDescIcon && !revealAnswerButton){
		if(con){
			iconAudioPlay.visible=true;
			iconAudioStop.visible=false;
		}else{
			iconAudioPlay.visible=false;
			iconAudioStop.visible=true;
		}
	}else{
		hideAudioIcon();
	}
}

function hideAudioIcon(){
	iconAudioPlay.visible=false;
	iconAudioStop.visible=false;
}

/*!
 * 
 * QUESTION AND ANSWER IMAGE PRELOADER - This is the function that runs to preload question/answer image
 * 
 */
var imageLoader, imageFest;
function loadWordAssets(){
	imageLoader = new createjs.LoadQueue(false);
	createjs.Sound.alternateExtensions = ["mp3"];
	imageLoader.installPlugin(createjs.Sound);
	
	imageLoader.addEventListener("complete", handleWordComplete);
	imageLoader.loadManifest(imageFest);
}

function handleWordComplete() {
	buildLetters();
};

/*!
 * 
 * CONFIRM - This is the function that runs to toggle confirm
 * 
 */
function toggleConfirm(con){
	confirmContainer.visible = con;
	gamePaused = con;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	var title = '';
	var text = '';
	if(gameTimerReverse){
		title = shareTitle.replace("[SCORE]", totalWords);
		text = shareMessage.replace("[SCORE]", totalWords);
	}else{
		title = shareTitle.replace("[SCORE]", millisecondsToTime(gameTimerCount));
		text = shareMessage.replace("[SCORE]", millisecondsToTime(gameTimerCount));
	}
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}