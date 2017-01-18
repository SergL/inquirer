<?php

/**
 * This is the model class for table "inquirer.category_type_responders".
 *
 * The followings are the available columns in table 'inquirer.category_type_responders':
 * @property integer $id
 * @property integer $categories_id
 * @property integer $type_responders_id
 *
 * The followings are the available model relations:
 * @property TypeResponders $typeResponders
 * @property Categories $categories
 */
class CategoryTypeResponders extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.category_type_responders';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('categories_id, type_responders_id', 'numerical', 'integerOnly' => true),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, categories_id, type_responders_id', 'safe', 'on' => 'search'),
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
            'typeResponders' => array(self::BELONGS_TO, 'TypeResponders', 'type_responders_id'),
            'categories' => array(self::BELONGS_TO, 'Categories', 'categories_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'categories_id' => 'Categories',
            'type_responders_id' => 'Type Responders',
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
        $criteria->compare('categories_id', $this->categories_id);
        $criteria->compare('type_responders_id', $this->type_responders_id);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CategoryTypeResponders the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }
}
