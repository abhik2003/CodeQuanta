import React, { useContext,useRef, useState } from 'react'
import { AuthContext } from '../../AuthContextProvider/AuthProvider'
import axios from 'axios'
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import Editor from './Editor';
import JoditEditor from 'jodit-react';
export default function QuestionAddition() {
    const editor = useRef(null);
    
    
    const [questionStatus, setQuestionStatus] = useState([false])
    const placeHolder = {
        cpp: "// Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
        py: "# Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
        c: "// Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
    };
    const [code, setCode] = useState(placeHolder["c"]);
    const [language, setLanguage] = useState("c");

    const languageMap = {
        cpp: [cpp()],
        py: [python()],
        c: [cpp()],
    };
    const [questions, setQuestions] = useState({
        statement: "",
        description: "",
        test_cases: [
            { input: "" }
        ],
        difficulty: "",
        checker_code: {
            code: "",
            language: "",
        },
    });
    const options = [
        { 'display': 'C++', 'value': 'cpp' },
        { 'display': 'C', 'value': 'c' },
        { 'display': 'Python', 'value': 'py' },

    ];

    const handleQuestions = (e) => {
        
        setQuestions({ ...questions, [e.target.name]: e.target.value })
        // console.log(questions)
    }

    const handleCheckerCode = (e, typ) => {
        if (typ === 0) {
            setQuestions({ ...questions, checker_code: { 'code': e.target.value, 'language': questions.checker_code.language } })
        }
        else {
            setQuestions({ ...questions, checker_code: { 'code': questions.checker_code.code, 'language': e.target.value } })
        }
    }

    const url = process.env.REACT_APP_API
    const { isAuthenticated, loaded } = useContext(AuthContext)



    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(questions)
        

        if (questions.difficulty === '') {
            setQuestionStatus([true, 'Set Question difficulty'])
            return
        }
        if (questions.checker_code.language === '') {
            setQuestionStatus([true, 'Set Checker code language'])
            return
        }
        if (questions.test_cases.length === 0) {
            setQuestionStatus([true, 'Set at least 1 test case'])
            return
        }


        axios.post(`${url}add-problems`, {
            ...questions,
            'id': isAuthenticated[1].id
        }).then((result) => {
            setQuestions({
                "statement": '',
                "description": '',
                "test_cases": [
                    { 'input': '' }
                ],
                "difficulty": '',
                "checker_code": {
                    'code': '',
                    'language': ''
                },

            })
            alert('question added successfully')
        }).catch((error) => {
            setQuestionStatus([true, error.message])
        })
    }
    const increaseTestCase = () => {
        let tc = questions.test_cases

        tc.push({ input: "" });

        setQuestions({ ...questions, test_cases: tc })
    }
    const reduceTestCase = (ind) => {
        let tc = questions.test_cases

        tc = tc.filter((tcase, index) => {
            return index != ind
        })

        setQuestions({ ...questions, test_cases: tc })
    }

    const handleTestCase = (e, ind) => {
        let tc = questions.test_cases
        tc[ind].input = e.target.value
        setQuestions({ ...questions, test_cases: tc })
    }
    return (
        <div className="form2  question-addition p-4  shadow rounded mx-2 md:mx-0">
            <h1 className="text-center p-2 text-2xl font-bold">Add a Question</h1>
            <hr />

            <form action="" onSubmit={handleSubmit}>
                <div className="my-2 sections">
                    <label className='py-2 text-xl font-bold text-center' htmlFor="statement">Statement of the question</label>

                    <input
                        type="text"
                        name="statement"
                        value={questions.statement}
                        onChange={handleQuestions}
                        placeholder="statement"
                        className="w-full h-12 px-3 py-2 rounded border
                                hover:bg-gray-200 mx-auto md:mx-0
                                border-blue-100 focus:outline-none focus:text-black"
                        required
                    />
                </div>
                <hr />
                <div className="my-4 sections">
                    <div className="flex difficulty items-center">
                        Select the difficulty:
                        <button className={`mx-2 px-2 py-1  rounded text-white bg-green-${questions.difficulty === 'easy' ? '600' : '200'}`} name='difficulty' value={'easy'} onClick={handleQuestions} type='button'>easy</button>
                        <button className={`mx-2 px-2 py-1 rounded text-white  bg-yellow-${questions.difficulty === 'medium' ? '600' : '200'}`} name='difficulty' value={'medium'} onClick={handleQuestions} type='button'>medium</button>
                        <button className={`mx-2 px-2 py-1 rounded text-white  bg-red-${questions.difficulty === 'hard' ? '600' : '200'}`} name='difficulty' value={'hard'} onClick={handleQuestions} type='button'>hard</button>
                    </div>
                </div>
                <hr />

                <div className="my-2 sections py-3">
                    <label className='py-2 text-xl font-bold text-center' htmlFor="description">Description of the question (including the test-cases)</label>
                    <JoditEditor
                      ref={editor}
                      value={questions.description}
                      onChange={newContent=>setQuestions({...questions,description:newContent})}
                      
                    />
                    
                    {/* <textarea

                        name="description"
                        value={questions.description}
                        onChange={handleQuestions}
                        placeholder="description"
                        rows={10}

                        className=" w-full px-3 py-2 rounded border
                                 hover:bg-gray-200 mx-auto md:mx-0
                                 border-blue-100 focus:outline-none focus:text-black"
                        required
                    /> */}
                </div>
                <hr />
                <div className="my-2 sections py-3">
                    <h2 className='text-center text-xl'>Enter the test cases</h2>
                    <div className="test-cases my-2">
                        {questions.test_cases.map((tcase, index) => {
                            return (
                                <div className="flex flex-col md:flex-row items-center justify-between my-2">
                                    <label htmlFor="test_case">Input: </label>
                                    <textarea
                                        // type="text"
                                        name="test_case"
                                        value={questions.test_cases[index].input}
                                        onChange={(e) => { handleTestCase(e, index) }}
                                        placeholder="Put your test case"
                                        className="w-2/3 h-12 px-3 py-2 rounded border
                                hover:bg-gray-200 mx-auto md:mx-0
                                border-blue-100 focus:outline-none focus:text-black"
                                        required
                                    />
                                    <button className="bg-red-500 text-white p-2 rounded " type='button' onClick={() => { reduceTestCase(index) }}>Delete</button>
                                </div>
                            )
                        })}
                        <div className="flex justify-center">
                            <button className="bg-green-400 text-white p-2 rounded my-2" type='button' onClick={() => { increaseTestCase(1) }}>Add testcase</button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="flex flex-col py-2 justify-center">
                    <label className='py-2 text-xl font-bold text-center' htmlFor="checker_code">Checker code</label>
                    <div className="my-1 flex items-center">
                        <label htmlFor="select items-center">Select the language:</label>
                        <select className='border p-2 rounded mx-1' id="select" value={questions.checker_code.language} onChange={(e) => { handleCheckerCode(e, 1) }}>
                            <option value="">Select the language</option>
                            {options.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.display}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div
                        style={{ overflow: "scroll", height: "40vh" }}
                        className="rounded shadow "
                    >

                        <CodeMirror
                            value={questions.checker_code.code}
                            extensions={languageMap[language]}
                            onChange={(value, viewUpdate) => {
                                setQuestions({ ...questions, checker_code: { 'code': value, 'language': questions.checker_code.language } })

                            }}
                        />
                    </div>
                    {/* <textarea

                        name="checker_code"
                        value={questions.checker_code.code}
                        onChange={(e) => { handleCheckerCode(e, 0) }}
                        placeholder="description"
                        rows={10}

                        className=" w-full px-3 py-2 rounded border hover:bg-gray-200 mx-auto md:mx-0 border-blue-100 focus:outline-none focus:text-black"
                        required
                    /> */}
                </div>
                <div className="flex py-2 justify-center">
                    <button className="bg-green-500 text-white p-2 rounded">Submit</button>
                </div>
                {questionStatus[0] && <p className="my-2 text-red-500 text-center font-bold">{questionStatus[1]}</p>
                }
            </form>
        </div>
    )
}
