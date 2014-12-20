<?php

namespace Maerlyn\TwitterBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 */
class User
{
    /**
     * @ORM\Id
     * @ORM\Column(type="bigint")
     */
    protected $id;

    /**
     * @ORM\Column(type="string")
     */
    protected $screen_name;

    /**
     * @ORM\Column(type="string")
     */
    protected $name;

    /**
     * @ORM\Column(type="string")
     */
    protected $description;

    /**
     * @ORM\Column(type="string")
     */
    protected $profile_image_url;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $protected;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $url;
}
