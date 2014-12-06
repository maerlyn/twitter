<?php

namespace Maerlyn\TwitterBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('MaerlynTwitterBundle:Default:index.html.twig', array('name' => $name));
    }
}
