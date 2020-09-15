////////////////////////////////////////////////////////////
// EDIT TERMINALS
////////////////////////////////////////////////////////////
var edit = {show:true, xmlFile:'', wordNum:0, sortNum:0};

/*!
 * 
 * EDIT READY
 * 
 */
$(function() {
	 $.editor.enable = true;
});

function loadEditPage(){
	jQuery.ajax({ 
		 url: "editTools.html", dataType: "html" 
	}).done(function( responseHtml ) {
		 $("body").prepend(responseHtml);
		 buildEditButtons();
		 $('#editWrapper').show();
		 loadEditWord();
		 buttonExit.visible = false;
	});
}

function buildEditButtons(){
	$('#toggleShowOption').click(function(){
		toggleShowOption();
	});
	
	buildWordDD();
	
	$("#wordlist").change(function() {
		if($(this).val() != ''){
			edit.wordNum = $(this).val();
			loadEditWord();
		}
	});
	
	$('#addWord').click(function(){
		addWord();
	});
	
	$('#removeWord').click(function(){
		removeWord();
	});
	
	$('#prevWord').click(function(){
		toggleWord(false);
	});
	
	$('#nextWord').click(function(){
		toggleWord(true);
	});
	
	$('#sortWord').click(function(){
		toggleEditOption('sort');
	});
	
	//sort
	$('#moveWordUp').click(function(){
		swapWord(false);
	});
	
	$('#moveWordDown').click(function(){
		swapWord(true);
	});
	
	$('#doneSort').click(function(){
		toggleEditOption('');
	});
	
	$("#sortwordlist").change(function() {
		if($(this).val() != ''){
			edit.sortNum = $(this).val();
		}
	});
	
	//word
	$('#editWord').click(function(){
		toggleEditOption('word');
	});
	
	$('#generateXML').click(function(){
		generateXML();
	});
	
	$('#saveXML').click(function(){
		var n = prompt('Enter password to save.');
		if ( n!=null && n!="" ) {
			saveXML(n);
		}
	});
	
	$('#updateQuestion').click(function(){
		updateWord()
	});
	
	$('#doneWord').click(function(){
		toggleEditOption('');
	});
}

/*!
 * 
 * TOGGLE DISPLAY OPTION - This is the function that runs to toggle display option
 * 
 */
 
function toggleShowOption(){
	if(edit.show){
		edit.show = false;
		$('#editOption').hide();
		$('#toggleShowOption').val('Show Edit Option');
	}else{
		edit.show = true;
		$('#editOption').show();
		$('#toggleShowOption').val('Hide Edit Option');
	}
}

function toggleEditOption(con){
	$('#actionWrapper').hide();
	$('#wordWrapper').hide();
	$('#sortWrapper').hide();
	$('#answersWrapper').hide();
	$('#topWrapper').hide();
	
	if(con == 'sort'){
		$('#sortWrapper').show();
	}else if(con == 'word'){
		$('#wordWrapper').show();
		$('#topWrapper').show();
	}else{
		$('#actionWrapper').show();	
		$('#topWrapper').show();
	}
	
	loadEditWord();
}

/*!
 * 
 * SWAP QUESTION - This is the function that runs to swap question
 * 
 */
function swapWord(con){
	var tmpArray = word_arr[edit.sortNum];
	var tmpXML = $(edit.xmlFile).find('item').eq(edit.sortNum).clone();
	
	edit.sortNum = Number(edit.sortNum);
	if(con){
		if(edit.sortNum+1 < word_arr.length){
			word_arr[edit.sortNum] = word_arr[edit.sortNum+1];
			word_arr[edit.sortNum+1] = tmpArray;
			
			$(edit.xmlFile).find('item').eq(edit.sortNum).replaceWith($(edit.xmlFile).find('item').eq(edit.sortNum+1).clone());
			$(edit.xmlFile).find('item').eq(edit.sortNum+1).replaceWith(tmpXML);
			
			edit.sortNum++;
		}
	}else{
		if(edit.sortNum-1 >= 0){
			word_arr[edit.sortNum] = word_arr[edit.sortNum-1];
			word_arr[edit.sortNum-1] = tmpArray;
			
			$(edit.xmlFile).find('item').eq(edit.sortNum).replaceWith($(edit.xmlFile).find('item').eq(edit.sortNum-1).clone());
			$(edit.xmlFile).find('item').eq(edit.sortNum-1).replaceWith(tmpXML);
			
			edit.sortNum--;
		}
	}
	
	buildWordDD();
	scrollSelectTo(edit.sortNum);
	loadEditWord();
}

