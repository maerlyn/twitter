<?php

namespace Maerlyn\TwitterBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints as Assert;

class TweetType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add("status", "textarea", [
            "constraints"   =>  new Assert\NotBlank(),
        ]);

        $builder->add("in_reply_to_status_id", "hidden");
    }

    public function getName()
    {
        return "tweet";
    }
}
