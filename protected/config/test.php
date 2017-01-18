<?php

return CMap::mergeArray(
    require(dirname(__FILE__) . '/main.php'),
    array(
        'components' => array(
            'fixture' => array(
                'class' => 'system.test.CDbFixtureManager',
            ),
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
    )
);
