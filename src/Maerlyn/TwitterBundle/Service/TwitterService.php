<?php

namespace Maerlyn\TwitterBundle\Service;

use Maerlyn\TwitterBundle\Entity\Tweet;
use TwitterOAuth\Api;

class TwitterService
{
    /** @var Api */
    protected $twitterApi;

    public function __construct(Api $twitterApi)
    {
        $this->twitterApi = $twitterApi;
    }

    public function toggleFavorite(Tweet $tweet)
    {
        $verb = $tweet->getFavorited() ? "destroy" : "create";
        $url = "favorites/{$verb}.json";

        return $this->twitterApi->post($url, array("id" => $tweet->getId()));
    }

    public function retweet(Tweet $tweet)
    {
        $url = "statuses/retweet/" . $tweet->getId();

        return $this->twitterApi->post($url);
    }

    public function tweet($status, $in_reply_to_status_id)
    {
        $url = "statuses/update";
        $params = ["status" => $status];

        if ($in_reply_to_status_id) {
            $params["in_reply_to_status_id"] = $in_reply_to_status_id;
        }

        return $this->twitterApi->post($url, $params);
    }
}
