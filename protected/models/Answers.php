<?php

/**
 * This is the model class for table "inquirer.answers".
 *
 * The followings are the available columns in table 'inquirer.answers':
 * @property integer $id
 * @property integer $test_quests_id
 * @property string $answer
 * @property integer $is_correct
 * @property string $file_name
 * @property integer $sort
 */
class Answers extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.answers';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('test_quests_id, is_correct, sort', 'numerical', 'integerOnly' => true),
            array('answer', 'length', 'max' => 500),
            array('file_name', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, test_quests_id, answer, is_correct, file_name, sort', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array();
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => Yii::t('inquirer', 'ID'),
            'test_quests_id' => Yii::t('inquirer', 'Test Quests'),
            'answer' => Yii::t('inquirer', 'Answer'),
            'is_correct' => Yii::t('inquirer', 'Is Correct'),
            'file_name' => Yii::t('inquirer', 'File Name'),
            'sort' => Yii::t('inquirer', 'Sort'),
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
        $criteria->compare('test_quests_id', $this->test_quests_id);
        $criteria->compare('answer', $this->answer, true);
        $criteria->compare('is_correct', $this->is_correct);
        $criteria->compare('file_name', $this->file_name, true);
        $criteria->compare('sort', $this->sort);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Answers the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }
}