function scrollSelectTo(num){
	$('#sortwordlist').prop("selectedIndex", edit.sortNum);
	var $s = $('#sortwordlist');
	var optionTop = $s.find('[value="'+num+'"]').offset().top;
	var selectTop = $s.offset().top;
	$s.scrollTop($s.scrollTop() + (optionTop - selectTop));
}

/*!
 * 
 * BUILD WORD DROPDOWN - This is the function that runs to build word dropdown
 * 
 */
function buildWordDD(){
	$('#sortwordlist').empty();
	$('#wordlist').empty();
	
	for(n=0;n<word_arr.length;n++){
		$('#wordlist').append($("<option/>", {
			value: n,
			text: 'Word '+(n+1)+' : ('+word_arr[n].answer+')'
		}));
		
		$('#sortwordlist').append($("<option/>", {
			value: n,
			text: (n+1)+' : '+word_arr[n].answer
		}));
	}
}

/*!
 * 
 * TOGGLE WORD - This is the function that runs to toggle word
 * 
 */
function toggleWord(con){
	if(con){
		edit.wordNum++;
		edit.wordNum = edit.wordNum > word_arr.length - 1 ? 0 : edit.wordNum;
	}else{
		edit.wordNum--;
		edit.wordNum = edit.wordNum < 0 ? word_arr.length - 1 : edit.wordNum;
	}
	
	$('#wordlist').prop("selectedIndex", edit.wordNum);
	
	edit.answerNum = 0;
	loadEditWord();
}

/*!
 * 
 * ADD WORD - This is the function that runs to add new word
 * 
 */
function addWord(){
	edit.wordNum = word_arr.length;
	word_arr.push({id:edit.wordNum, answer:'temp', description:'Description', category:'category', image:'', audioDesc:'', audioAnswer:''});
	
	var newXMLItem = "	<item>\n";
	newXMLItem += "		<category>"+word_arr[edit.wordNum].category+"</category>\n";
	newXMLItem += "		<answer>"+word_arr[edit.wordNum].answer+"</answer>\n";
	newXMLItem += "		<description><![CDATA["+word_arr[edit.wordNum].description+"]]></description>\n";
	newXMLItem += "		<imageDesc>"+word_arr[edit.wordNum].image+"</imageDesc>\n";
	newXMLItem += "		<audioAnswer>"+word_arr[edit.wordNum].audioAnswer+"</audioAnswer>\n";
	newXMLItem += "		<audioDesc>"+word_arr[edit.wordNum].audioDesc+"</audioDesc>\n";
	newXMLItem += "	</item>\n";
	
	$(edit.xmlFile).find('words').append(newXMLItem);
	
	$('#category').val(word_arr[edit.wordNum].category);
	$('#wordAnswer').val(word_arr[edit.wordNum].answer);
	$('#wordDesc').val(word_arr[edit.wordNum].description);
	
	$('#wordAnswerAudio').val($(edit.xmlFile).find('item').eq(edit.wordNum).find('audioAnswer').text());
	$('#wordDescAudio').val($(edit.xmlFile).find('item').eq(edit.wordNum).find('audioDesc').text());
	$('#imageDesc').val($(edit.xmlFile).find('item').eq(edit.wordNum).find('imageDesc').text());
	
	buildWordDD();
	
	$('#wordlist').prop("selectedIndex", edit.wordNum);
	loadEditWord();
}

/*!
 * 
 * REMOVE WORD - This is the function that runs to remove word
 * 
 */
function removeWord(){
	word_arr.splice(edit.wordNum, 1);
	$(edit.xmlFile).find('item').eq(edit.wordNum).remove();
	
	edit.wordNum = 0;
	buildWordDD();
	$('#wordlist').prop("selectedIndex", edit.wordNum);
	loadEditWord();
}

/*!
 * 
 * LOAD EDIT WORD - This is the function that runs to load word
 * 
 */
