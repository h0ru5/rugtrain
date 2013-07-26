<?php

require_once '../epiphany/Epi.php';
require_once 'Trainings.php';
require_once 'Users.php';
require_once 'Shouts.php';

Epi::setPath('base','../epiphany');
Epi::init('api');

getApi()->get('/shouts/?([^/]+)?/?', array('Shouts','last'), EpiApi::external);
getApi()->post('/shouts/?', array('Shouts','add'), EpiApi::external);
getApi()->get('/users/?',array('Users','names'), EpiApi::external);
#getApi()->get('/next',array('Trainings','next'), EpiApi::external);
#getApi()->get('/next/[^/]+',array('Trainings','nextn'), EpiApi::external);
#getApi()->get('/trainings/[^/]+',array('Trainings','one'), EpiApi::external);
getApi()->get('/votetypes/?',array('Trainings','votetypes'), EpiApi::external);
getApi()->get('/trainings/([^/]+)/votes/?',array('Trainings','votes'), EpiApi::external);
getApi()->get('/trainings/([^/]+)/comments/?',array('Trainings','comments'), EpiApi::external);
getApi()->get('/trainings/([^/]+)/stats/?',array('Trainings','stats'), EpiApi::external);
getApi()->get('/trainings/([^/]+)/details/?',array('Trainings','details'), EpiApi::external);
getApi()->post('/trainings/([^/]+)/comments/?',array('Trainings','addComment'), EpiApi::external);
getApi()->post('/trainings/([^/]+)/votes/?',array('Trainings','addVote'), EpiApi::external);
#getApi()->get('/soon/?',array('Trainings','soon'), EpiApi::external);
getApi()->get('/soon/?([^/]+)?/?',array('Trainings','soon'), EpiApi::external);
getRoute()->run();

?>
