<?php
/**
 * Class TypeQuestsString
 */
class TypeQuestsText extends TypeQuestsStrategy
{

    protected $defaultOptionsGenerate = array('style' => 'width:400px;');

    public function generateHtml($name, $data = '', $htmlOptions, $fieldText)
    {
        if (empty($htmlOptions)) {
            $htmlOptions = $this->defaultOptionsGenerate;
        }
        return CHtml::textArea($name . '[answer]', $data, $htmlOptions);
    }

    public function processOutput($data, $htmlOptions = '')
    {

        return $data['results__answer'];
    }

}
