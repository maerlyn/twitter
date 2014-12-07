var yaml = require("yamljs"),
    amqplib = require("amqplib"),
    Twitter = require("twitter"),
    twitter,
    knex;

//config kulcsok hogy ne panaszkodjon a phpstorm es legyen kodkiegeszites
//noinspection JSUnusedAssignment
var config = {
        parameters: {
            database_host: "",
            database_port: "",
            database_name: "",
            database_user: "",
            database_password: "",
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

knex = require("knex")({
    client: 'mysql',
    connection: {
        host: config.parameters.database_host,
        user: config.parameters.database_user,
        password: config.parameters.database_password,
        database: config.parameters.database_name
    }
});

console.log("[rabbit]\tconnecting");
function rabbitReconnect() {
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
}
rabbitReconnect();

function sendDataToRabbit(tweet) {
    if (rabbitChannel) {
        var buffer = new Buffer(JSON.stringify(tweet));
        rabbitChannel.publish("twitter", "twitter.data", buffer, { persistent: true });
    } else {
        missedData.push(tweet);
    }
}

twitter = new Twitter({
    consumer_key: config.parameters.twitter_app_consumer_key,
    consumer_secret: config.parameters.twitter_app_consumer_secret,
    access_token_key: config.parameters.twitter_user_access_token,
    access_token_secret: config.parameters.twitter_user_access_token_secret
});

twitter.verifyCredentials(function (data) {
    console.log("[twitter]\tcredentials verified " + JSON.stringify(data));
});

twitter.stream("user", {}, function (stream) {
    var firstTweetReceived = false;

    console.log("[twitter]\tstreaming");

    stream.on("data", function (data) {
        var isTweet = (undefined !== data.text && undefined !== data.user);

        if (undefined !== data.id) {
            //noinspection JSUnresolvedVariable
            console.log("[twitter]\treceived tweet %s from @%s", data.id_str, data.user.screen_name);
        }

        sendDataToRabbit(data);

        if (!firstTweetReceived && isTweet) {
            firstTweetReceived = true;

            knex("tweet").max("id as latestTweetId").then(function (result) {
                var latestTweetId = result[0].latestTweetId;

                if (latestTweetId) {
                    console.log("[twitter]\tfetching tweets between %s AND %s", latestTweetId, data.id_str);

                    twitter.getHomeTimeline({
                        count: 200,
                        since_id: latestTweetId,
                        max_id: data.id_str
                    }, function (tweets) {
                        var tweet;

                        while (tweets.length) {
                            tweet = tweets.shift();
                            sendDataToRabbit(tweet);
                        }
                    });
                }
            });
        }
    });

    stream.on("error", function (err) {
        console.error("[twitter]\terror: %s", JSON.stringify(err));
    });
});
