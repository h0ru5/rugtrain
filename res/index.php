<?php

require_once '../epiphany/Epi.php';
require_once 'Trainings.php';
require_once 'Users.php';

Epi::setPath('base','../epiphany');
Epi::init('api');

getApi()->get('/users',array('Users','names'), EpiApi::external);
#getApi()->get('/next',array('Trainings','next'), EpiApi::external);
#getApi()->get('/next/[^/]+',array('Trainings','nextn'), EpiApi::external);
#getApi()->get('/trainings/[^/]+',array('Trainings','one'), EpiApi::external);
getApi()->get('/trainings/([^/]+)/votes',array('Trainings','votes'), EpiApi::external);
getApi()->get('/trainings/([^/]+)/comments',array('Trainings','comments'), EpiApi::external);
getApi()->get('/trainings/([^/]+)/stats',array('Trainings','stats'), EpiApi::external);
getApi()->get('/trainings/([^/]+)/details',array('Trainings','details'), EpiApi::external);
getApi()->post('/trainings/([^/]+)/comments',array('Trainings','addComment'), EpiApi::external);
getApi()->post('/trainings/([^/]+)/votes/add',array('Trainings','addVote'), EpiApi::external);

getRoute()->run();

?>
