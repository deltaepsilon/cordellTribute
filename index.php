<?php
require_once __DIR__.'/silex.phar'; 

$app = new Silex\Application();

$app['debug'] = true;

$app->get('/', function() use($app) {
    include 'face.html'; exit;
    return;
});
$app->post('/', function() use($app) {
    $audio = preg_grep('/\w+\.\w+$/',scandir('audio'));
	$audio = preg_replace('/\..+/', '', $audio);
	$audio = array_unique($audio);
    return json_encode($audio);
});


// $app->get('/hello/{name}', function($name) use($app) { 
    // return 'Hello '.$app->escape($name); 
// }); 

$app->run(); 