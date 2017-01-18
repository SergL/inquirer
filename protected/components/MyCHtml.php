<?php
/**
 * Created by PhpStorm.
 * User: serg
 * Date: 11/15/13
 * Time: 11:32 AM
 */

class MyCHtml extends CHtml
{

    public static function booleanText(
        $data,
        $htmlOptions = array(),
        $enabled = 'Yes',
        $disabled = 'No',
        $langCategory = 'global',
        $tag = 'span'
    ) {
        if (isset($data)) {
            $content = Yii::t($langCategory, $disabled);
        } elseif ($data) {
            $content = Yii::t($langCategory, $enabled);
        } else {
            $content = Yii::t($langCategory, $disabled);
        }
        return self::tag($tag, $htmlOptions, $content);
    }

/*    public static function submitButton(
        $label,
        $htmlOptions = array(),
        $langCategory = 'global'
    ) {
        $label = Yii::t($langCategory, $label);

        return parent::submitButton($label, $htmlOptions);
    }*/

}