<?php
require_once __DIR__.'/silex.phar'; 

$app = new Silex\Application();

$app['debug'] = true;

$app->get('/', function() use($app) {
    include 'face.html'; exit;
    return;
});


// $app->get('/hello/{name}', function($name) use($app) { 
    // return 'Hello '.$app->escape($name); 
// }); 

$app->run(); 