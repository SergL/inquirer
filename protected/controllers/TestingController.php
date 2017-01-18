<?php
class TestingController extends Controller
{
    /**
     * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
     * using two-column layout. See 'protected/views/layouts/column2.php'.
     */

    public $layout = '//layouts/column2';
    public $defaultAction = 'test';


    /*
      id serial NOT NULL,
      test_quests_id integer,
      answer character varying(500),
      is_correct integer,
      file_name character varying(255),
      sort integer,
    */

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
            array(
                'allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('test'),
                'roles' => array('?'),
            ),
//            array(
//                'deny', // deny all users
//                'users' => array('?'),
//            ),
        );
    }

//    /**
//     * Displays a particular model.
//     * @param integer $id the ID of the model to be displayed
//     */
//    public function actionView($id)
//    {
//        $this->render(
//            'view',
//            array(
//                'model' => $this->loadModel($id),
//            )
//        );
//    }


    /**
     * Lists all models.
     */
    public function actionList($id)
    {
        $dataProvider = new CActiveDataProvider('Tests');
        $this->render(
            'list',
            array(
                'dataProvider' => $dataProvider,
            )
        );
    }

    public function actionTest()
    {
        if (isset($_GET['report_id']) || isset($_GET['id'])) {
            $reportID = (isset($_GET['id'])) ? $_GET['id'] : $_GET['report_id'];
        } elseif (isset($_GET['tests_id']) && isset($_GET['type_responders_id']) && isset($_GET['responder_id'])) {


            $modelTests = Tests::model()->findByPk($_GET['tests_id']);
            if ($modelTests === null) {
                throw new CHttpException(500,
                    Yii::t(
                        'inquirer',
                        'Not correct tests id.'
                    ));

            }
            $modelTypeResponders = TypeResponders::model()->findByPk($_GET['type_responders_id']);
            if ($modelTypeResponders === null) {
                throw new CHttpException(500,
                    Yii::t(
                        'inquirer',
                        'Not correct type responder id.'
                    ));
            }
            $data = $_GET;
            $data['typeResponders'] = $modelTypeResponders->getAttributes();

            $respondersId = $this->getRespondersId($data);

            $dataForReport = array('tests_id' => $data['tests_id'], 'responders_id' => $respondersId,);
            $modelReports = new Reports();
            $modelReports->attributes = $dataForReport;
            $modelReports->save();
            $reportID = $modelReports->id;

            unset($data);


        } else {
            throw new CHttpException(404, Yii::t(
                'inquirer',
                'Not Correct parameters in urls'
            ));
        }
        if (!$this->checkNewTesting($reportID)) {
            throw new CHttpException(500, Yii::t(
                'inquirer',
                'The test is passed, then another test or make a request for the passage of this'
            ));

        }
        if (isset($_POST['Reports'])) {
            $modelReports = new Reports();
            $dataReport = $_POST['Reports'];
            $dataReport['datetime_end'] = date('Y-m-d H:i:00');
            if (!empty($dataReport['id'])) {
                $modelReports = $modelReports->findByPk($dataReport['id']);
            }

            $modelReports->attributes = $dataReport;
            if ($modelReports->save()) {
            } else {
            }


            if (isset($_POST['Results'])) {


                $dataResults = $_POST['Results'];
                foreach ($dataResults as $key => $result) {

                    $modelResults = new Results();

//                    $model=$model->findByPk($result[);
                    $result['reports_id'] = $dataReport['id'];
                    $typeQuestsObj = new TypeQuestsStrategy($result['type_quests_type']);
//                    echo $typeQuestsObj->generateHtml($fieldName, $dataAnswers, $htmlOptions);

//                    $result = TypeQuestsProcessing::$result['type_quests_type']($result);
                    $result = $typeQuestsObj->processSave($result);
                    $modelResults->attributes = $result;

                    if ($modelResults->save()) {
                    } else {

                    }
                }
            }

            $this->redirect(array('results/report', 'id' => $modelReports->id));
//            exit;
        }

        $dataReports = $this->loadDataReports($reportID);
        $model = new TestGenerator();
//        $modelData = $model->loadModel($testID, $dataReports = array())
        $this->render(
            'test',
            array(
                'data' => $model->loadModel($dataReports['tests_id'], $dataReports),
                'label' => "Results",
                'advancedVariant' => 'other'
            )
        );
    }


    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Tests the loaded model
     * @throws CHttpException
     */
//    public function loadModel(
//        $id
//    ) {
//        $model = Tests::model()->findByPk($id);
//        if ($model === null) {
//            throw new CHttpException(404, 'The requested page does not exist.');
//        }
//        return $model;
//    }

    /**
     * Performs the AJAX validation.
     * @param Tests $model the model to be validated
     */
    protected function performAjaxValidation(
        $model
    ) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'tests-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }


    public function loadDataReports(
        $id
    ) {
        $dataModels = Reports::model()->findByPk($id)->getAttributes();
        if ($dataModels === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $dataModels;
    }

    private function checkNewTesting($id)
    {
        $dataFind = Results::model()->find('reports_id=:reports_id', array(':reports_id' => $id));
        if ($dataFind === null) {
            return true;
        } else {
            return false;
        }
    }

    private function getRespondersId($data)
    {
        $model = Responders::model()->find(
            'responder_id=:responder_id AND type_responders_id=:type_responders_id',
            array(
                ':type_responders_id' => $data['type_responders_id'],
                ':responder_id' => $data['responder_id']
            )
        );
        if ($model === null) {
            $model = new Responders();
            if (!isset($data['info_detailed'])) {
                $data['info_detailed'] = $data['typeResponders']['name'] . ' ' . $data['responder_id'];
            }
            $model->attributes = $data;
            $model->save();
        }


        return $model->id;
//        return '54564';
    }

}
