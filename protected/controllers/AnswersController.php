<?php

class AnswersController extends Controller
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

//		);
        return array(
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
        $model = $this->loadModel($id);
        $data = array('model' => $model);

        $modelTestQuests = TestQuests::model()->with('testSections', 'quests', 'testSections.tests')->findByPk(
            $model->test_quests_id
        );
        $data['testQuests'] = $modelTestQuests;
        $this->render(
            'view',
            $data
        );
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate()
    {
        $model = new Answers;


        $data = array('model' => $model);

        if (isset($_GET['test_quests_id'])) {
            $model->test_quests_id = $_GET['test_quests_id'];
            $modelTestQuests = TestQuests::model()->with('testSections', 'quests', 'testSections.tests')->findByPk(
                $_GET['test_quests_id']
            );
            $data['testQuests'] = $modelTestQuests;
        }

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);
        if (isset($_POST['Answers'])) {
            $model->attributes = $_POST['Answers'];
            if ($model->save()) {

                if (isset($_GET['test_quests_id'])) {
                    $this->redirect(array('list', 'id' => $_GET['test_quests_id']));
                } else {
                    $this->redirect(array('view', 'id' => $model->id));
                }
            }
        }

        $this->render('create', $data);
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

        $data = array('model' => $model);

        $modelTestQuests = TestQuests::model()->with('testSections', 'quests', 'testSections.tests')->findByPk(
            $model->test_quests_id
        );
        $data['testQuests'] = $modelTestQuests;


        if (isset($_POST['Answers'])) {
            $model->attributes = $_POST['Answers'];
            if ($model->save()) {
                $this->redirect(array('view', 'id' => $model->id));
            }
        }

        $this->render('update', $data);
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id)
    {
        $model = $this->loadModel($id);
        $testQuestsId = $model->test_quests_id;
        $this->loadModel($id)->delete();

        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax'])) {
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('list', 'id' => $testQuestsId));
        }
    }

    /**
     * Lists all models.
     */
    public function actionIndex()
    {
        $dataProvider = new CActiveDataProvider('Answers');
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
    public function actionList($id)
    {
//        $model=new Answers('search');
//        $model->unsetAttributes();  // clear any default values
//        if(isset($_GET['Answers']))
//            $model->attributes=$_GET['Answers'];
//
//        $this->render('admin',array(
//                'model'=>$model,
//            ));
        $dataProvider = new CActiveDataProvider('Answers', array(
                'criteria' => array(
                    'condition' => 'test_quests_id = :test_quests_id',
//                    'order' => 'sort DESC',
                    'params' => array(':test_quests_id' => $id),
                ),
            )
        );

        $modelTestQuests = TestQuests::model()->with('testSections', 'quests', 'testSections.tests')->findByPk($id);
//        $modelTestSections = TestSections::model()->findByPk($modelTestQuests->test_sections_id);
//        $modelTests = Tests::model()->findByPk($modelTestSections->tests_id);
        $this->render(
            'list',
            array(
                'dataProvider' => $dataProvider,
                'testQuests' => $modelTestQuests,
//                'testSections' => $modelTestSections,
//                'tests' => $modelTests,
            )
        );
    }

    /**
     * Manages all models.
     */
    public function actionAdmin()
    {
        $model = new Answers('search');
        $model->unsetAttributes(); // clear any default values
        if (isset($_GET['Answers'])) {
            $model->attributes = $_GET['Answers'];
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
     * @return Answers the loaded model
     * @throws CHttpException
     */
    public function loadModel($id)
    {
        $model = Answers::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param Answers $model the model to be validated
     */
    protected function performAjaxValidation($model)
    {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'answers-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }
}
