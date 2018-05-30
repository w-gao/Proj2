"use strict";

$(function() {

    // Hide canvas after the page is loaded

    $("#renderCanvas").hide();
    $("#chat_form").hide();

    $("#input_username").focus();

});


function hideLoginForm() {
    $("#login").hide();
}

function setUserLabel(username) {
    const userLabel = document.getElementById("user_label");
    userLabel.innerHTML = "Logged in as: " + username;
}

function isChatBoxOpen() {
    return $("#chat_form").css('display') !== 'none';
}

function toggleChatBox() {
    const chatBox = $("#chat_form");
    if (!isChatBoxOpen()) {
        chatBox.show();
        $("#input_chat").focus();
    } else {
        chatBox.hide();
    }
}


/**
 * Display a message to the client
 */
function displayMessage(from, msg) {

    $("#chat_wrapper").append('<div class="chat_msg"><span class="sender">' + from + ' </span><span class="msg">' + msg + '</span></div>');

    const curMsg = $(".chat_msg:last");

    // Remove after 5 seconds
    setTimeout(function () {
        curMsg.remove()
    }, 5000);
}

