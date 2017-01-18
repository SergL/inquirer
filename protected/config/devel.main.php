<?

return array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'theme' => 'classic',
    'name' => 'Inquirer Devel',
    // preloading 'log' component
    'preload' => array('log'),
    // autoloading model and component classes
    'import' => array(
        'application.models.*',
        'application.components.*',
        'application.components.typequests.*',
        'application.modules.auditTrail.models.AuditTrail',
    ),
    'sourceLanguage' => 'en',
    'language' => 'ru',
    'modules' => array(
        // uncomment the following to enable the Gii tool
        'gii' => array(
            'class' => 'system.gii.GiiModule',
            'password' => '1',
            // If removed, Gii defaults to localhost only. Edit carefully to taste.
            'ipFilters' => array(),
        ),
        'inquirer' => array(),
    ),
    // application components
    'components' => array(
        /*
        'user'=>array(
            // enable cookie-based authentication
            'allowAutoLogin'=>true,
        ),
*/
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
        'urlManager' => array(
            'urlFormat' => 'path',
            'showScriptName' => false,
            'rules' => array(
                '<controller:\w+>/<id:\d+>' => '<controller>/view',
                '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
            ),
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
                'charset' => 'utf8',
            ),
        ),
        'errorHandler' => array(
            // use 'site/error' action to display errors
            'errorAction' => 'site/error',
        ),
        'log' => array(
            'class' => 'CLogRouter',
            'routes' => array(
                array(
                    'class' => 'CWebLogRoute',
                    'levels' => 'fatal, error, warning,trace, info',
//                    'levels' => 'all',
                ),
                // uncomment the following to show log messages on web pages
            ),
        ),
    ),

);