<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');
// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
// 
// 
// 
// MASTER


return array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name' => 'Inquirer',
    'theme' => 'classic',
    // preloading 'log' component
    'preload' => array('log'),
    // autoloading model and component classes
    'import' => array(
        'application.models.*',
        'application.components.*',
        'application.components.typequests.*',
        'application.modules.inquirer.models.AuditTrail',
    ),
    'modules' => array(
        // uncomment the following to enable the Gii tool
        /*		'gii' => array(
                    'class' => 'system.gii.GiiModule',
                    'password' => '1',
                    // If removed, Gii defaults to localhost only. Edit carefully to taste.
                    'ipFilters' => array(),
                ),*/
        'inquirer' => array(),
    ),
    // application components
    'components' => array(
        'authManager' => array(
            // Будем использовать свой менеджер авторизации
            'class' => 'PhpAuthManager',
            // Роль по умолчанию. Все, кто не админы, модераторы и юзеры — гости.
            'defaultRoles' => array('guest'),
        ),
        'user' => array(
            'class' => 'WebUser',
            'allowAutoLogin' => true
            // …
        ),
        'mail' => array(
            'class' => 'ext.mail.YiiMail',
            'transportType' => 'php',
            'viewPath' => 'application.views.mail',
            'logging' => true,
            'dryRun' => false
        ),
        'db' => array(
            'class' => 'DbConnectionMan',
            'db' => array(
                'connectionString' => 'mysql:host=localhost;dbname=inquirerdb',
                'emulatePrepare' => true,
                'username' => 'inquireruser',
                'password' => 'Ntcn<fps14',
                'charset' => 'utf8',
                'enableProfiling' => true,
                'enableParamLogging' => true,

            ),
        ),

        'errorHandler' => array(
            // use 'site/error' action to display errors
            'errorAction' => 'site/error',
        ),
        'mongodb' => array(
            'class' => 'MongoDbConnection',
            'db' => 'logs',
            'host' => 'localhost:27017',
            'user' => '',
            'password' => ''
        ),
//		'log' => array(
//			'class' => 'CLogRouter',
//			'routes' => array(
//				array(
//					'class' => 'CWebLogRoute',
//					'levels' => 'error, warning,trace, info',
//				),
//			// uncomment the following to show log messages on web pages
//			),
//		),
    ),
    // application-level parameters that can be accessed
    // using Yii::app()->params['paramName']

);
