<?php

class TestSectionsController extends Controller
{
    /**
     * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
     * using two-column layout. See 'protected/views/layouts/column2.php'.
     */
    public $layout = '//layouts/column2';

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
                'deny', // deny all users
                'roles' => array('?'),
            ),
            array(
                'allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('index', 'view'),
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
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate()
    {
        $model = new TestSections;
        if (isset($_GET['tests_id'])) {
            $model->tests_id = $_GET['tests_id'];
            $modelTests = Tests::model()->findByPk($_GET['tests_id']);
        }

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['TestSections'])) {
            $model->attributes = $_POST['TestSections'];
            if ($model->save()) {

                if (isset($_GET['tests_id'])) {
                    $this->redirect(array('list', 'id' => $_GET['tests_id']));
                } else {
                    $this->redirect(array('view', 'id' => $model->id));
                }
            }

        }
        $dataView = array(
            'model' => $model,
        );
        if (isset($modelTests)) {
            $dataView['tests'] = $modelTests;

        }

        $this->render('create', $dataView);
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id)
    {
        $model = $this->loadModel($id);

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['TestSections'])) {
            $model->attributes = $_POST['TestSections'];
            if ($model->save()) {
                $this->redirect(array('view', 'id' => $model->id));
            }
        }

        $this->render(
            'update',
            array(
                'model' => $model,
            )
        );
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id)
    {
        $this->loadModel($id)->delete();

        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax'])) {
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
        }
    }

    /**
     * Lists all models.
     */
    public function actionIndex()
    {
        if (isset($_GET['tests_id'])) {
            $dataProvider = new CActiveDataProvider('TestSections', array(
                    'criteria' => array(
                        'condition' => 'tests_id = :tests_id',
                        'params' => array(':tests_id' => $_GET['tests_id'])
                    )
                )
//                'pagination' => array(
//                    'pageSize' => 10,
//                ),
            );
        } else {
            $dataProvider = new CActiveDataProvider('TestSections');
        }


        $this->render(
            'index',
            array(
                'dataProvider' => $dataProvider
            )
        );
    }

    /**
     * Lists all models.
     */
    public function actionList($id)
    {
//        if (isset($_GET['tests_id'])){
        $dataProvider = new CActiveDataProvider('TestSections', array(
                'criteria' => array(
                    'condition' => 'tests_id = :tests_id',
                    'order' => 'sort DESC',
                    'params' => array(':tests_id' => $id),


                ),
//                    'pagination'=>false,
            )
//                'pagination' => array(
//                    'pageSize' => 10,
//                ),
        );
//        } else {
//            $dataProvider=new CActiveDataProvider('TestSections');
//        }


//        $model = Tests::model()->findByPk($id);
        $this->render(
            'list',
            array(
                'dataProvider' => $dataProvider,
                'tests' => Tests::model()->findByPk($id),
            )
        );
    }

    /**
     * Manages all models.
     */
    public function actionAdmin()
    {
        $model = new TestSections('search');
        $model->unsetAttributes(); // clear any default values
        if (isset($_GET['TestSections'])) {
            $model->attributes = $_GET['TestSections'];
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
     * @return TestSections the loaded model
     * @throws CHttpException
     */
    public function loadModel($id)
    {
        $model = TestSections::model()->with('sections', 'tests')->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param TestSections $model the model to be validated
     */
    protected function performAjaxValidation($model)
    {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'test-sections-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }
}
