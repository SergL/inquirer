<?php

/**
 * This is the model class for table "inquirer.categories".
 *
 * The followings are the available columns in table 'inquirer.categories':
 * @property integer $id
 * @property string $name
 * @property string $description
 * @property string $modules_before
 * @property string $modules_after
 *
 * The followings are the available model relations:
 * @property CategoryTypeResponders[] $categoryTypeResponders
 * @property Tests[] $tests
 */
class Categories extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.categories';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name, modules_before, modules_after', 'length', 'max' => 255),
            array('description', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name, description, modules_before, modules_after', 'safe', 'on' => 'search'),
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
            'categoryTypeResponders' => array(self::HAS_MANY, 'CategoryTypeResponders', 'categories_id'),
            'tests' => array(self::HAS_MANY, 'Tests', 'categories_id'),
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
            'description' => 'Description',
            'modules_before' => 'Modules Before',
            'modules_after' => 'Modules After',
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
        $criteria->compare('description', $this->description, true);
        $criteria->compare('modules_before', $this->modules_before, true);
        $criteria->compare('modules_after', $this->modules_after, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Categories the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public static function getDataDropList($is_tems = 0)
    {
        if ($is_tems === 0) {
            $models = self::model()->findAll();
            $list = CHtml::listData($models, 'id', 'name');
        }
        return $list;
    }
}
