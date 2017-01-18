<?php

class ResultsController extends Controller
{
    /**
     * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
     * using two-column layout. See 'protected/views/layouts/column2.php'.
     */

    public $layout = '//layouts/column2';
    public $defaultAction = 'report';

    const DELIM_FIELD = '__';


    /**
     * @return array action filters
     */
    public function filters()
    {
        return array(
            'accessControl', // perform access control for CRUD operations
            'postOnly + delete', // we only allow deletion via POST request
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules()
    {
        return array(
            array(
                'allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('view'),
                'roles' => array('?'),
            ),
            array(
                'allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('index'),
                'roles' => array('*'),
            ),
            array(
                'allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'update'),
                'roles' => array('@'),
            ),
            array(
                'allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('admin', 'delete'),
                'roles' => array('admin'),
            ),
//            array(
//                'deny', // deny all users
//                'users' => array('?'),
//            ),
        );
    }

    public function actionReport($id)
    {
//        $dataReports = $this->loadDataReports($id);

        $model = new ReportItog();
        $responderInfo['alias'] = 'bfdldf';

        $this->render(
            'report',
            array(
                'data' => $model->loadModel($id),
                'model' => $model,
//                'testInfo' => $testInfo,
//                'responderInfo' => $responderInfo,
//                'label' => "Results",
//                'advancedVariant' => 'other'
            )
        );
    }

    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id)
    {
        $this->render(
            'view',
            array(
                'model' => $this->loadModel($id),
            )
        );
    }

    /**
     * Lists all models.
     */
    public function actionIndex()
    {

        $selectColumns = 'results.reports_id AS id, results.reports_id AS results__reports_id,
            reports.datetime_begin AS reports__datetime_begin,
            reports.datetime_end AS reports__datetime_end,
            tests.name AS tests__name,
            responders.info_detailed AS responders__info_detailed';
        $data = Yii::app()->db->createCommand()
            ->select($selectColumns)

            ->from(
                '(SELECT results_sub.reports_id  FROM inquirer.results  as results_sub GROUP BY results_sub.reports_id) AS results'
            )
            ->join('inquirer.reports as reports', 'results.reports_id=reports.id')
            ->join('inquirer.tests as tests', 'reports.tests_id=tests.id')
            ->join('inquirer.responders as responders', 'reports.responders_id=responders.id')
//            ->order('results.id ASC')
            ->queryAll();


        $dataProvider = new CArrayDataProvider($data);
//        $dataProvider->pagination=false;
        $this->render(
            'index',
            array(
                'dataProvider' => $dataProvider,
            )
        );
    }


    /**
     * Manages all models.
     */
    public function actionAdmin()
    {
        $model = new Results('search');
        $model->unsetAttributes(); // clear any default values
        if (isset($_GET['Results'])) {
            $model->attributes = $_GET['Results'];
        }

        $this->render(
            'admin',
            array(
                'model' => $model,
            )
        );
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Results the loaded model
     * @throws CHttpException
     */
    public function loadModel($id)
    {
        $model = Results::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param Results $model the model to be validated
     */
    protected function performAjaxValidation($model)
    {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'results-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

}
