 
/** GNU GPLv3 Licensing :
Christian BUISSON French Developer contact by electronic mail: hybris_95@hotmail.com
Modify by Desko on Oct 2014.
Copyright © 2014 Christian BUISSON

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software Foundation,
    Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
*/

/** USAGE :
Firefox:
Add the following line as a bookmark :
javascript:(function(){$.getScript('https://raw.githubusercontent.com/Desko21/PLUG-/master/PLUG+.js');}());
Chrome:
Add the following line as a bookmark :
javascript:(function(){$.getScript('https://rawgit.com/Desko21/PLUG-/master/PLUG+.js');}());
 ** Usage Method :
 ** copy/paste the entire script into the Firefox/Chrome Console (Ctrl+Shift+C Shortcut)
 ** For Firefox users (if you want notice sound) :
 ** about:config -> security.mixed_content.block_active_content = false
*/

/**
 * Global Vars
 */
var debug = false;
refreshAPIStatus();
var ownUserName = API.getUser().username;
var lastTimeStamp;
var loadedSound;
if(!loadedSound){
    loadedSound = new Audio(decodeURIComponent("http://desko.host22.com/PlugDj/notification.mp3"));
}

var changedAutoW;
var autoW;
var changedAutoNotice;
var autoNotice;
var changedAutoJoinLeaveNotice;
var autoJoinLeaveNotice;
var changedAutoM;
var autoM;

/**
 * STATS
 */
var getMeanDuration;// TODO - Include this in the Advance event and implement our own history
if(!getMeanDuration){
    getMeanDuration = function(){
		var meanDuration = 0;
		var history = API.getHistory();
		for(var i = 0; i < history.length; i++){
			meanDuration = meanDuration + history[i].media.duration;
		}
		meanDuration = meanDuration / history.length;
		return meanDuration;
    };
}

var getEta;
if(!getEta){
    getEta = function(){
        var currentPosition = API.getWaitListPosition();
        if(currentPosition == -1){
            currentPosition = API.getWaitList().length;
        }
        var currentSongTimeLeft = API.getTimeRemaining();
        var meanDuration = getMeanDuration();
        
        var etaInSec = Math.floor((currentPosition * meanDuration) + currentSongTimeLeft);
        var nbOfHours = Math.floor((etaInSec / 60) / 60);
        var nbOfMinutes = Math.floor((etaInSec - (nbOfHours * 60 * 60)) / 60);
        var nbOfSec = etaInSec - (nbOfHours * 60 * 60) - (nbOfMinutes * 60);
        if(nbOfMinutes < 10){
            nbOfMinutes = "0" + nbOfMinutes;
        }
        if(nbOfSec < 10){
            nbOfSec = "0" + nbOfSec;
        }
        API.chatLog("Estimated Time Awaiting : " + nbOfHours + ":" + nbOfMinutes + ":" + nbOfSec, true);
    };
}

/**
 * ADVANCE EVENT :
 * AutoWoot Only -> http://pastebin.com/qNV6T6pq
 */
var autowoot;
if(!autowoot){
    autowoot = function() {
        if(autoW){
            $("#woot").click();
        }
    };
}

/**
 * ADVANCE EVENT :
 * AutoWoot Only -> http://pastebin.com/qNV6T6pq
 */
var automeh;
if(!automeh){
    automeh = function() {
        if(autoM){
            $("#meh").click();
        }
    };
}

/**
 * JOIN EVENT :
 * AutoJoinNotice
 */
var someoneJoined;
if(!someoneJoined){
    someoneJoined = function(user){
        API.chatLog(user.username + " joined the room :+1:", true);
    };
}
/**
 * LEAVE EVENT :
 * AutoLeaveNotice
 */
var someoneLeft;
if(!someoneLeft){
    someoneLeft = function(user){
        API.chatLog(user.username + " left the room", true);
    };
}
/**
 * CHAT EVENT :
 * AutoNotice Only -> http://pastebin.com/Hsi2YMDH
 */
var analyseChat;
if(!analyseChat){
    analyseChat = function(chat){
        var message = chat.message;
        var username = chat.un;
        var type = chat.type;
        var uid = chat.uid;
        var cid = chat.cid;
        var timestamp = chat.timestamp;
        
        // Recover the latest timestamp for the user
        if(username == ownUserName){
            lastTimeStamp = timestamp;
        }
        
        // Watch PMs
        if(message.match("@" + ownUserName))
        {
            if(debug){console.log(username + " told me : " + message);}
            // AutoNotice
            if(autoNotice){
                loadedSound.play();
            }
        }
    };
}


