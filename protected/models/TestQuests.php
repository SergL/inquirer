<?php

/**
 * This is the model class for table "inquirer.test_quests".
 *
 * The followings are the available columns in table 'inquirer.test_quests':
 * @property integer $id
 * @property integer $test_sections_id
 * @property integer $quests_id
 * @property integer $type_quest_id
 * @property integer $sort
 * @property string $correct_text_value
 * @property integer $requred
 * @property string $file_name
 *
 * The followings are the available model relations:
 * @property Quests $quests
 * @property TestSections $testSections
 * @property Results[] $results
 */
class TestQuests extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.test_quests';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('test_sections_id, quests_id, type_quests_id', 'required'),
            array('test_sections_id, quests_id, type_quests_id, sort, requred', 'numerical', 'integerOnly' => true),
            array('correct_text_value, file_name', 'length', 'max' => 255),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array(
                'id, test_sections_id, quests_id, type_quests_id, sort, correct_text_value, requred, file_name',
                'safe',
                'on' => 'search'
            ),
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
            'quests' => array(self::BELONGS_TO, 'Quests', 'quests_id'),
            'testSections' => array(self::BELONGS_TO, 'TestSections', 'test_sections_id'),
            'typeQuests' => array(self::BELONGS_TO, 'TypeQuests', 'type_quests_id'),
            'results' => array(self::HAS_MANY, 'Result', 'test_quests_id'),

        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'test_sections_id' => Yii::t('inquirer', 'Test Sections'),
            'quests_id' => Yii::t('inquirer', 'Quest'),
            'type_quests_id' => Yii::t('inquirer', 'Type Quest'),
            'sort' => Yii::t('inquirer', 'Sort'),
            'correct_text_value' => Yii::t('inquirer', 'Correct Text Value'),
            'requred' => Yii::t('inquirer', 'Requred'),
            'file_name' => Yii::t('inquirer', 'File Name'),
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
        $criteria->compare('test_sections_id', $this->test_sections_id);
        $criteria->compare('quests_id', $this->quests_id);
        $criteria->compare('type_quests_id', $this->type_quests_id);
        $criteria->compare('sort', $this->sort);
        $criteria->compare('correct_text_value', $this->correct_text_value, true);
        $criteria->compare('requred', $this->requred);
        $criteria->compare('file_name', $this->file_name, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TestQuests the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public static function getDataDropList($is_tems = 0, $data = array())
    {
        if ($is_tems === 0) {
            $models = self::model()->with('quests')->findAll();
            $list = CHtml::listData($models, 'id', 'quests.quest');
        }
        return $list;
    }
}
