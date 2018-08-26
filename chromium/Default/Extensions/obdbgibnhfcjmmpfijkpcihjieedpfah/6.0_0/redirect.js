var saved = localStorage["saved_url"];

if (saved == undefined || saved == null || saved == '') 
{
	document.location = "http://typingclub.com/typing-qwerty-en.html";
}else{	
	document.location = "http://" + saved + ".typingclub.com";
}

