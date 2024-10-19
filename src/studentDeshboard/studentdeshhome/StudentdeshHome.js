import React from 'react'
import Notice from '../notice/Notice'
import IdCardTemplet from '../idcardtamplet/IdCardTemplet'
import useTitle from '../../shared/useTitle/useTitle'


const StudentdeshHome = () => {
  useTitle('Home')
  return (
    <div>
       <IdCardTemplet />
    </div>
  )
}

export default StudentdeshHome