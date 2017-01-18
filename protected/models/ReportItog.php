<?php
class ReportItog extends MyCModel
{

    public $tables = array(
//        'tests',
//        'sections',
//        'test_sections',
//        'type_quests',
        'results',
        'reports',
        'test_quests',
        'quests',
        'answers',


    );
    public $columnsTests = array(
        'name',
//        'count_allow_quests',
//        'datetime_create',
    );
    public $columnsTest_sections = array(
        'id',
        'count_allow_quests',
    );
    public $columnsSections = array(
        'name',
    );

    public $columnsType_quests = array(
        'type',
    );

    public $columnsTest_quests = array(
        'id',
        'correct_text_value',
        'requred',
        'file_name',
        'type_quests_id',
    );

    public $columnsResults = array(
        'id',
        'reports_id',
        'answers_id',
        'answer',
    );


    public $columnsReports = array(
        'id',
        'responders_id',
        'tests_id'
    );
    public $columnsAnswers = array(
        'id',
        'answer',
        'is_correct',
        'file_name',

    );
    public $columnsQuests = array(
        'quest',
        'file_name',
    );
    public $dataTypeQuests = array();
    public $dataAnswers = array();

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Tests the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }


    public function loadModel($id)
    {
        $selectColumns = $this->setSelectStringTables();
        $data = Yii::app()->db->createCommand()
            ->select($selectColumns)


            ->from('inquirer.results as results')
            ->join('inquirer.reports as reports', 'results.reports_id=reports.id')
            ->join('inquirer.test_quests as test_quests', 'results.test_quests_id=test_quests.id')
            ->join('inquirer.quests as quests', 'test_quests.quests_id =quests.id')
            ->leftJoin('inquirer.answers as answers', 'results.answers_id = answers.id')


            ->where('reports.id=:id', array(':id' => $id))
            ->order('results.id ASC')
            ->queryAll();

        for ($i = 0; $i < count($data); $i++) {
            $data[$i]['type_quests' . '__' . 'type'] = MyCModel::getDataParamByPk(
                $this->dataTypeQuests,
                'TypeQuests',
                $data[$i]['test_quests__type_quests_id'],
                'type'
            );
        }
        $data['test'] = MyCModel::loadDataModels('Tests', $data[0]['reports__tests_id']);
        $data['responder'] = MyCModel::loadDataModels('Responders', $data[0]['reports__responders_id']);

        return $data;
    }


}
