<?php

/**
 * This is the model class for table "inquirer.results".
 *
 * The followings are the available columns in table 'inquirer.results':
 * @property integer $id
 * @property integer $reports_id
 * @property integer $test_quests_id
 * @property integer $answers_id
 * @property string $answer
 *
 * The followings are the available model relations:
 * @property Reports $reports
 * @property TestQuests $testQuests
 * @property Answers $answers
 */
class Results extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.results';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('reports_id, test_quests_id, answers_id', 'numerical', 'integerOnly' => true),
            array('answer', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, reports_id, test_quests_id, answers_id, answer', 'safe', 'on' => 'search'),
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
            'reports' => array(self::BELONGS_TO, 'Reports', 'reports_id'),
            'testQuests' => array(self::BELONGS_TO, 'TestQuests', 'test_quests_id'),
            'answers' => array(self::BELONGS_TO, 'Answers', 'answers_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'reports_id' => 'Reports',
            'test_quests_id' => 'Test Quests',
            'answers_id' => 'Answers',
            'answer' => 'Answer',
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
        $criteria->compare('reports_id', $this->reports_id);
        $criteria->compare('test_quests_id', $this->test_quests_id);
        $criteria->compare('answers_id', $this->answers_id);
        $criteria->compare('answer', $this->answer, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Results the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    /**
     * Return lists for drop list
     * @param int $is_tems
     * @return array
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


