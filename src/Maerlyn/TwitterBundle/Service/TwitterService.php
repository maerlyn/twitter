<?php

namespace Maerlyn\TwitterBundle\Service;

use Maerlyn\TwitterBundle\Entity\Tweet;
use Symfony\Component\HttpFoundation\File\UploadedFile;
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

    public function tweet($status, $in_reply_to_status_id, $media)
    {
        $url = "statuses/update";
        $params = ["status" => $status];

        if ($in_reply_to_status_id) {
            $params["in_reply_to_status_id"] = $in_reply_to_status_id;
        }

        if ($media instanceof UploadedFile) {
            $media_data = $this->uploadMedia($media->getRealPath());
            $params["media_ids"] = $media_data->media_id_string;
        }

        return $this->twitterApi->post($url, $params);
    }

    public function uploadMedia($filename)
    {
        $filename = "/home/maerlyn/Pictures/wallpaper.androlib.com.jpg";
        $url = "https://upload.twitter.com/1.1/media/upload.json";

        $params = [
            "media" =>  base64_encode(file_get_contents($filename)),
        ];

        return $this->twitterApi->post($url, $params);
    }
}
