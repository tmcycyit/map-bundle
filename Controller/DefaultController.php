<?php

namespace Bus\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('BusMapBundle:Default:index.html.twig', array('name' => $name));
    }
}