function loadEditWord(con){
	wordCount = edit.wordNum;
	imageContainer.removeAllChildren();
	
	//edit word
	$('#category').val(word_arr[edit.wordNum].category);
	$('#wordAnswer').val(word_arr[edit.wordNum].answer);
	$('#wordDesc').val(word_arr[edit.wordNum].description);
	
	$('#wordAnswerAudio').val($(edit.xmlFile).find('item').eq(edit.wordNum).find('audioAnswer').text());
	$('#wordDescAudio').val($(edit.xmlFile).find('item').eq(edit.wordNum).find('audioDesc').text());
	$('#imageDesc').val($(edit.xmlFile).find('item').eq(edit.wordNum).find('imageDesc').text());
	
	stopGame();
	loadWord();
}

/*!
 * 
 * UPDATE WORD - This is the function that runs to update word value
 * 
 */
function updateWord(){
	if($('#wordAnswer').val().length < 3){
		alert('Answer must at least have 3 letters');
		return;	
	}
	
	//update array
	word_arr[edit.wordNum].category = $('#category').val();
	word_arr[edit.wordNum].answer = $('#wordAnswer').val();
	word_arr[edit.wordNum].description = $('#wordDesc').val();
	
	word_arr[edit.wordNum].image = $('#imageDesc').val();
	word_arr[edit.wordNum].audioAnswer = $('#wordAnswerAudio').val();
	word_arr[edit.wordNum].audioDesc = $('#wordDescAudio').val();
	
	//update XML
	$(edit.xmlFile).find('item').eq(edit.wordNum).find('category').text($('#category').val());
	$(edit.xmlFile).find('item').eq(edit.wordNum).find('answer').text($('#wordAnswer').val());
	
	if($(edit.xmlFile).find('item').eq(edit.wordNum).find('description').length == 0){
		$(edit.xmlFile).find('item').eq(edit.wordNum).append('	<description><![CDATA[ '+$('#wordDesc').val()+' ]]></description>\n');
	}else{
		$(edit.xmlFile).find('item').eq(edit.wordNum).find('description').text($('#wordDesc').val());	
	}
	
	if($(edit.xmlFile).find('item').eq(edit.wordNum).find('imageDesc').length == 0){
		$(edit.xmlFile).find('item').eq(edit.wordNum).append('	<imageDesc>'+$('#imageDesc').val()+'</imageDesc>\n');
	}else{
		$(edit.xmlFile).find('item').eq(edit.wordNum).find('imageDesc').text($('#imageDesc').val());	
	}
	
	if($(edit.xmlFile).find('item').eq(edit.wordNum).find('audioAnswer').length == 0){
		$(edit.xmlFile).find('item').eq(edit.wordNum).append('	<audioAnswer>'+$('#wordAnswerAudio').val()+'</audioAnswer>\n');
	}else{
		$(edit.xmlFile).find('item').eq(edit.wordNum).find('audioAnswer').text($('#wordAnswerAudio').val());	
	}
	
	if($(edit.xmlFile).find('item').eq(edit.wordNum).find('audioDesc').length == 0){
		$(edit.xmlFile).find('item').eq(edit.wordNum).append('	<audioDesc>'+$('#wordDescAudio').val()+'</audioDesc>\n');
	}else{
		$(edit.xmlFile).find('item').eq(edit.wordNum).find('audioDesc').text($('#wordDescAudio').val());	
	}
	
	loadEditWord();
}


/*!
 * 
 * GENERATE XML - This is the function that runs to generate xml
 * 
 */
function generateXML(){
	var xmlstr = edit.xmlFile.xml ? edit.xmlFile.xml : (new XMLSerializer()).serializeToString(edit.xmlFile);
	$('#outputXML').val(xmlstr);
}

function saveXML(pass){
	var xmlstr = edit.xmlFile.xml ? edit.xmlFile.xml : (new XMLSerializer()).serializeToString(edit.xmlFile);
	
	$.ajax({
		type: "POST",
		url: "save.php",
		data: {password:pass,
				data:xmlstr}
				
	}).done(function(o) {
		try {
			$.parseJSON(o);
		} catch (e) {
			alert('Error, file cannot save!');
		}
		
		var data = $.parseJSON(o);
		if (!data || data === null) {
			alert('Error, file cannot save!');
		}else{
			if(data.status==true){
				alert('File save successful!');
			}else{
				if(data.option==true){
					alert('Wrong password, file cannot save!');
				}else{
					alert('Save option disabled!');
				}
			}
		}
	});	
}