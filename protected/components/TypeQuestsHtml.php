<?php
/**
 * Created by PhpStorm.
 * User: serg
 * Date: 11/5/13
 * Time: 10:16 AM
 */
/**
 * "radio"
 * "radioAndVariant"
 * "checkbox"
 * "input_string"
 * "radioImages"
 * "text"

 */
class TypeQuestsHtml extends CHtml
{
    public static $defaultOptions = array(
        'string' => array('style' => 'width:400px;'),
        'text' => array('style' => 'width:400px; height:200px;'),
        'checkbox' => array('labelOptions' => array('style' => 'display:inline;')),
        'radio' => array('labelOptions' => array('style' => 'display:inline;')),
        'radioAndString' => array(
            'radioOptions' => array('labelOptions' => array('style' => 'display:inline;')),
            'stringOptions' => array('style' => 'width:400px;'),
        ),

    );

    public static function string($name, $data = '', $htmlOptions = '')
    {
        if (empty($htmlOptions)) {
            $htmlOptions = self::$defaultOptions['string'];
        }
        return CHtml::textField($name . '[answer]', $data, $htmlOptions);
    }


    public static function radio(
        $name,
        $data = '',
        $htmlOptions = array('labelOptions' => array('style' => 'display:inline;'))
    ) {

        if (empty($htmlOptions)) {
            $htmlOptions = self::$defaultOptions['radio'];
        }
        return CHtml::radioButtonList($name . '[answer_id]', '', self::listData($data), $htmlOptions);
    }


    public static function checkbox(
        $name,
        $data = '',
        $htmlOptions = ''
    ) {
        if (empty($htmlOptions)) {
            $htmlOptions = self::$defaultOptions['checkbox'];
        }
        return CHtml::checkBoxList($name . '[answers_id][]', '', self::listData($data), $htmlOptions);
    }

//    public static function radioImages($name, $data = '', $htmlOptions = array())
//    {
//        return 'radioImages';
//    }

    public static function radioAndString($name, $data = '', $htmlOptions = array())
    {


        $result = '';
        $lists = self::listData($data);
        $lists['other'] = Yii::t('inquirer', 'Other variants') . ' ';

        if (empty($htmlOptions['radioOptions'])) {
            $htmlOptions = self::$defaultOptions['radioAndString']['radioOptions'];
        }
        $result .= CHtml::radioButtonList($name . '[answers_id]', '', $lists, $htmlOptions);

        if (empty($htmlOptions['stringOptions'])) {
            $htmlOptions = self::$defaultOptions['radioAndString']['stringOptions'];
        }
        $result .= CHtml::textField($name . '[answer]', '', $htmlOptions);
        return $result;
    }

    public static function text($name, $data = '', $htmlOptions = '')
    {
        if (empty($htmlOptions)) {
            $htmlOptions = self::$defaultOptions['text'];
        }
        return CHtml::textArea($name . '[answer]', $data, $htmlOptions);
    }

    public static function listData($data)
    {
        $lists = array();
        foreach ($data as $row) {
            $lists[$row['id']] = $row['answer'];
        }
        return $lists;
    }
} 