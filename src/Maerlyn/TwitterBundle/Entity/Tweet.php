<?php

namespace Maerlyn\TwitterBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="tweet")
 */
class Tweet
{
    /**
     * @ORM\Id
     * @ORM\Column(type="bigint")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(referencedColumnName="id")
     */
    protected $user;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $coordinates;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $created_at;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $favorited = false;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $in_reply_to_screen_name;

    /**
     * @ORM\Column(type="bigint", nullable=true)
     */
    protected $in_reply_to_status_id;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    protected $place;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $retweeted = false;

    /**
     * @ORM\Column(type="string")
     */
    protected $text;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $deleted_at;

    /**
     * @ORM\Column(type="text")
     */
    protected $raw;

    /**
     * @ORM\Column(type="boolean", options={ "default"=false })
     */
    protected $read = false;
}
