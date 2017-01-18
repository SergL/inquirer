<?php

/**
 * This is the model class for table "inquirer.test_sections".
 *
 * The followings are the available columns in table 'inquirer.test_sections':
 * @property integer $id
 * @property integer $tests_id
 * @property integer $sections_id
 * @property integer $count_allow_quests
 * @property integer $sort
 *
 * The followings are the available model relations:
 * @property Tests $tests
 * @property Sections $sections
 */
class TestSections extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.test_sections';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('tests_id, sections_id', 'required'),
            array('tests_id, sections_id, count_allow_quests, sort', 'numerical', 'integerOnly' => true),
            array('sections_id', 'CompositeUnique', 'keyColumns' => array('tests_id', 'sections_id')),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, tests_id, sections_id, count_allow_quests, sort', 'safe', 'on' => 'search'),
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
            'sections' => array(self::BELONGS_TO, 'Sections', 'sections_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'tests_id' => Yii::t('inquirer', 'Tests'),
            'sections_id' => Yii::t('inquirer', 'Sections'),
            'count_allow_quests' => Yii::t('inquirer', 'Count Allow Quests'),
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
        $criteria->compare('tests_id', $this->tests_id);
        $criteria->compare('sections_id', $this->sections_id);
        $criteria->compare('count_allow_quests', $this->count_allow_quests);
        $criteria->compare('sort', $this->sort);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TestSections the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public static function getDataDropList($is_tems = 0, $data = array())
    {
        if ($is_tems === 0) {
            $models = self::model()->with('tests', 'sections')->findAll();
            $list = CHtml::listData($models, 'id', 'sections.title_in_backend', 'tests.name');
        }
        return $list;
    }
}
