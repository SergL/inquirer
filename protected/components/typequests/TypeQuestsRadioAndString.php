<?php

class TypeQuestsRadioAndString extends TypeQuestsStrategy
{

    protected $defaultOptionsGenerate = array(
        'radioOptions' => array('labelOptions' => array('style' => 'display:inline;')),
        'stringOptions' => array('style' => 'width:400px;'),
    );

    public function generateHtml($name, $data = '', $htmlOptions, $fieldText)
    {
        $result = '';

        $lists = $this->listData($data);
        if (empty($list)) {
            throw new CHttpException(500, Yii::t(
                'inquirer',
                'In the form of the wrong type or no answer options for the question "{questName}"',
                array('{questName}' => $fieldText)
            ));
        }
        $lists['other'] = Yii::t('inquirer', 'Other variants') . ' ';

        if (empty($htmlOptions['radioOptions'])) {
            $htmlOptions = $this->defaultOptionsGenerate['radioOptions'];
        }
        $result .= CHtml::radioButtonList($name . '[answers_id]', '', $lists, $htmlOptions);

        if (empty($htmlOptions['stringOptions'])) {
            $htmlOptions = $this->defaultOptionsGenerate['stringOptions'];
        }
        $result .= CHtml::textField($name . '[answer]', '', $htmlOptions);
        return $result;
    }

    public function processSave($data, $options = '')
    {

        if ($data['answers_id'] == 'other') {
            unset ($data['answers_id']);
        } else {
            unset ($data['answer']);
        }

        return $data;
    }

    public function processOutput($data, $htmlOptions = '')
    {
        if (isset($data['results__answers_id'])) {
            $result = MyCModel::getDataParamByPk(
                $data['data_answers'],
                'Answers',
                $data['results__answers_id'],
                'answer'
            );

        } else {
            $result = $data['results__answer'];
        }

        return $result;
    }
}
