////////////////////////////////////////////////////////////
// SOUND
////////////////////////////////////////////////////////////
var enableMobileSound = PLAY_FAILED;
var soundOn;

function playSound(target, loop){
	if(soundOn){
		var isLoop;
		if(loop){
			isLoop = -1;
			createjs.Sound.stop();
			musicLoop = createjs.Sound.play(target, createjs.Sound.INTERRUPT_NONE, 0, 0, isLoop, 1);
			if (musicLoop == null || musicLoop.playState == createjs.Sound.PLAY_FAILED) {
				return;
			}else{
				musicLoop.removeAllEventListeners();
				musicLoop.addEventListener ("complete", function(musicLoop) {
					
				});
			}
		}else{
			isLoop = 0;
			createjs.Sound.play(target);
		}
	}
}

function stopSound(){
	createjs.Sound.stop();
}

/*!
 * 
 * PLAY AUDIO - This is the function that runs to play description and answer audio
 * 
 */
var audioDesc = null;
function playAudioDesc(audio){
	if(audioDesc==null){
		audioDesc = createjs.Sound.play(audio);
		audioDesc.removeAllEventListeners();
		audioDesc.addEventListener ("complete", function(event) {
			toggleAudioIcon(true);
			audioDesc = null;
		});
	}
}

function stopAudioDesc(){
	if(audioDesc != null){
		audioDesc.stop();
		audioDesc = null;
	}
}

var audioAnswer = null;
function playAudioAnswer(audio){
	if(audioAnswer==null){
		audioAnswer = createjs.Sound.play(audio);
		audioAnswer.removeAllEventListeners();
		audioAnswer.addEventListener ("complete", function(event) {
			answerAudioComplete = true;
			audioAnswer = null;
			playTickAnimation();
		});
	}
}

/*!
 * 
 * TOGGLE MUTE - This is the function that runs to toggle mute
 * 
 */
function toggleMute(con){
	createjs.Sound.setMute(con);	
}
