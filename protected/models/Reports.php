<?php

/**
 * This is the model class for table "inquirer.reports".
 *
 * The followings are the available columns in table 'inquirer.reports':
 * @property integer $id
 * @property integer $tests_id
 * @property integer $responders_id
 * @property string $datetime_begin
 * @property string $datetime_end
 * @property integer $sort
 *
 * The followings are the available model relations:
 * @property Tests $tests
 * @property Responders $responders
 * @property Results[] $results
 */
class Reports extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.reports';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('tests_id, responders_id, sort', 'numerical', 'integerOnly' => true),
            array('datetime_begin, datetime_end', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, tests_id, responders_id, datetime_begin, datetime_end, sort', 'safe', 'on' => 'search'),
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
            'tests' => array(self::BELONGS_TO, 'Tests', 'tests_id'),
            'responders' => array(self::BELONGS_TO, 'Responders', 'responders_id'),
            'results' => array(self::HAS_MANY, 'Result', 'reports_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'tests_id' => 'Tests',
            'responders_id' => 'Responders',
            'datetime_begin' => 'datetime Begin',
            'datetime_end' => 'datetime End',
            'sort' => 'Sort',
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
        $criteria->compare('tests_id', $this->tests_id);
        $criteria->compare('responders_id', $this->responders_id);
        $criteria->compare('datetime_begin', $this->datetime_begin, true);
        $criteria->compare('datetime_end', $this->datetime_end, true);
        $criteria->compare('sort', $this->sort);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Reports the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }
}
