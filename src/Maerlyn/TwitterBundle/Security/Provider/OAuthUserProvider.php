<?php

namespace Maerlyn\TwitterBundle\Security\Provider;

use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\OAuthUserProvider as BaseProvider;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;

class OAuthUserProvider extends BaseProvider
{
    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        if ("m@maerlyn.eu" !== $response->getEmail()) {
            throw new UsernameNotFoundException(sprintf("Username %s not found", $response->getEmail()));
        }

        return parent::loadUserByOAuthUserResponse($response);
    }
}
