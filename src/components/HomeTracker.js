import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Modal  from "react-bootstrap/Modal"

const HomeTracker=()=>{
    let Navigate=useNavigate()
    let [LoginAlertShow,SetLoginAlertShow]=useState()
    const HandleSigninAlert=()=>{
        SetLoginAlertShow(false)
    }
    return <>
    <div className="dark-line"></div>
    <section className="home-tracker-conatainer" id="home-tracker">
        <p className="d-flex">EXPL<button className="home-tracker-icon-container" onClick={()=>{
        if(sessionStorage.getItem("UserId")===null){
            SetLoginAlertShow(true)
        }
        else{
            Navigate("/workoutTracker")
        }
    }}>
            <img src="/images/workoutTrack.png" alt="" />
            <div className="home-tracker-animi">
                WORKOUT TRACKER
            </div>
            </button>
            RE <button className="home-tracker-icon-container ms-5" onClick={()=>{Navigate("/bmitracker")}}>
            <img src="/images/BMItrack.png" alt="" />
            <div className="home-tracker-animi">
                BMI CALCULATOR
            </div>
            </button>UR 
        TRA<button className="home-tracker-icon-container" onClick={()=>{
            if(sessionStorage.getItem("UserId")==null){
                SetLoginAlertShow(true)
            }
            else{
                Navigate("/foodTracker")}}
                
            }
            >
        <img src="/images/foodTrack.png" alt="" />
        <div className="home-tracker-animi">
                FOOD TRACKER
            </div>
        </button>KER</p>
        <section className="home-tracker-text-container">
        <p>Are you ready to take your fitness journey to the next level? 
            Join today and start making progress 
            towards the fittest, healthiest version of yourself</p>
    </section>
    </section>
    <Modal show={LoginAlertShow} centered  animation={false} className="Please-signIn-box" data-aos="fade-up" onHide={HandleSigninAlert}>
        <Modal.Header className="Please-signIn-body Please-signIn-header justify-content-end">
            <button className="fa-solid fa-xmark" onClick={()=>HandleSigninAlert()}></button>
        </Modal.Header>
        <Modal.Body className="Please-signIn-body">
            <p className="Please-signIn-text">PLEASE SIGNIN TO EXPLORE MORE</p>
        </Modal.Body>
        <Modal.Footer className="Please-signIn-body">
            <button className="Please-signIn-button" onClick={()=>HandleSigninAlert()}>ok</button>
            
        </Modal.Footer>
    </Modal>

    </>
}
export default HomeTracker