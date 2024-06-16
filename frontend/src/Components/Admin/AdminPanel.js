import React, { useContext, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import axios from 'axios'
import { AuthContext } from '../../AuthContextProvider/AuthProvider'
import Loader from '../Loader/Loader'
import AdminAddition from './AdminAddition'
import QuestionAddition from './QuestionAddition'
import QuestionUpdation from './QuestionUpdation'
import { QrcodeIcon } from '@heroicons/react/solid'
import QuestionList from './QuestionList'

export default function AdminPanel() {
    
    const [id,setId]=useState(false)
    const { isAuthenticated, loaded } = useContext(AuthContext)
    const [admin,setAdmin]=useState(true)
    const [addquestion,setAddQuestion]=useState(false)
    const [updatequestion,setUpdateQuestion]=useState(false)
    const updateId=(typ,val)=>{
        if(typ===1)
        setId(val)
        else
        setId(false)
    }
    // console.log(id)

    const handlePage=(e)=>{
        window.scrollTo(0,0)
        if(e.target.value==='addadmin'){
            setAdmin(true)
            setAddQuestion(false)
            setUpdateQuestion(false)
        }
        else if(e.target.value==='addquestion'){
            setAdmin(false)
            setAddQuestion(true)
            setUpdateQuestion(false)
        }
        else{
            setAdmin(false)
            setAddQuestion(false)
            setUpdateQuestion(true)
        }
    }
    

    return (
        <div>
            <Navbar />
            {!loaded &&
                <div className="h-48 flex justify-center items-center">
                    <Loader size={96} />
                </div>
            }
            {loaded && <div className=" mt-8 flex flex-col md:flex-row   p-4">
                <div className="flex flex-col  mt-2 rounded shadow-lg p-4 bg-gray-200 mr-48  max-h-56">
                    <button className={`${admin?'bg-gradient-to-r from-gray-700 to-gray-500':'bg-gray-400'} bg-gray-400 border-2 rounded text-white p-2 my-2`} value="addadmin" onClick={handlePage}>Add Admin</button>
                    <button className={` ${addquestion?'bg-gradient-to-r from-gray-700 to-gray-500':'bg-gray-400'} rounded text-white p-2 my-2`} value="addquestion" onClick={handlePage}>Add Question</button>
                    <button className={` ${updatequestion?'bg-gradient-to-r from-gray-700 to-gray-500':'bg-gray-400'} rounded text-white p-2 my-2`} value="updatequestion" onClick={handlePage}>Update Question</button>
                </div>
                {admin && <AdminAddition/>}
                {addquestion && <QuestionAddition />}

                {updatequestion && id!==false && <QuestionUpdation id={id} updateId={updateId} />}
                {updatequestion && id===false &&<QuestionList updateId={updateId} />}
            </div>}
                {/* <AdminAddition/> */}
            {/* <Footer /> */}
        </div>
    )
}
