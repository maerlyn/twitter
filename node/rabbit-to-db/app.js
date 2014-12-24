/**global require */

var yaml = require("yamljs"),
    amqplib = require("amqplib"),
    moment = require("moment"),
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
            rabbitmq_url: ""
        }
    },
    rabbitConnection = false,
    rabbitChannel = false;

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

var handleReceivedData;

function rabbitReconnect() {
    amqplib.connect(config.parameters.rabbitmq_url, {heartbeat: 60}).then(function (conn) {
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

            channel.consume("twitter.data", handleReceivedData, { noAck: false });
        });
    }, function (err) {
        console.error("[rabbit]\t%s", JSON.stringify(err));

        setTimeout(rabbitReconnect, 60000);
    });
}
rabbitReconnect();

function doAck(msg) {
    if (rabbitChannel) {
        rabbitChannel.ack(msg);
    }
}

function handleDeleteMessage(msg) {
    var update = { deleted_at: moment().format('YYYY-MM-DD HH:mm:ss') },
        where = { id: msg.delete.status.id_str };

    knex("tweet").update(update).where(where).exec();
    console.log("[twitter]\tdeleted status %s", where.id);
}

function handleScrubGeoMessage(msg) {
    var update = { coordinates: null, place: null },
        where = { id: msg.scrub_geo.up_to_status_id_str };

    knex("tweet").update(update).where(where).exec();
    console.log("[twitter]\tscrubbed geo from tweet %s", where.id);
}

handleReceivedData = function (msg) {
    var data = JSON.parse(msg.content.toString());

    if (undefined !== data.delete) {
        handleDeleteMessage(data);
        doAck(msg);
        return;
    }

    if (undefined !== data.scrub_geo) {
        handleScrubGeoMessage(data);
        doAck(msg);
        return;
    }

    if (undefined !== data.disconnect) {
        console.log("[twitter]\treceived disconnect message %s", msg.content.toString());
        doAck(msg);
        return;
    }

    if (undefined !== data.warning) {
        console.log("[twitter]\treceived warning message %s", msg.content.toString());
        doAck(msg);
        return;
    }

    if (undefined !== data.friends) {
        doAck(msg);
        return;
    }

    if (undefined !== data.event) {
        console.log("[twitter]\treceived event %s", msg.content.toString());
        doAck(msg);
        return;
    }

    if (undefined === data.text && undefined === data.user) {
        console.log("[twitter]\treceived unknow message %s", msg.content.toString());
        rabbitChannel.ack(msg);
        return;
    }

    var tweet = {
        id: data.id_str,
        user_id: data.user.id_str,
        coordinates: (null !== data.coordinates && "function" === data.coordinates.join) ? data.coordinates.join(",") : null,
        created_at: moment(new Date(Date.parse(data.created_at.replace(/( \+)/, ' UTC$1')))).format("YYYY-MM-DD HH:mm:ss"),
        favorited: data.favorited,
        in_reply_to_screen_name: data.in_reply_to_screen_name,
        in_reply_to_status_id: data.in_reply_to_status_id_str,
        place: null !== data.place ? data.place.name : null,
        retweeted: data.retweeted,
        text: data.text,
        raw: msg.content.toString()
    };

    var user = {
        id: data.user.id_str,
        screen_name: data.user.screen_name,
        name: data.user.name,
        description: data.user.description,
        profile_image_url: data.user.profile_image_url,
        'protected': data.user.protected,
        url: data.user.url
    };

    (function (tweet, user) {
        var saveTweet = function () {
            knex("tweet").pluck("id").where({ id: tweet.id }).then(function (ids) {
                if (!ids.length) {
                    knex.insert(tweet).into("tweet").then(function () {
                        console.log("[twitter]\tprocessed tweet %s by @%s", tweet.id, user.screen_name);
                    });
                }

                var buffer = new Buffer(JSON.stringify(tweet));
                rabbitChannel.publish("twitter", "twitter.tweet", buffer);

                doAck(msg);
            }).catch(function (err) {
                console.log("[twitter]\terror while saving tweet %s: %s", tweet.id, JSON.stringify(err));
            });
        };

        knex("user").pluck("id").where({id: user.id}).then(function (ids) {
            if (ids.length) {
                knex("user").update(user).where({id: user.id}).then(saveTweet);
            } else {
                knex.insert(user).into("user").then(saveTweet);
            }
        });
    }(tweet, user));
};
