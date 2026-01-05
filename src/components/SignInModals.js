import axios from "axios"
import { useContext, useState,createContext, useRef } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


const SignInModal=({Wheycart})=>{
    let Navigate=useNavigate()
    console.log(Wheycart)
    let [WheyCartItem,SetWheyCartItem]=useState([])
    let LoginLoadingBox=useRef()
    let [showPassword,SetshowPassword]=useState(false)
    let [adminSIginBox,SetadminSigninBox]=useState(false)

    let [NewUser,SetNewUser]=useState({
        UserName:"",
        Password:"",
        Email:"",
        Phone:"",
        Age:""
    }) 
    let [loginUser,SetloginUser]=useState({
        Email:"",
        Password:""
    })
    let [WheyCartItems,SetWheyCartItems]=useState([])
    const ShowToastMeessege=(Success,Error)=>{
        if(Success!==undefined){
            toast.success(Success,{
                position:"top-right",
                className:"Login-toast-messege",
                pauseOnHover:false,
                draggable:true,
                autoClose:3000
            })
        }
        if(Error!==undefined){
            toast.error(Error,{
                position:"top-right",
                className:"Login-toast-messege-error",
                pauseOnHover:false,
                draggable:true,
                autoClose:3000
            })
            
        }

    }
    const signup=async ()=>{
        if(NewUser.UserName!=="" && NewUser.Email!=="" && NewUser.Password!=="" && NewUser.Phone!==""){
        let url=`http://localhost:3030/signup`
        let {data}=await axios.post(url,NewUser)
        if(data.status==true){
            let Success="Registration Successfull"
            ShowToastMeessege(Success,undefined)
            window.location.reload()
        }
        else{
            let Error="User Already Exists"
            ShowToastMeessege(undefined,Error)
            SetNewUser({
                UserName:"",
                Password:"",
                Email:"",
                Phone:"",
                Age:""
            })
        }
    }
    else{
        let Error="Please Fill All the Details"
        ShowToastMeessege(undefined,Error)
    }
    }
    const signin=async ()=>{
        if(loginUser.Email!=="" && loginUser.Password !== ""){
        let DumbbellLoadingBox=document.querySelector(".login-loading-box")
        DumbbellLoadingBox.classList.add("login-loading-box-show")
        let url=`http://localhost:3030/signin`
        let {data}=await axios.post(url,loginUser)
        if(data.status==true){
            let Success="Login Successfull"
            DumbbellLoadingBox.classList.remove("login-loading-box-show")
            ShowToastMeessege(Success,undefined)
            sessionStorage.setItem("UserId",data.id)
            window.location.reload()
        }
        else {
            let Error="UserName or Password Error"
            DumbbellLoadingBox.classList.remove("login-loading-box-show")
            SetloginUser({
                Email:"",
                Password:""
            })
        ShowToastMeessege(undefined,Error)
    }
    }
    else{
        let Error="Please Fill All the Details"
        ShowToastMeessege(undefined,Error)
    }
    
    }
    const Adminsignin=async ()=>{
        if(loginUser.Email!=="" && loginUser.Password !== ""){
        let DumbbellLoadingBox=document.querySelector(".login-loading-box")
        DumbbellLoadingBox.classList.add("login-loading-box-show")
        let url=`http://localhost:3030/Adminsignin`
        let {data}=await axios.post(url,loginUser)
        if(data.status==true){
            let Success="Admin Login Successfull"
            DumbbellLoadingBox.classList.remove("login-loading-box-show")
            ShowToastMeessege(Success,undefined)
            sessionStorage.setItem("AdminId",data.id)
            SetadminSigninBox(true)
            // setTimeout(()=>{
            //     window.location.reload()
            // },3500)
            setTimeout(()=>{
                // Navigate(`/admin/${data.id}`)
                window.location.replace(`/admin/${data.id}`)


            },4000)
            
        }
        else {
            let Error="UserName or Password Error"
            DumbbellLoadingBox.classList.remove("login-loading-box-show")
            SetloginUser({
                Email:"",
                Password:""
            })
        ShowToastMeessege(undefined,Error)
    }
    }
    else{
        let Error="Please Fill All the Details"
        ShowToastMeessege(undefined,Error)
    }
    
    }
    return(
        <>
        <ToastContainer/>
        {/*SIGNIN MODAL START */}
        <div className="modal fade" id="signin" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content signin-modal-content ">
            <section className="modal-body">
                <section className="signin-box-main d-lg-flex">
                    <section className="signin-image-box">
                        <img src="/images/loginimg.png" alt=""/>
                        <p className="signin-active-btn"><button className="text-danger">SIGN IN</button></p>
                        <p className="signup-active-btn"><button className="text-light" data-bs-toggle="modal" data-bs-target="#signup">SIGN UP</button></p>
                    </section>
                    <section className="signin-content-main">
                        <section className="login-loading-box">
                            <span className="fa-solid fa-dumbbell"></span>
                        </section>
                        <button className="model-cancel-btn fa-solid fa-xmark"  data-bs-dismiss="modal" area-label="close"></button>
                        
                        <section className="login-crendintials-box">
                            
                            <div><label htmlFor="signin-username">EMAIL</label></div>
                            <div><input type="text" id="signin-username" className="login-username signin-username-valid" value={loginUser.Email} onChange={(event)=>SetloginUser({...loginUser,Email:event.target.value})} /></div>
                            <div><label htmlFor="signin-password">PASSWORD</label></div>
                            <div className="show-password-icon-box signin-password-valid"><input type={showPassword==false ? "password" : "text"} id="signin-password" className="login-password" value={loginUser.Password} onChange={(event)=>SetloginUser({...loginUser,Password:event.target.value})} />
                            {
                                showPassword==false ? (
                                    <>
                                    <button className="fa-regular fa-eye-slash show-password-icon" onClick={()=>SetshowPassword(true)}></button>
                                    </>
                                ):(
                                    <>
                                    <button className="fa-regular fa-eye show-password-icon" onClick={()=>SetshowPassword(false)}></button>
                                    </>
                                )
                            }
                        </div>
                            
                            
                            
                            
                            <section className="rememberme-box d-flex">
                                <section className="d-flex slider-btn-box align-items-center">
                                    <div className="slider-box">
                                        <input type="checkbox" id="slider-checkbox"/>
                                        <label htmlFor="slider-checkbox"></label>
                                    </div>
                                    <p className="ms-3 remember-text  mt-3">Remember me</p>
                                </section>

                                <section className=" d-flex align-items-end">
                                    <p className="forget-password-text">Forgot Password?</p>
                                </section>

                            </section>
                            <section className="adminLogin-btn">
                                <button onClick={Adminsignin}>Login as Admin</button>
                            </section>

                        </section>
                        <section className="LetMeIn-btn-box d-flex">
                            <section className="let-me-in-text d-flex justify-content-center align-items-center">LET ME IN</section>
                            <section className="let-me-in-btn-box"><button className="fa-solid fa-greater-than"  onClick={signin}></button></section>
                            {/* onClick={signin} */}

                        </section>
                        
                    </section>
                </section>
                
            </section>
          </div>
        </div>
      </div>
    {/*SIGNIN MODAL END */}
    {/*SIGNUP MODAL START */}
    <div className="modal " id="signup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content signin-modal-content ">
            <section className="modal-body">
                <section className="signin-box-main d-lg-flex">
                    <section className="signin-image-box">
                        <img src="./images/loginimg.png" alt=""/>
                        <p className="signin-active-btn"><button className="text-light" data-bs-toggle="modal" data-bs-target="#signin">SIGN IN</button></p>
                        <p className="signup-active-btn"><button className="text-danger">SIGN UP</button></p>
                    </section>
                    
                    <section className="signin-content-main">
                    <section className="login-loading-box" ref={LoginLoadingBox}>
                            <span className="fa-solid fa-dumbbell"></span>
                        </section>
                    <button className="model-cancel-btn fa-solid fa-xmark"  data-bs-dismiss="modal" area-label="close"></button>
                        <section className="login-crendintials-box">
                            <div><label htmlFor="signup-username">USERNAME</label></div>
                            <div><input type="text" id="signup-username" className="login-username signup-username-valid"  value={NewUser.UserName} onChange={(event)=>SetNewUser({...NewUser,UserName:event.target.value})} /></div>
                            <div><label htmlFor="signup-email">EMAIL</label></div>
                            <div><input type="text" id="signup-email" className="login-password signup-email-valid" value={NewUser.Email} onChange={(event)=>SetNewUser({...NewUser,Email:event.target.value})} /></div>
                            <div><label htmlFor="signup-password">PASSWORD</label></div>
                            <div className="show-password-icon-box "><input type={showPassword==false ? "password" : "text"} id="signup-password" className="login-password signup-password-valid" value={NewUser.Password} onChange={(event)=>SetNewUser({...NewUser,Password:event.target.value})} />
                            {
                                showPassword==false ? (
                                    <>
                                    <button className="fa-regular fa-eye-slash show-password-icon" onClick={()=>SetshowPassword(true)}></button>
                                    </>
                                ):(
                                    <>
                                    <button className="fa-regular fa-eye show-password-icon" onClick={()=>SetshowPassword(false)}></button>
                                    </>
                                )
                            }
                            </div>
                            <div><label htmlFor="signup-phone">PHONE</label></div>
                            <div><input type="text" id="signup-phone" className="login-password signup-phone-valid" value={NewUser.Phone} onChange={(event)=>SetNewUser({...NewUser,Phone:event.target.value})} /></div>
                            
                            
                            
                            
                            <section className="rememberme-box d-flex">
                                <section className="d-flex slider-btn-box align-items-center">
                                    <p className="remember-text  eighteen-plus-text mt-3">Are you above 18 years age ?</p>
                                    <div className="slider-box ms-3">
                                        <input type="checkbox" id="slider-checkbox-signup" onChange={(event)=>{
                                            let AgeChecked=event.target.checked
                                            if(AgeChecked==true)SetNewUser({...NewUser,Age:18})
                                            else SetNewUser({...NewUser,Age:-18})
                                        }}/>
                                        <label htmlFor="slider-checkbox-signup"></label>
                                    </div>
                                </section>
                                <section className="d-flex slider-btn-box align-items-center">
                                </section>

                            </section>

                        </section>
                        <section className="LetMeIn-btn-box d-flex">
                            <section className="let-me-in-text d-flex justify-content-center align-items-center">SIGN ME UP</section>
                            <section className="let-me-in-btn-box"><button className="fa-solid fa-greater-than" onClick={signup}  ></button></section>
                            {/* onClick={signup} */}

                        </section>
                    </section>
                   
                </section>
                
            </section>
          </div>
        </div>
      </div>
    {/*SIGNUP MODAL END */}
    {/* PLEASE LOG IN MODAL START */}
{/* <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div> */}
    {/* PLEASE LOG IN MODAL END */}
        </>
    )
}
export default SignInModal