import axios from "axios"
import { useEffect, useRef, useState } from "react"
import {useNavigate} from "react-router-dom"
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
const Bmicalculator=()=>{
    let Navigate=useNavigate()
    let [ButtonVal,SetButtonVal]=useState([0,1,2,3,4,5,6,7,8,9])
    let [OnOffbtn,SetOnoffbtn]=useState(false)
    let [HWButtonState,SetHWButtonState]=useState(null)
    let [WeightValue,SetWeightValue]=useState("")
    let [HeightValue,SetHeightValue]=useState("")
    let [BmiFinalResult,SetBmifinalResult]=useState()
    let [GifImage,SetGifImage]=useState(false)
    let [BmiResultText,SetBmiResultText]=useState("")
    let [chatBotQuestion,SetChatBotQuestion]=useState({
        question:""
    })
    // let [chatBotDisplay,SetChatBotDisplay]=useState(true)
    let [chatBotResult,SetChatBotResult]=useState(false)
    let GifBoy=useRef()
    let [GifStyle,SetGifStyle]=useState({
        animation:"",
        
    })
    let HeightInput=useRef()
    let WeightInput=useRef()
    const WeightValueSetting=(number)=>{
        if(WeightValue.length<3){
            SetWeightValue(`${WeightValue}`+`${number}`)

        }
    }
    const HeightValueSetting=(number)=>{
        if(HeightValue.length<3){
            SetHeightValue(`${HeightValue}`+`${number}`)
        }
    }
    const BMITextResult=()=>{
        if(BmiFinalResult<=18){
            SetBmiResultText("Under weight")
            SetGifStyle({...GifStyle,animation:"Underweight 2s forwards  linear"})

        }
        if(BmiFinalResult>18 && BmiFinalResult<=25){
            SetBmiResultText("Healthy weight")
            SetGifStyle({...GifStyle,animation:"Healthyweight 2s forwards  linear"})
        }
        if(BmiFinalResult>25){
            SetBmiResultText("Obesity")
            SetGifStyle({...GifStyle,animation:"Overweight 2s forwards  linear"})
        }
        setTimeout(()=>{
    SetGifImage(false)
    },3000)

    }
    const BMIresult=()=>{
        if(HeightValue!=="" && WeightValue!==""){
            let Height=Number(HeightValue)
            let Weight=Number(WeightValue)
            let Meter=Height/100
            let result=Weight/(Meter*Meter)
            SetBmifinalResult(Math.round(result))
            SetGifImage(true)
        }
    }
    const GetChatBotanswer=async ()=>{
        if(chatBotQuestion.question!==""){
        let chatBotBox=document.querySelector(".chatbot-answer-container")
        const Mypromise=new Promise(async(resolve)=>{
            let url=`http://localhost:3030/gemini`
            let {data}=await axios.post(url,chatBotQuestion)
            resolve(data)
            // SetChatBotResult(data.answer)
            if(data.answer!==""){
                chatBotBox.innerHTML=data.answer
                SetChatBotResult(true)

            }

        })
        toast.promise(Mypromise, {
            pending: "Wait For Getting results",
            success: "Result Gotted",
            error: "error Occured",
          });
        }

    }
    useEffect(()=>{
        BMITextResult()

    },[BmiFinalResult])
    return <>
    <ToastContainer/>
    {/* <section className="bmi-gif-container w-100 bg-success">
    <img src="/images/newbmiboy.gif" alt=""/>

    </section> */}
    <section className="bmi-page-main w-100 d-flex">
        <section className="w-50 bmi-box-container">
            <button className="chatbot-gid-btn" onClick={()=>{
                let chatBox=document.querySelector(".bmi-chatbot-container")
                chatBox.classList.remove("bmi-chatbot-container-hide")
                chatBox.classList.add("bmi-chatbot-container-show")

            }}>
                <img src="/images/chatbot.gif" alt="" />
            </button>
            <section className="bmi-heading w-100">
                <p>BMI CALCULATOR <span className="bi bi-calculator-fill"></span> </p>
                <button className="bi bi-house-fill" onClick={()=>{Navigate("/")}}></button>
            </section>
            <section className="bmi-box-main w-100">
                <div className="bmi-calculator">
                    <div className="bmi-calculator-container">
                    <section className="d-flex py-2 px-3">
                        <div className="w-50">
                            <div className="calc-name">BMI CALC</div>
                            <div className="calc-name-child">p <sup>2</sup> fitness</div>
                        </div>
                        <div className="calc-solar-panel w-50">

                        </div>
                    </section>
                    <section className="calc-display  d-flex justify-content-center align-items-center">
                        <div className="calc-welcome-text"></div>
                        <section className="calc-input-hide">
                        {
                                BmiFinalResult===undefined ? <>
                        <div className="d-flex calc-display-inputContainer">
                        <div>
                        <div className="d-flex justify-content-center align-items-center pt-3 fs-4">HEIGHT (cm)</div>
                        <input type="text" className="w-100" placeholder="00" readOnly ref={HeightInput} value={HeightValue}/>
                        </div>
                        <div>
                            <div className="d-flex justify-content-center align-items-center pt-3 fs-4">WEIGHT (kg)</div>
                        <input type="text" name="" id="" className="w-100" placeholder="00" readOnly ref={WeightInput} value={WeightValue}/>
                        </div>
                        </div>
                                </> : <>
                                <div className="bmi-result-box">
                                    <p>You Are in {BmiResultText}</p>
                                    <p>BMI result:{BmiFinalResult}</p>
                                    <p style={{fontSize:"15px"}}>Click AC Button to calculate Again</p>
                                </div>
                                </>
                        }
                        </section>
                        <div>

                        </div>
                    </section>
                    <section className="calc-on-btn-container d-flex justify-content-center align-items-center py-3">
                        <img src="/images/calcbtnNew.png" alt="" />
                        <div className="on-btn-container">
                            <div className="d-flex justify-content-center align-items-center">ON</div>
                            <input type="checkbox" id="onoff"  className="onoffinput" onChange={(event)=>{
                                let inputDisplay=document.querySelector(".calc-input-hide")
                                let WelcomeText=document.querySelector(".calc-welcome-text")
                                if(event.target.checked===true){
                                    SetOnoffbtn(true)
                                    WelcomeText.classList.add("calc-input-show")
                                    WelcomeText.innerHTML="WELCOME!"
                                    setTimeout(()=>{
                                        WelcomeText.classList.remove("calc-input-show")
                                        inputDisplay.classList.add("calc-input-show")  
                                    },2500)

                                }
                                else{
                                    SetOnoffbtn(false)
                                    SetHWButtonState(null)
                                    SetBmifinalResult()
                                    SetHeightValue("")
                                    SetWeightValue("")
                                    inputDisplay.classList.remove("calc-input-show")
                                    WelcomeText.innerHTML="THANKYOU!" 
                                    WelcomeText.classList.add("calc-input-show")
                                    setTimeout(()=>{
                                        WelcomeText.classList.remove("calc-input-show") 
                                    },1500)

                                }
                            }}/>
                            <label htmlFor="onoff">
                            <img src="/images/onbtn.png" alt=""/>
                            </label>
                        </div>
                    </section>
                    <section className="mainBtn-container d-flex flex-wrap">
                        {
                            ButtonVal.map((item)=>{
                                return <>
                                <button className="mainBtn-logicbtn" onClick={()=>{
                                    if(OnOffbtn!==false){
                                        if(HWButtonState!==null){
                                            if(HWButtonState===0){
                                                HeightValueSetting(item)
                                            }
                                            else{
                                                WeightValueSetting(item)
                                            }

                                        }
                                    }
                                }}>{item}</button>
                                </>
                            })
                        }
                        <button className="mainBtn-operationbtn" onClick={()=>{
                            if(HWButtonState===0) SetHeightValue("")
                            if(HWButtonState===1) SetWeightValue("")
                        }}>DEL</button>
                        <button className="mainBtn-operationbtn" onClick={()=>{
                            SetHeightValue("")
                            SetWeightValue("")
                            SetBmifinalResult()
                            SetGifStyle({...GifStyle,animation:"ReturnBoyGo 3s linear forwards"})
                        }}>AC</button>
                        
                    </section>
                    <section className="heightWeight-btn-container">
                        <button className="w-50" onClick={()=>{
                            if(OnOffbtn!==false) SetHWButtonState(0)
                        }} style={HWButtonState===0 ?{background:"linear-gradient(rgb(238, 57, 57),red)"}:null}>HEIGHT</button>
                        <button className="w-50" onClick={()=>{
                            if(OnOffbtn!==false) SetHWButtonState(1)
                        }} style={HWButtonState===1 ?{background:"linear-gradient(rgb(238, 57, 57),red)"}:null}>WEIGHT</button>
                    </section>
                    <section className="result-calcbtn">
                        <button className="bi bi-arrow-right-circle" onClick={BMIresult}></button>
                    </section>
                    </div>
                </div>
            </section>
        </section>
        <section className="w-50 bmi-gifbox-main">
        {/* <section className="bmi-heading w-100">
                <p>RESULT <span className="bi bi-calculator-fill"></span> </p>
            </section> */}
        <section className="gif-container">
        <img src="/images/nature.png" alt="" />
        <section className="bmiboy-gif-container">
            {
                GifImage===false ? <>
                <img src="/images/newboy.png" alt="" ref={GifBoy} style={GifStyle}/>
                </> :
                <>
                <img src="/images/newbmiboy.gif" alt="" className="gifimage" style={GifStyle}/>
                </>
            }
            
            
        </section>
       
            <div className="Underweight-text">UnderWeight</div>
            <div className="Healthyweight-text">Healthy Weight</div>
            <div className="obesity-Text">Obesity</div>


        </section>
        <section className="Bmistatus-box d-flex justify-content-center align-items-center">
            <img src="/images/BmiStatus.png" alt="" />
        </section>
        <section className="bmi-chatbot-container">
            <div className=" d-flex justify-content-end chatbtn-child"><button className="bi bi-x-circle cancel-chatbot" onClick={()=>{
                let chatBox=document.querySelector(".bmi-chatbot-container")
                chatBox.classList.remove("bmi-chatbot-container-show")
                chatBox.classList.add("bmi-chatbot-container-hide")

            }}></button></div>
            <section className="w-100 d-flex justify-content-center align-items-center bmi-chat-input-container" style={chatBotResult===false ? {marginTop:"350px"} : {marginTop:"50px"}}>
            <input type="text" placeholder="Ask Your Doubt About Your Fitness...." value={chatBotQuestion.question} onChange={(event)=>{SetChatBotQuestion({...chatBotQuestion,question:event.target.value})}}/>
            <button className="bi bi-search" onClick={GetChatBotanswer}></button>
            </section>
            <section className="d-flex gap-3 mt-3 d-flex justify-content-center align-items-center chatbot-example">
                <p>How to gain Weight ?</p>
                <p>How to Lose Weight ?</p>
                <p>How to maintain Healthy Weight ?</p>
            </section>
            <section className="chatbot-answer-container" style={chatBotResult===false ? {display:"none"} : {display:"block"}}>
                


            </section>
        </section>
        </section>
    </section>
    </>
}
export default Bmicalculator