<?php
/**
 * Class CompositeUnique
 * @autor  Андрей Марющенко
 * @link http://instanceof.org/validator-yii-composite-unique/
 */
class CompositeUnique extends CValidator
{
    // поля входящие в состав уникального ключа
    public $keyColumns;

    // сообщение об ошибке
    public $errorMessage = '"{columns_labels}" значения в полях не уникальны';

    // показывать сообщение об ошибке под всеми
    // полями которые входят в состав уникального ключа
    public $addErrorToAllColumns = true;

    protected function validateAttribute($object, $attribute)
    {
        $class = get_class($object);

        // добавляем в ключ значение атрибута
        $this->keyColumns[] = $attribute;
        // и избавляемся от повторяющихся полей
        $this->keyColumns = array_unique($this->keyColumns);

        // если в параметрах одно поле, то выдаем ошибку, хотя это можно удалить <img src="http://instanceof.org/wp-includes/images/smilies/icon_wink.gif" alt=";)" class="wp-smiley">
        if (count($this->keyColumns) == 1) {
            throw new CException('Следует использовать CUniqueValidator');
        }

        $columnsLabels = $object->attributeLabels();
        $criteria = new CDbCriteria();
        $keyColumnsLabels = array();
        foreach ($this->keyColumns as &$column) {
            $column = trim($column);
            $criteria->compare($column, $object->$column);
            $keyColumnsLabels[] = $columnsLabels[$column];
        }
        $criteria->limit = 1;
        // если мы находим запись с такими же значениями полей входящих в уникальный ключ
        if ($row = $class::model()->find($criteria)) {
            // если это мы вставляем запись или если обновляем и такие же
            // значения полей есть в другой записи то добавляем ошибку к полям
            if ($object->isNewRecord || ($row->getPrimaryKey() != $object->getPrimaryKey())) {
                $message = Yii::t(
                    'yii',
                    $this->errorMessage,
                    array(
                        '{columns_labels}' => join(', ', $keyColumnsLabels)
                    )
                );
                if ($this->addErrorToAllColumns) {
                    foreach ($this->keyColumns as $column) {
                        $this->addError($object, $column, $message);
                    }
                } else {
                    $this->addError($object, $attribute, $message);
                }
            }
        }
    }
}