var msgs=["You gonna hate me","\o/","WAAZZAAAAPPPP"]; //default msgs, add as many as you like.
var time=3600; //in seconds
var timer;
API.on(API.CHAT_COMMAND, command);
API.chatLog("Running auto messager, user \'/settimermsg #\' to set how often in seconds a message is posted. This will start the program, use /pausemsg to stop it and /startmsg to start it (if no time set 1 hour interval used)",true);

function command(value) {
	console.log("command called");
	var commandfunction = "";
	
	if (value.indexOf(" ") == -1) {
		var commandfunction = value.substring(value.indexOf("/")+1,value.length);
	} else {
		var commandfunction = value.substring(value.indexOf("/")+1,value.indexOf(" "));
	}
	var commandcontent =  value.substring(value.indexOf(" ")+1,value.length);
	
	console.log("commandfunction: " + commandfunction);
	console.log("commandcontent: " + commandcontent);
	
	switch(commandfunction)
	{
		case "addmsg":
			console.log("addmsg called");
			msgs.push(commandcontent);
			API.chatLog("Msg added: \'" + commandcontent + "\'", true);
		break;
		case "checkmsg":
			console.log("checkmsg called");
			API.chatLog("msg number "+ commandcontent + " is \'" + msgs[parseInt(commandcontent)-1] +"\'", true);
		break;
		case "countmsg":
			console.log("countmsg called");
			API.chatLog(msgs.length.toString() + " msgs in list", true);
		break;
		case "removemsg":
			console.log("removemsg called");
			msgs.splice(parseInt(commandcontent)-1,1);
			API.chatLog("msg " + commandcontent + " was removed", true);
		break;
		case "pausemsg":
			console.log("pausemsg called");
			stoptimer();
			API.chatLog("msgs no longer posting",true);
		break;
		case "startmsg":
			console.log("startmsg called");
			refreshtimer();
			API.chatLog("msgs now posting",true);
		break;
		case "settimermsg":
			console.log("settimermsg called");
			time = parseInt(commandcontent);
			API.chatLog("new post delay set to every " + commandcontent + " seconds. Also timer reset",true);
			refreshtimer();
		break;
	}
}

function postmsg() {
	var random = Math.floor((Math.random() * msgs.length));
	API.sendChat(msgs[random]);
}

function refreshtimer() {
	stoptimer(timer);
	timer = window.setInterval(postmsg, time*1000);
}

function stoptimer() {
	window.clearInterval(timer);
	timer = null;
}
