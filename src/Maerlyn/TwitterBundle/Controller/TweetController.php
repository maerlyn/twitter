<?php

namespace Maerlyn\TwitterBundle\Controller;

use Maerlyn\TwitterBundle\Entity\Tweet;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class TweetController extends Controller
{
    public function markAsReadAction(Tweet $tweet, Request $request)
    {
        if (!$request->isXmlHttpRequest()) {
            return new BadRequestHttpException("Must be ajax");
        }

        $tweet->setRead(true);
        $this->getDoctrine()->getManager()->flush();

        return new Response("", Response::HTTP_NO_CONTENT);
    }
}
