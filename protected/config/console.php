<?php

// This is the configuration for yiic console application.
// Any writable CConsoleApplication properties can be configured here.
return array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name' => 'My Console Application',
    // application components
    'components' => array(
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
    //migration
    'commandMap' => array(
        'migrate' => array(
            'migrationTable' => 'inquirer.tbl_migration'
        ),

    ),
    //logging
    /*
          'log' => array(
            'class' => 'CLogRouter',
            'routes' => array(
                array(
                    'class' => 'CFileLogRoute',
                    'levels' => 'error, warning',
                ),
            ),
        ),
    */
);