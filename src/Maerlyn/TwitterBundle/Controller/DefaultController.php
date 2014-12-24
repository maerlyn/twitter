<?php

namespace Maerlyn\TwitterBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        $tweets = $this->getDoctrine()->getRepository("MaerlynTwitterBundle:Tweet")->findLatest(50);

        return $this->render('MaerlynTwitterBundle:Default:index.html.twig', array("tweets" => $tweets));
    }
}
