<?php
class TypeQuestsRadio extends TypeQuestsStrategy
{

    protected $defaultOptionsGenerate = array('labelOptions' => array('style' => 'display:inline;'));

    public function generateHtml($name, $data = '', $htmlOptions, $fieldText)
    {
        if (empty($htmlOptions)) {
            $htmlOptions = $this->defaultOptionsGenerate;
        }
        $list = $this->listData($data);
        if (empty($list)) {
            throw new CHttpException(500, Yii::t(
                'inquirer',
                'In the form of the wrong type or no answer options for the question "{questName}"',
                array('{questName}' => $fieldText)
            ));
        }
        return CHtml::radioButtonList($name . '[answers_id]', '', $list, $htmlOptions);

    }

    public function processOutput($data = '', $htmlOptions = '')
    {
        $answer = MyCModel::getDataParamByPk(
            $data['data_answers'],
            'Answers',
            $data['results__answers_id'],
            'answer'
        );
        return $answer;
    }

}