/**
 * Event Management
 */
function refreshAPIStatus()
{
    API.off(API.ADVANCE, autowoot);
    if(autoW){
        API.on(API.ADVANCE, autowoot);
    }
	
	API.off(API.ADVANCE, automeh);
    if(autoM){
        API.on(API.ADVANCE, automeh);
    }
	
    API.off(API.CHAT, analyseChat);
    if(autoNotice){
        API.on(API.CHAT, analyseChat);
    }
    
	API.off(API.USER_JOIN, someoneJoined);
    if(autoJoinLeaveNotice){
        API.on(API.USER_JOIN, someoneJoined);
    }
	
    API.off(API.USER_LEAVE, someoneLeft);
    if(autoJoinLeaveNotice){
        API.on(API.USER_LEAVE, someoneLeft);
    }
}
function startAutoWoot(){
    autoW = true;
    $("#hybrisAutoWoot").css("background-color", "#105D2F");
    autowoot();
    refreshAPIStatus();
}
function stopAutoWoot(){
    autoW = false;
    $("#hybrisAutoWoot").css("background-color", "#0A0A0A");
    refreshAPIStatus();
}

function startAutoMeh(){
    autoM = true;
    $("#hybrisAutoWoot").css("background-color", "#105D2F");
    automeh();
    refreshAPIStatus();
}
function stopAutoMeh(){
    autoM = false;
    $("#hybrisAutoWoot").css("background-color", "#0A0A0A");
    refreshAPIStatus();
}
function switchAutoWoot(){
    changedAutoW = true;
    if(autoW){
        stopAutoWoot();
    }else{
        startAutoWoot();
    }
}

function switchAutoMeh(){
    changedAutoM = true;
    if(autoM){
        stopAutoMeh();
    }else{
        startAutoMeh();
    }
}
function startAutoNotice(){
    autoNotice = true;
	$("#hybrisMention").css("background-color", "#105D2F");
    refreshAPIStatus();
}
function stopAutoNotice(){
    autoNotice = false;
	$("#hybrisMention").css("background-color", "#0A0A0A");
    refreshAPIStatus();
}
function switchAutoNotice(){
    changedAutoNotice = true;
	if(autoNotice){
		stopAutoNotice();
	}else{
		startAutoNotice();
	}
}
function startAutoNoticeJoinersLeavers(){
    autoJoinLeaveNotice = true;
    $("#hybrisJoiners").css("background-color", "#105D2F");
    refreshAPIStatus();
}
function stopAutoNoticeJoinersLeavers(){
    autoJoinLeaveNotice = false;
    $("#hybrisJoiners").css("background-color", "#0A0A0A");
    refreshAPIStatus();
}
function switchAutoNoticeJoinersLeavers(){
    changedAutoJoinLeaveNotice = true;
    if(autoJoinLeaveNotice){
        stopAutoNoticeJoinersLeavers();
    }else{
        startAutoNoticeJoinersLeavers();
    }
}
/**
 * UI Management
 */
function getAppWidth(){
    return $("#app").width();
}
function getAppHeight(){
    return $("#app").height();
}
function getChatWidth(){
    return $("#chat").width();
}
function getChatHeight(){
    return $("#chat").height();
}
function getChatHeaderHeight(){
    return $("#chat-header").height();
}
function getChatInputHeight(){
	return $("#chat-input").height();
}
function getFooterHeight(){
    return $("#footer").height();
}
function getIconWidth(){
    return $(".icon").width();
}
function getIconHeight(){
    return $(".icon").height();
}
function getButtonWidth(){
    var marginRight = $(".chat-header-button").css("margin-right");
    marginRight = marginRight.substring(0, marginRight.length - 2);
    marginRight = parseInt(marginRight);
    return getIconWidth() + marginRight;
}
var hybrisHeaderHeight = 46;
var hybrisHeaderLeftPos = 10;
var nbOfBorders = 2;
var sizeAboveChatInput = 10;
function hideToolTip(){
	$("#tooltip").remove();
}
function getTooltipLeftPos(buttonNumber){
    var nbButtons = buttonNumber * getButtonWidth();
    return getAppWidth() - getChatWidth() + hybrisHeaderLeftPos + nbButtons + (getIconWidth() / 2);
}
function getTooltipTopPos(){
    return getChatHeight() - (getIconHeight() / 2) - sizeAboveChatInput;
}
function showAutoWootToolTip(){
    hideToolTip();
    var tooltipLeftPos = getTooltipLeftPos(0);
    var tooltipTopPos = getTooltipTopPos();
    $("body").append("<div id=\"tooltip\"><span>AutoWoot</span><div class=\"corner\"></div></div>");
    $("#tooltip").css("left", tooltipLeftPos + "px");
    $("#tooltip").css("top", tooltipTopPos + "px");
}

