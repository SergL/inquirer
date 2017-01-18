<?php

class DefaultController extends Controller
{
    public function actionIndex()
    {
        $this->render('index');
    }

    public function accessRules()
    {
        return array(
            array(
                'allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('index'),
                'roles' => array('admin'), //admin'),
            ),
            array(
                'deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    public function filters()
    {
        return array(
            'accessControl', // perform access control for CRUD operations
        );
    }
}