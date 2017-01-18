<?php

class WebUser extends CWebUser
{
    private $_model = null;

    function getRole()
    {
        if ($user = $this->getModel()) {
            // в таблице User есть поле role
            return $user->role;
        }
    }

    private function getModel()
    {
        if (!$this->isGuest && $this->_model === null) {
            $this->_model = Admins::model()->findByPk($this->id, array('select' => '*'));
        }
        return $this->_model;
    }

    private function getModelWithPartner()
    {
        if (!$this->isGuest && $this->_model === null) {
            $this->_model = Admins::model()->findByPk($this->id, array('select' => '*'));
        }
        return $this->_model;
    }

    public function getPartnerId()
    {
        // not in session, because real change
        if ($user = $this->getModel()) {
            return $user->partner_id;
        } else {
            return 0;
        }
    }

    public function getPartnerName()
    {
        // not in session, because real change
        if ($user = $this->getModelWithPartner()) {
            return $user->partners->name;
        } else {
            return "All";
        }
    }
}

?>
