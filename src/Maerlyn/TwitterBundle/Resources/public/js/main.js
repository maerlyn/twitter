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
    });

    var $tweet_submit_button = $tweet_modal.find(".btn-primary");
    $tweet_submit_button.click(function () {
        var url = $tweet_modal.data("url");

        $tweet_submit_button.attr("disabled", "disabled");

        $.post(
            url,
            {
                tweet: {
                    "status": $("#tweet_status").val(),
                    "in_reply_to_status_id": $("#tweet_in_reply_to_status_id").val(),
                    "_token": $("#tweet__token").val()
                }
            },
            function () {
                $tweet_submit_button.removeAttr("disabled");
                $tweet_modal.modal("hide");
            }
        );
    });
});
