<?php

/**
 * This is the model class for table "inquirer.responders".
 *
 * The followings are the available columns in table 'inquirer.responders':
 * @property integer $id
 * @property integer $type_responders_id
 * @property string $responder_id
 * @property string $info_detailed
 * @property string $name
 *
 * The followings are the available model relations:
 * @property Reports[] $reports
 * @property TypeResponders $typeResponders
 */
class Responders extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'inquirer.responders';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('type_responders_id', 'numerical', 'integerOnly' => true),
            array('responder_id, name', 'length', 'max' => 255),
            array('info_detailed', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, type_responders_id, responder_id, info_detailed, name', 'safe', 'on' => 'search'),
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
            'reports' => array(self::HAS_MANY, 'Reports', 'responders_id'),
            'typeResponders' => array(self::BELONGS_TO, 'TypeResponders', 'type_responders_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'type_responders_id' => 'Type Responders',
            'responder_id' => 'Responder',
            'info_detailed' => 'Info Detailed',
            'name' => 'Name',
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
        $criteria->compare('type_responders_id', $this->type_responders_id);
        $criteria->compare('responder_id', $this->responder_id, true);
        $criteria->compare('info_detailed', $this->info_detailed, true);
        $criteria->compare('name', $this->name, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Responders the static model class
     */
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }
}
