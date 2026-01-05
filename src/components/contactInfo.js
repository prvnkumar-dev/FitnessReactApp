import { useEffect, useState } from "react"
import NavigationBar from "./NavigationBar"
import axios from "axios"
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
const ContactInfo=()=>{
    let Navigate=useNavigate()
    let [userLoginID,SetUserLOginID]=useState(sessionStorage.getItem("UserId"))
    let [UserDetails,SetUserDetails]=useState({
    UserName:"",
    Email:""
})
let [Query,SetQuery]=useState({
    UserId:"",
    UserName:"",
    Email:"",
    Queries:""
})
    const GetUserProfileImage=async ()=>{
        let url=`http://localhost:3030/userProfile/${userLoginID}`
        let {data}=await axios.get(url)
        SetUserDetails({...UserDetails,
            UserName:data.result[0].UserName,
            Email:data.result[0].Email,
        })
        SetQuery({...Query,
            UserId:userLoginID,
            UserName:data.result[0].UserName,
            Email:data.result[0].Email
        })
    }
    const SendUserQuery=async ()=>{
        if(Query.Queries!==""){
        let url=`http://localhost:3030/UserQuery`
        let {data}=await axios.post(url,Query)
        if(data.status===true){
            toast.success("Messege Sended To admin",{
                position:"top-right",
                className:"Login-toast-messege",
                pauseOnHover:false,
                draggable:true,
                autoClose:3000
            })
            setTimeout(()=>{
                Navigate("/")

            },3200)
            

        }
    }
    else{
        toast.error("Please Enter Your Query",{
            position:"top-right",
            className:"Login-toast-messege",
            pauseOnHover:false,
            draggable:true,
            autoClose:3000,
            closeOnClick:true
        })

    }
    }
    useEffect(()=>{
        GetUserProfileImage()
    },[])
    return <>
    <ToastContainer/>
    <NavigationBar/>
    <section className="dummy-space">

    </section>
    <section className="contact-parent">
    <section className="contact-bg-image">
        <img src="/images/contactbg.png" alt="" />
    </section>
    <section className="contact-main d-flex" >
        <section>
        <div className="d-flex justify-content-center align-items-center contact-getTouch-text">GET IN TOUCH</div>
        <section className="d-flex conatct-details-container">
        <section className="contact-details">
            <div>Email</div>
            <div className="contact-child-text">pfitness@gmail.com</div>
            <div>Mobile</div>
            <div className="contact-child-text">
                <p>+91 8072945908</p>
                <p>+91 9944179932</p>
            </div>
            <div className="d-flex contact-buttons">
                <button className="bi bi-facebook"></button>
                <button className="bi bi-instagram" onClick={()=>{
                    window.location.href="https://www.instagram.com/_arul_.7/"
                }}></button>
                <button className="bi bi-linkedin" onClick={()=>{
                    window.location.href="https://www.linkedin.com/in/arulm07/"
                }}></button>
                <button className="bi bi-telegram"></button>
            </div>
            <div className="contact-map-container" onClick={()=>{
                window.location.href="https://www.google.com/maps/place/Pulse+Fitness+Vellore/@12.9091077,79.1292438,17z/data=!3m1!4b1!4m6!3m5!1s0x3bad3967afcd984b:0xf77bf0eadbd6e948!8m2!3d12.9091077!4d79.1318187!16s%2Fg%2F11x0pd3lt3?entry=ttu&g_ep=EgoyMDI1MDMxMC4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D"
            }}>
                <img src="/images/map.png" alt="" />
            </div>

        </section>
        <section className="contact-sendText">
            <div className="mb-3">Leave as a messege</div>
            <div>Name</div>
            <div><input type="text" readOnly value={UserDetails.UserName}/></div>
            <div>Email</div>
            <div><input type="text" name="" id="" readOnly value={UserDetails.Email}/></div>
            <div>Admin Mobile</div>
            <div><input type="text" name="" id="" readOnly value={6369380943}/></div>
            <div>
                <textarea name="" id="" className="contact-query-box" placeholder="Write Your Query Here" rows={4} onChange={(event)=>{
                    SetQuery({...Query,Queries:event.target.value})
                }}></textarea>
            </div>
            <div className="d-flex justify-content-end align-items-center pt-2">
                <button className="contact-send-btn" onClick={SendUserQuery}>send</button>
            </div>

        </section>
        </section>
        </section>

    </section>
    </section>
    </>
}
export default ContactInfo