"use strict";

$(function() {

    $("#input_username").focus();

});

const UI = {

    hideLoginForm: function () {
        $("#login").hide();
    },
    setUserName: function (username) {
        const userLabel = document.getElementById("user_label");
        userLabel.innerHTML = "Logged in as: " + username;
    },
    setFPS: function (fps) {
        const fpsLabel = document.getElementById("fps_label");
        fpsLabel.innerHTML = fps + " fps";
    },
    isChatBoxOpen: function () {
        return $("#chat_form").css('display') !== 'none';
    },
    toggleChatBox: function () {
        const chatBox = $("#chat_form");
        if (!this.isChatBoxOpen()) {
            chatBox.show();
            $("#chat_input").focus();
        } else {
            chatBox.hide();
        }
    },

    /**
     * Display a message to the client
     */
    displayMessage: function (from, msg) {

        $("#chats").append('<div class="chat_wrapper"><span class="chat_sender">' + from + ' </span><span class="chat_msg">' + msg + '</span></div>');

        const curMsg = $(".chat_wrapper:last");

        // Remove after 5 seconds
        setTimeout(function () {
            curMsg.remove()
        }, 5000);
    },


    openModal: function (title, content, trueButton, falseButton) {

        const modalElement = $("#modal");
        const trueBtnElement = $("#modal_trueBtn");
        const falseBtnElement = $("#modal_falseBtn");

        modalElement.css('display', "block");
        $(".modal_title").text(title);
        $(".modal_content").text(content);

        if (trueButton) {
            trueBtnElement.show();
            trueBtnElement.text(trueButton.label ? trueButton.label : "OK");
            trueBtnElement.click(trueButton.callback ? trueButton.callback : function () {
            });
        } else {
            trueBtnElement.hide();
        }

        if (falseButton) {
            falseBtnElement.show();
            falseBtnElement.text(falseButton.label ? falseButton.label : "Cancel");
            falseBtnElement.click(falseButton.callback ? falseButton.callback : function () {
            });
        } else {
            falseBtnElement.hide();
        }
    },

    closeModal: function () {
        const modalElement = $("#modal");
        modalElement.css('display', "none");

        $(".modal_title").text("");
        $(".modal_content").text("");
        $("#modal_trueBtn").text("");
        $("#modal_falseBtn").text("");
    }

};
