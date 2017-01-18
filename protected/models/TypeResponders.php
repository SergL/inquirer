<?php

/**
 * This is the model class for table "inquirer.type_responders".
 *
 * The followings are the available columns in table 'inquirer.type_responders':
 * @property integer $id
 * @property string $name
 * @property string $table_name
 * @property string $primary_key_field_name
 * @property string $modules
 *
 * The followings are the available model relations:
 * @property CategoryTypeResponders[] $categoryTypeResponders
 * @property Responders[] $responders
 */
class TypeResponders extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.type_responders';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name, table_name, primary_key_field_name, modules', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name, table_name, primary_key_field_name, modules', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'categoryTypeResponders' => array(self::HAS_MANY, 'CategoryTypeResponders', 'type_responders_id'),
            'responders' => array(self::HAS_MANY, 'Responders', 'type_responders_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'name' => 'Name',
            'table_name' => 'Table Name',
            'primary_key_field_name' => 'Primary Key Field Name',
            'modules' => 'Modules',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search()
    {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('table_name', $this->table_name, true);
        $criteria->compare('primary_key_field_name', $this->primary_key_field_name, true);
        $criteria->compare('modules', $this->modules, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TypeResponders the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    /**
     * Returns the list of all category.
     * @return list data of all category
     */
    public static function getDataDropList($is_tems = 0)
    {
        if ($is_tems === 0) {
            $models = self::model()->findAll();
            $list = CHtml::listData($models, 'id', 'name');
        }
        return $list;
    }
}