function showAutoMehToolTip(){
    hideToolTip();
    var tooltipLeftPos = getTooltipLeftPos(0);
    var tooltipTopPos = getTooltipTopPos();
    $("body").append("<div id=\"tooltip\"><span>AutoMeh this shit!</span><div class=\"corner\"></div></div>");
    $("#tooltip").css("left", tooltipLeftPos + "px");
    $("#tooltip").css("top", tooltipTopPos + "px");
}
function showAutoNoticeToolTip(){
    hideToolTip();
    var tooltipLeftPos = getTooltipLeftPos(1);
    var tooltipTopPos = getTooltipTopPos();
    $("body").append("<div id=\"tooltip\"><span>Mention sound notification</span><div class=\"corner\"></div></div>");
    $("#tooltip").css("left", tooltipLeftPos + "px");
    $("#tooltip").css("top", tooltipTopPos + "px");
}
function showAutoJoinersLeaversToolTip(){
    hideToolTip();
    var tooltipLeftPos = getTooltipLeftPos(2);
    var tooltipTopPos = getTooltipTopPos();
    $("body").append("<div id=\"tooltip\"><span>Joiners/Leavers notification</span><div class=\"corner\"></div></div>");
    $("#tooltip").css("left", tooltipLeftPos + "px");
    $("#tooltip").css("top", tooltipTopPos + "px");
}
function showEtaToolTip(){
    hideToolTip();
    var tooltipLeftPos = getTooltipLeftPos(3);
    var tooltipTopPos = getTooltipTopPos();
    $("body").append("<div id=\"tooltip\"><span>Give ETA</span><div class=\"corner\"></div></div>");
    $("#tooltip").css("left", tooltipLeftPos + "px");
    $("#tooltip").css("top", tooltipTopPos + "px");
}
function setupAutoWootBtn(){
    if($("#hybrisAutoWoot").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisAutoWoot\" class=\"chat-header-button\"><i class=\"icon icon-hybris-autowoot\"></i></div>");
    }
    $(".icon-hybris-autowoot").css("background-position", "-105px -280px");
    $("#hybrisAutoWoot").unbind('click.hybris');
    $("#hybrisAutoWoot").bind('click.hybris', switchAutoWoot);
	$("#hybrisAutoWoot").unbind('mouseenter.hybris');
	$("#hybrisAutoWoot").bind('mouseenter.hybris', showAutoWootToolTip);
	$("#hybrisAutoWoot").unbind('mouseleave.hybris');
	$("#hybrisAutoWoot").bind('mouseleave.hybris', hideToolTip);
}

