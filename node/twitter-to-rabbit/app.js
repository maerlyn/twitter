var yaml = require("yamljs"),
    amqplib = require("amqplib"),
    Twitter = require("twitter"),
    twitter;

//config kulcsok hogy ne panaszkodjon a phpstorm es legyen kodkiegeszites
//noinspection JSUnusedAssignment
var config = {
        parameters: {
            rabbitmq_url: "",
            twitter_app_consumer_key: "",
            twitter_app_consumer_secret: "",
            twitter_user_access_token: "",
            twitter_user_access_token_secret: ""
        }
    },
    rabbitConnection = false,
    rabbitChannel = false,
    missedData = [];

config = yaml.load("../../app/config/parameters.yml");

console.log("[rabbit]\tconnecting");
var rabbitReconnect = function () {
    amqplib.connect(config.rabbitmq_url, {heartbeat: 60}).then(function (conn) {
        rabbitConnection = conn;

        conn.on("error", function (err) {
            console.log("[rabbit]\tconnection error, reconnecting (%s)", JSON.stringify(err));
            rabbitConnection = false;
            rabbitChannel = false;
            rabbitReconnect();
        });

        conn.createChannel().then(function (channel) {
            console.log("[rabbit]\tconnected");
            rabbitChannel = channel;

            channel.on("error", function (err) {
                console.log("[rabbit]\tchannel error, reconnecting (%s)", JSON.stringify(err));
                rabbitConnection = false;
                rabbitChannel = false;
                rabbitReconnect();
            });

            var data, buffer;
            while (missedData.length) {
                data = missedData.shift();
                buffer = new Buffer(JSON.stringify(data));
                rabbitChannel.publish("twitter", "twitter.data", buffer, { persistent: true });

            }
        });
    }, function (err) {
        console.error("[twitter]\t%s", JSON.stringify(err));

        setTimeout(rabbitReconnect, 60000);
    });
};
rabbitReconnect();

twitter = new Twitter({
    consumer_key: config.parameters.twitter_app_consumer_key,
    consumer_secret: config.parameters.twitter_app_consumer_secret,
    access_token_key: config.parameters.twitter_user_access_token,
    access_token_secret: config.parameters.twitter_user_access_token_secret
});

twitter.verifyCredentials(function (data) {
    console.log("[twitter]\t" + JSON.stringify(data));
});

twitter.stream("user", {}, function (stream) {
    console.log("[twitter]\tstreaming");

    stream.on("data", function (data) {
        if (undefined !== data.id) {
            //noinspection JSUnresolvedVariable
            console.log("[twitter]\treceived tweet %d from @%s", data.id, data.user.screen_name);
        }

        if (rabbitChannel) {
            var buffer = new Buffer(JSON.stringify(data));
            rabbitChannel.publish("twitter", "twitter.data", buffer, { persistent: true });
        } else {
            missedData.push(data);
        }
    });

    stream.on("error", function (err) {
        console.error("[twitter]\terror: %s", JSON.stringify(err));
    });
});
