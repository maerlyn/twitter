/*global require */

var yaml = require("yamljs"),
    amqplib = require("amqplib"),
    socketio = require("socket.io");

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

            channel.assertQueue("twitter.tweet", { exclusive: true }).then(function () {
                channel.bindQueue("twitter.tweet", "twitter", "twitter.tweet").then(function () {
                    channel.consume("twitter.tweet", handleReceivedData, { noAck: false });
                });
            });
        });
    }, function (err) {
        console.error("[rabbit]\t%s", JSON.stringify(err));

        setTimeout(rabbitReconnect, 60000);
    });
}
rabbitReconnect();

var io = socketio.listen(3000);
console.log("[socket]\tlistening on 3000");

io.on("connection", function (socket) {
    console.log("[socket]\tclient connected");
});

handleReceivedData = function (msg) {
    var data = JSON.parse(msg.content.toString()),
        tweet_id = data.id;

    io.sockets.emit("tweet.new", { "tweet_id": tweet_id });
    console.log("[socket]\temitted '%s'", tweet_id);

    rabbitChannel.ack(msg);
};
