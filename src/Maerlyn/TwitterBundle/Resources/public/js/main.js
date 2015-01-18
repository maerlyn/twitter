/*jslint browser: true */
/*global io, $ */

$(document).ready(function () {
    $("abbr.timeago").timeago();

    $(".panel-info").on("mouseover", function () {
        var $panel = $(this);

        $.post(
            $panel.data("markasread"),
            {},
            function () {
                $panel
                    .removeClass("panel-info")
                    .addClass("panel-default")
                    .off("mouseover");
            }
        );
    });

    /*var socket = io('http://localhost:3000');
    socket.on("tweet.new", function (data) {
        console.log(data);
    });*/

    $(".container").on("click", "a.load-and-refresh-tweet", function (e) {
        var $panel = $(this).closest(".panel");
        e.preventDefault();

        $.post(
            $(this).attr("href"),
            function () {
                $.get(
                    $panel.data("show"),
                    function (data) {
                        var $newnode = $(data);
                        $panel.replaceWith($newnode);
                        $("abbr.timeago").timeago();
                    }
                );
            }
        );
    });

    var $tweet_modal = $("#tweet_modal");

    //reset new tweet form when shown
    $tweet_modal.on('show.bs.modal', function () {
        $("#tweet_status").val("");
        $("#tweet_in_reply_to_status_id").val("");
        $("#tweet_media").val("");
    });

    $tweet_modal.on("shown.bs.modal", function () {
        $("#tweet_status").focus();

        moveCaretToEnd(document.getElementById('tweet_status'));
    });

    var $tweet_submit_button = $tweet_modal.find(".btn-primary");
    $tweet_submit_button.click(function () {
        var url = $tweet_modal.data("url"),
            data = new FormData(document.getElementById("tweet_form"));

        $tweet_submit_button.attr("disabled", "disabled");

        $.ajax({
            url: url,
            data: data,
            type: "post",
            success: function () {
                $tweet_submit_button.removeAttr("disabled");
                $tweet_modal.modal("hide");
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    $(".reply-to-tweet").click(function () {
        var id = $(this).data("tweet-id"),
            username = $(this).data("username");

        $tweet_modal.modal("show");
        $("#tweet_in_reply_to_status_id").val(id);
        $("#tweet_status").val("@" + username + " ");
    });
});

function moveCaretToEnd(el) {
    if (typeof el.selectionStart === "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (el.createTextRange !== undefined) {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}
