<?php

class TypeQuestsStrategy extends CBehavior
{
    /*
     *         'string' => array('style' => 'width:400px;'),
        'text' => array('style' => 'width:400px; height:200px;'),
        'checkbox' => array('labelOptions' => array('style' => 'display:inline;')),
        'radio' => array
     */
    protected $arrTypeQuests = array(
        'string',
        'text',
        'checkbox',
        'radio',
        'radioAndString',


    );
    protected $className;
    protected $defaultOptionsGenerate;
    protected $defaultOptionsSave;
    protected $defaultOptionsOtutput;

    public function __construct($typeQuests = '')
    {

        if (!empty($typeQuests)) {
            if (in_array($typeQuests, $this->arrTypeQuests)) {
                $classNameConstruct = 'TypeQuests' . ucfirst($typeQuests);
                $this->className = new $classNameConstruct;
            } else {
                throw new CHttpException(500, 'Not TypeQuests class.');
            }
        }

    }


    public function generateHtml($name, $data, $htmlOptions = '', $fieldText)
    {
        if (method_exists($this->className, 'generateHtml')) {
            return $this->className->generateHtml($name, $data, $htmlOptions, $fieldText);
        } else {
            return false;
        }
    }

    public function processSave($data, $htmlOptions = '')
    {

        if (method_exists($this->className, 'processSave')) {
            return $this->className->processSave($data, $htmlOptions);
        } else {
            return $data;
        }
    }

    public function processOutput($data, $htmlOptions = '')
    {

        if (method_exists($this->className, 'processOutput')) {
            return $this->className->processOutput($data, $htmlOptions);
        } else {
//            return $data;
        }
    }

    protected function listData($data)
    {
        $lists = array();
        if (!empty($data)) {
            foreach ($data as $row) {
                $lists[$row['id']] = $row['answer'];
            }
        }
        return $lists;
    }
}
