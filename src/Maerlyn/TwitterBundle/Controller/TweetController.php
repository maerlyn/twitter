<?php

namespace Maerlyn\TwitterBundle\Controller;

use Maerlyn\TwitterBundle\Entity\Tweet;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class TweetController extends Controller
{
    public function showAction(Tweet $tweet)
    {
        return $this->render("MaerlynTwitterBundle::_tweet.html.twig", array("tweet" => $tweet));
    }

    public function markAsReadAction(Tweet $tweet)
    {
        $this->mustBeAjax();

        $tweet->setRead(true);
        $this->getDoctrine()->getManager()->flush();

        return new Response("", Response::HTTP_NO_CONTENT);
    }

    public function toggleFavoriteAction(Tweet $tweet)
    {
        $this->mustBeAjax();

        $twitterApi = $this->get("twitter.api");
        $resp = $twitterApi->toggleFavorite($tweet);

        $this->get("logger")->addDebug("TWITTER RESPONSE " . json_encode($resp));

        $tweet->setFavorited(!$tweet->getFavorited());
        $this->getDoctrine()->getManager()->flush();

        return new Response("", Response::HTTP_NO_CONTENT);
    }

    public function retweetAction(Tweet $tweet)
    {
        $this->mustBeAjax();

        $twitterApi = $this->get("twitter.api");
        $resp = $twitterApi->retweet($tweet);

        $this->get("logger")->addDebug("TWITTER RESPONSE " . json_encode($resp));

        $tweet->setRetweeted(true);
        $this->getDoctrine()->getManager()->flush();

        return new Response("", Response::HTTP_NO_CONTENT);
    }

    private function mustBeAjax()
    {
        $request = $this->get("request_stack")->getCurrentRequest();

        if (!$request->isXmlHttpRequest()) {
            throw new BadRequestHttpException("Must be ajax");
        }
    }
}
