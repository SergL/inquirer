<?php

class AdminController extends Controller
{
    public $defaultAction = "admin";
    public $layout = '//layouts/column1';

    public function actionAdmin()
    {
        $model = new AuditTrail('search');
        $model->unsetAttributes(); // clear any default values
        if (isset($_GET['AuditTrail'])) {
            $model->attributes = $_GET['AuditTrail'];
        }
        $this->render(
            'admin',
            array(
                'model' => $model,
            )
        );
    }

    public function accessRules()
    {
        return array(
            array(
                'allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('admin'),
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