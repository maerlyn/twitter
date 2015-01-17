<?php

namespace Maerlyn\TwitterBundle\Twig;

use Maerlyn\TwitterBundle\Form\TweetType;
use Symfony\Component\Form\FormFactoryInterface;

class TwitterTwigExtension extends \Twig_Extension
{
    /** @var FormFactoryInterface */
    protected $formFactory;

    public function __construct(FormFactoryInterface $formFactory)
    {
        $this->formFactory = $formFactory;
    }

    public function getGlobals()
    {
        $form = $this->formFactory->create(new TweetType());

        return [
            "tweet_form" => $form->createView(),
        ];
    }

    public function getName()
    {
        return "maerlyn_twitter";
    }

}
