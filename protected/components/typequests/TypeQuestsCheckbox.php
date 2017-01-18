<?php

class TypeQuestsCheckbox extends TypeQuestsStrategy
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
        return CHtml::checkBoxList($name . '[answers_id][]', '', $list, $htmlOptions);
    }

    public function processSave($data, $options = '')
    {
        $data['answer'] = implode(',', $data['answers_id']);
        unset ($data['answers_id']);
        return $data;
    }


    public function processOutput($data, $htmlOptions = '')
    {
        $elements = explode(',', $data['results__answer']);
        foreach ($elements as $element) {
            $results[] = MyCModel::getDataParamByPk(
                $data['data_answers'],
                'Answers',
                (int)$element,
                'answer'
            );

        }

        return implode(', ', $results);
    }
}
