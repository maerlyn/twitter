<?php

namespace Maerlyn\TwitterBundle\Entity\Repository;

use Doctrine\ORM\EntityRepository;
use Maerlyn\TwitterBundle\Entity\Tweet;

class TweetRepository extends EntityRepository
{
    /**
     * @param $count int max number of tweets to return
     * @return Tweet[]
     */
    public function findLatest($count)
    {
        return $this->createQueryBuilder("t")
            ->select("t, u")
            ->innerJoin("t.user", "u")
            ->orderBy("t.created_at", "DESC")
            ->setMaxResults($count)
            ->getQuery()
            ->getResult();
    }
}
