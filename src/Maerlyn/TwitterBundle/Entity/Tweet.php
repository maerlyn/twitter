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

    /**
     * Set id
     *
     * @param integer $id
     * @return Tweet
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set coordinates
     *
     * @param string $coordinates
     * @return Tweet
     */
    public function setCoordinates($coordinates)
    {
        $this->coordinates = $coordinates;

        return $this;
    }

    /**
     * Get coordinates
     *
     * @return string
     */
    public function getCoordinates()
    {
        return $this->coordinates;
    }

    /**
     * Set created_at
     *
     * @param \DateTime $createdAt
     * @return Tweet
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;

        return $this;
    }

    /**
     * Get created_at
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Set favorited
     *
     * @param boolean $favorited
     * @return Tweet
     */
    public function setFavorited($favorited)
    {
        $this->favorited = $favorited;

        return $this;
    }

    /**
     * Get favorited
     *
     * @return boolean
     */
    public function getFavorited()
    {
        return $this->favorited;
    }

    /**
     * Set in_reply_to_screen_name
     *
     * @param string $inReplyToScreenName
     * @return Tweet
     */
    public function setInReplyToScreenName($inReplyToScreenName)
    {
        $this->in_reply_to_screen_name = $inReplyToScreenName;

        return $this;
    }

    /**
     * Get in_reply_to_screen_name
     *
     * @return string
     */
    public function getInReplyToScreenName()
    {
        return $this->in_reply_to_screen_name;
    }

    /**
     * Set in_reply_to_status_id
     *
     * @param integer $inReplyToStatusId
     * @return Tweet
     */
    public function setInReplyToStatusId($inReplyToStatusId)
    {
        $this->in_reply_to_status_id = $inReplyToStatusId;

        return $this;
    }

    /**
     * Get in_reply_to_status_id
     *
     * @return integer
     */
    public function getInReplyToStatusId()
    {
        return $this->in_reply_to_status_id;
    }

    /**
     * Set place
     *
     * @param string $place
     * @return Tweet
     */
    public function setPlace($place)
    {
        $this->place = $place;

        return $this;
    }

    /**
     * Get place
     *
     * @return string
     */
    public function getPlace()
    {
        return $this->place;
    }

    /**
     * Set retweeted
     *
     * @param boolean $retweeted
     * @return Tweet
     */
    public function setRetweeted($retweeted)
    {
        $this->retweeted = $retweeted;

        return $this;
    }

    /**
     * Get retweeted
     *
     * @return boolean
     */
    public function getRetweeted()
    {
        return $this->retweeted;
    }

    /**
     * Set text
     *
     * @param string $text
     * @return Tweet
     */
    public function setText($text)
    {
        $this->text = $text;

        return $this;
    }

    /**
     * Get text
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set deleted_at
     *
     * @param \DateTime $deletedAt
     * @return Tweet
     */
    public function setDeletedAt($deletedAt)
    {
        $this->deleted_at = $deletedAt;

        return $this;
    }

    /**
     * Get deleted_at
     *
     * @return \DateTime
     */
    public function getDeletedAt()
    {
        return $this->deleted_at;
    }

    /**
     * Set raw
     *
     * @param string $raw
     * @return Tweet
     */
    public function setRaw($raw)
    {
        $this->raw = $raw;

        return $this;
    }

    /**
     * Get raw
     *
     * @return string
     */
    public function getRaw()
    {
        return $this->raw;
    }

    /**
     * Set read
     *
     * @param boolean $read
     * @return Tweet
     */
    public function setRead($read)
    {
        $this->read = $read;

        return $this;
    }

    /**
     * Get read
     *
     * @return boolean
     */
    public function getRead()
    {
        return $this->read;
    }

    /**
     * Set user
     *
     * @param \Maerlyn\TwitterBundle\Entity\User $user
     * @return Tweet
     */
    public function setUser(User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \Maerlyn\TwitterBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
}