function setupAutoMehBtn(){
    if($("#hybrisAutoWoot").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisAutoWoot\" class=\"chat-header-button\"><i class=\"icon icon-hybris-autowoot\"></i></div>");
    }
    $(".icon-hybris-autowoot").css("background-position", "-305px -280px");
    $("#hybrisAutoWoot").unbind('click.hybris');
    $("#hybrisAutoWoot").bind('click.hybris', switchAutoMeh);
	$("#hybrisAutoWoot").unbind('mouseenter.hybris');
	$("#hybrisAutoWoot").bind('mouseenter.hybris', showAutoMehToolTip);
	$("#hybrisAutoWoot").unbind('mouseleave.hybris');
	$("#hybrisAutoWoot").bind('mouseleave.hybris', hideToolTip);
}
function setupAutoNoticeBtn(){
    if($("#hybrisMention").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisMention\" class=\"chat-header-button\"><i class=\"icon icon-hybris-mention\"></i></div>");
    }
    $(".icon-hybris-mention").css("background-position", "-140px 0px");
    $("#hybrisMention").unbind('click.hybris');
    $("#hybrisMention").bind('click.hybris', switchAutoNotice);
	$("#hybrisMention").unbind('mouseenter.hybris');
	$("#hybrisMention").bind('mouseenter.hybris', showAutoNoticeToolTip);
	$("#hybrisMention").unbind('mouseleave.hybris');
	$("#hybrisMention").bind('mouseleave.hybris', hideToolTip);
}
function setupAutoJoinersLeaversBtn(){
    if($("#hybrisJoiners").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisJoiners\" class=\"chat-header-button\"><i class=\"icon icon-hybris-joiners\"></i></div>");
    }
    $(".icon-hybris-joiners").css("background-position", "-245px 0px");
    $("#hybrisJoiners").unbind('click.hybris');
    $("#hybrisJoiners").bind('click.hybris', switchAutoNoticeJoinersLeavers);
	$("#hybrisJoiners").unbind('mouseenter.hybris');
	$("#hybrisJoiners").bind('mouseenter.hybris', showAutoJoinersLeaversToolTip);
	$("#hybrisJoiners").unbind('mouseleave.hybris');
	$("#hybrisJoiners").bind('mouseleave.hybris', hideToolTip);
}
function setupEtaBtn(){
    if($("#hybrisEta").length == 0){
        $("#hybrisHeader").append("<div id=\"hybrisEta\" class=\"chat-header-button\"><i class=\"icon icon-history-white\"></i></div>");
    }
    $("#hybrisEta").unbind('click.hybris');
    $("#hybrisEta").bind('click.hybris', getEta);
    $("#hybrisEta").unbind('mouseenter.hybris');
    $("#hybrisEta").bind('mouseenter.hybris', showEtaToolTip);
    $("#hybrisEta").unbind('mouseleave.hybris');
    $("#hybrisEta").bind('mouseleave.hybris', hideToolTip);
}
var alreadyMovedSuggestion;
function setupHybrisToolBar(){
	var chatHeight = getChatHeight();
	var chatHeaderHeight = getChatHeaderHeight();
	var chatInputHeight = getChatInputHeight();
	
	var newChatMessagesHeight = chatHeight - chatHeaderHeight - chatInputHeight - hybrisHeaderHeight - nbOfBorders - sizeAboveChatInput;
	
	if(!alreadyMovedSuggestion){
		var suggestionBottom = $("#chat-suggestion").css("bottom");
		suggestionBottom = suggestionBottom.substring(0, suggestionBottom.length - 2);
		suggestionBottom = parseInt(suggestionBottom);
		$("#chat-suggestion").css("bottom", suggestionBottom + hybrisHeaderHeight);
		alreadyMovedSuggestion = true;
	}

    var currentMessagesHeight = $("#chat-messages").height();
    if(currentMessagesHeight != newChatMessagesHeight){
        $("#chat-messages").fadeOut("fast").promise().done(function(){
            $("#chat-messages").css("height", newChatMessagesHeight + "px");
            $("#chat-messages").fadeIn("slow");
        });
        $("#chat-input").fadeOut("fast").promise().done(function(){
            $("#chat-input").css("bottom", hybrisHeaderHeight + "px");
            $("#chat-input").fadeIn("slow");
        });
    }
    if($("#hybrisHeader").length == 0){
        $("#chat").append("<div id=\"hybrisHeader\"><div class=\"divider\" /></div>");
    }
    $("#hybrisHeader").hide();
    $("#hybrisHeader").css("position", "absolute");
    $("#hybrisHeader").css("height", hybrisHeaderHeight + "px");
    $("#hybrisHeader").css("bottom", "0px");
    $("#hybrisHeader").css("left", hybrisHeaderLeftPos + "px");
    $("#hybrisHeader").css("width", "100%");
	setupAutoWootBtn();
	setupAutoMehBtn();
	setupAutoNoticeBtn();
	setupAutoJoinersLeaversBtn();
	setupEtaBtn();
    $("#hybrisHeader").slideDown();
}
/**
 * Main function (executed at loading)
 */
function main(){
    setupHybrisToolBar();
    
    if(changedAutoW){
        if(autoW){
            startAutoWoot();
        }else{
            stopAutoWoot();
        }
    }else{
        stopAutoWoot();
    }
	
	if(changedAutoM){
        if(autoM){
            startAutoMeh();
        }else{
            stopAutoMeh();
        }
    }else{
        stopAutoMeh();
    }
    
    if(changedAutoNotice){
        if(autoNotice){
            startAutoNotice();
        }else{
            stopAutoNotice();
        }
    }else{
        startAutoNotice();
    }
    
    if(changedAutoJoinLeaveNotice){
        if(autoJoinLeaveNotice){
            startAutoNoticeJoinersLeavers();
        }else{
            stopAutoNoticeJoinersLeavers();
        }
    }else{
        stopAutoNoticeJoinersLeavers();
    }
}
$(document).ready(main);
Status API Training Shop Blog About
© 2014 GitHub, Inc. Terms Privacy Security Contact
