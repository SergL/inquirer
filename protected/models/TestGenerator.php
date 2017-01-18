<?php
/**
 * Created by PhpStorm.
 * User: serg
 * Date: 11/18/13
 * Time: 12:04 PM
 */


class TestGenerator extends MyCModel
{
    public $tables = array(
        'tests',
        'sections',
        'test_sections',
        'type_quests',
        'test_quests',
        'answers',
        'quests',
    );
    public $columnsTests = array(
        'name',
        'count_allow_quests',
        'datetime_create',
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
        'file_name'
    );
    public $columnsAnswers = array(
        'id',
        'answer',
        'is_correct',
        'file_name',
        'test_quests_id',
    );
    public $columnsQuests = array(
        'quest',
        'file_name'
    );

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


    public function loadModel($testID, $dataReports = array())
    {

        $selectColumns = parent::setSelectStringTables();
        $data = Yii::app()->db->createCommand()
            ->select($selectColumns)
            ->from('inquirer.tests as tests')
            ->join('inquirer.test_sections as test_sections', 'test_sections.tests_id=tests.id')
            ->join('inquirer.sections as sections', 'test_sections.sections_id=sections.id')
            ->join('inquirer.test_quests as test_quests', 'test_quests.test_sections_id=test_sections.id')
            ->join('inquirer.type_quests as type_quests', 'test_quests.type_quests_id=type_quests.id')
            ->join('inquirer.quests as quests', 'test_quests.quests_id =quests.id')
            ->leftJoin('inquirer.answers as answers', 'answers.test_quests_id = test_quests.id')


            ->where('tests.id=:id', array(':id' => $testID))
            ->order('test_sections.sort DESC, test_quests.sort DESC')
            ->queryAll();


        $testData = $this->getGeneratedArr($data);
        $testData['reports'] = $dataReports;
        return $testData;
    }

    private function getGeneratedArr(
        $data
    ) {
        $result = $testSectionIds = $testQuestsIds = $answersIds = array();
        foreach ($data as $row) {
            $dataTests = $this->getDataTableInfo($row, 'tests');

            if (!isset($result['name'])) {
                $result = $dataTests;
            }

            $sectionId = $this->updateBlockData(
                $result,
                $row,
                'sections',
                array('test_sections', 'sections'),
                $testSectionIds,
                'id'
            );

//            if($sectionId){
            $questId = $this->updateBlockData(
                $result['sections'][$sectionId],
                $row,
                'quests',
                array('test_quests', 'quests', 'type_quests'),
                $testQuestsIds,
                'id'
            );
//                if($questId){
            $this->updateBlockData(
                $result['sections'][$sectionId]['quests'][$questId],
                $row,
                'answers',
                array('answers'),
                $answersIds,
                'id'
            );
//                }
//            }


        }

        return $result;
    }

}