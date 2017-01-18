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
class TypeQuestsProcessing
{
    public static function string($data)
    {
        return $data;
    }


    public static function radio($data)
    {
        return $data;
    }


    public static function checkbox($data)
    {

        $data['answer'] = implode(',', $data['answers_id']);
        unset ($data['answers_id']);
        return $data;
    }

//    public static function radioImages($name, $data = '', $htmlOptions = array())
//    {
//        return 'radioImages';
//    }

    public static function radioAndString($data)
    {

        if ($data['answers_id'] == 'other') {
            unset ($data['answers_id']);
        } else {
            unset ($data['answer']);
        }

        return $data;
    }

    public static function text($data)
    {

        return $data;
    }
}