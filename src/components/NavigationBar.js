import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import CartModal from "./CartModalController";
import Modal from"react-bootstrap/Modal"


const NavigationBar=({len})=>{

    let Navigate=useNavigate()

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
    let [LoginAlertShow,SetLoginAlertShow]=useState()
    let [updatePersonaldata,SetupdatePersonaldata]=useState(true)
    let [ImageObjectId,SetImageObjectId]=useState("")
    let [userLoginID,SetUserLOginID]=useState(sessionStorage.getItem("UserId"))
    let [pageArrow,SetpageArrow]=useState(true)
    let [UserDetails,SetUserDetails]=useState({
        UserName:"",
        Email:"",
        Phone:"",
        Age:"",
        Height:"",
        Weight:"",
        Dob:""
    })
    let [ChangeUserData,SetChangeUserData]=useState({
        UserName:"",
        Phone:"",
        Height:"",
        Weight:"",
        Dob:""

    })
    let [userProfileimgName,SetUserProfileimgName]=useState(sessionStorage.getItem("UserProfile"))
    let FileUploadSection=useRef()
    let PlusIconBox=useRef()
    let userInputPencil=useRef()
    let [SelectedFile,SetSelectedFile]=useState()
    let [SelectedFileName,SetSelectedFileName]=useState("")
    const userProfileBoxShow=()=>{
        let UserProfileBox=document.querySelector(".user-profile-box")
        UserProfileBox.classList.remove("user-profile-box-hide")
        UserProfileBox.classList.add("user-profile-box-show")

    }
    const HandleSigninAlert=()=>SetLoginAlertShow(false)

    const LogoutUser=async ()=>{
        sessionStorage.removeItem("UserId")
         window.location.reload()
    }
    const SaveFileDetails=()=>{
        let FileChoosen=FileUploadSection.current.files[0]
        SetImageObjectId(URL.createObjectURL(FileChoosen))
        SetSelectedFile(FileChoosen)
        SetSelectedFileName(FileChoosen.name)
    }
    const GetUserProfileImage=async ()=>{
        let url=`http://localhost:3030/userProfile/${userLoginID}`
        let {data}=await axios.get(url)
        SetUserProfileimgName(data.result[0].ProfileImage)
        SetUserDetails({...UserDetails,
            UserName:data.result[0].UserName,
            Email:data.result[0].Email,
            Phone:data.result[0].Phone,
            Age:data.result[0].Age,
            Height:data.result[0].Height,
            Weight:data.result[0].Weight,
            Dob:data.result[0].Dob
        })
    }
    const SaveUserProfileImage=async (filename)=>{
        let url=`http://localhost:3030/SaveProfileImage`
        let {data}=await axios.post(url,{filename:filename,userLoginID:userLoginID})
        if(data.status==true){
            let Success="Profile Picture Updated Successfully"
            ShowToastMeessege(Success,undefined)
            sessionStorage.setItem("UserProfile",filename)
            setTimeout(()=>{
                window.location.reload()
            },3200)
            
        }

    }
    const UserProfileUpload=async ()=>{
        // console.log(FileUploadSection.current)
        let url=`http://localhost:3030/UserProfileUpload`
        let formData=new FormData()
        formData.append("file",SelectedFile)
        formData.append("filename",SelectedFileName)
        let {data}=await axios.post(url,formData)
        data.filename !=="" ? SaveUserProfileImage(data.filename) : console.log()

        
    }
    const plusIconShow=()=>{
        PlusIconBox.current.classList.add("profile-update-plus-icon-show")
    }
    const UpdatePersonaldata=()=>{
        SetupdatePersonaldata(false)
    }
    const UpdateUserData=async ()=>{
        let url=`http://localhost:3030/updateUser/${userLoginID}`
        let {data}=await axios.post(url,ChangeUserData)
        if(data.status==true){
            let Success="User Data Modified"
            ShowToastMeessege(Success,undefined)
        }
        else{
            let Error="User Data Modification Failed"
            ShowToastMeessege(undefined,Error)

        }
    }
    
    useEffect(()=>{
        let UserId=sessionStorage.getItem("UserId")
        if(UserId!==null){
            GetUserProfileImage()
            // WheyProteinCartDetails()
        }
    },[0])
    
    
    return(
        
        <>
        {/*NAVIGATION BAR START*/}
        <CartModal len={len}/>
        <ToastContainer/>
    <section className="navigation-main-box d-flex justify-content-between">
        <section className="logo-container">
            <section className="logo-paddingbox"><section className="logo-image-box"><img src={"/images/logonew.png"} alt=""/></section></section>
            <section className="fitness-text-box">FITNESS</section>
        </section>
        <section className="pageList-container d-flex">
            <Link to={"/"} className="Navbar-navigations">HOME</Link>
            {/* <Link  className="Navbar-navigations">ABOUT US</Link> */}
            <Link to={"/products"} className="Navbar-navigations">PRODUCTS</Link>
            <div className="home-page-parent">
            <Link className="Navbar-navigations" onClick={()=>{
                if(pageArrow===true){
                    SetpageArrow(false)
                }
                else{
                    SetpageArrow(true)
                }
            }}>PAGES  <span className="fa-solid fa-angle-down page-arrow" style={pageArrow===false ?{rotate:"180deg"} : null}></span></Link>
            {/* {
                pageArrow===false ? <> */}
             <ul className="list-group home-page-child" style={pageArrow===false ? {
                display:"block",
                top:"40px"
             } : {
                // display:"none"
                top:"-500px",
             }}>
            <li className="list-group-item" onClick={()=>{Navigate("/")}}>HomePage</li>
            <li className="list-group-item" onClick={()=>{Navigate("/products")}}>Products</li>
            <li className="list-group-item" onClick={()=>{
                if(userLoginID===null){
                    SetLoginAlertShow(true)
                }else{Navigate("/foodTracker")}
            }}>Food Tracker</li>
            <li className="list-group-item" onClick={()=>{
                if(userLoginID===null){
                    SetLoginAlertShow(true)
                }else{Navigate("/contact")}
            }}>contact</li>
                <li className="list-group-item" onClick={()=>{
                if(userLoginID===null){
                    SetLoginAlertShow(true)
                }else{Navigate("/workoutTracker")}
            }}>Workout Tracker</li>
                <li className="list-group-item" onClick={()=>{Navigate("/bmitracker")}}>BMI calculator</li>
                
            </ul>
                {/* </> : null
            } */}
            </div>
            {/* <Link className="Navbar-navigations" onClick={()=>{
                if(userLoginID===null){
                    SetLoginAlertShow(true)
                }
                else{
                    Navigate("/contact")
                }
            }}>CONTACT</Link> */}
            <Link className="Navbar-navigations" to={userLoginID!==null ? "/contact" : null} onClick={()=>{
                                if(userLoginID===null){
                                    SetLoginAlertShow(true)
                                }}}>CONTACT</Link>
            {/* <Link  className="Navbar-navigations">GYM</Link> */}
            <div className="cart-container"><button className="bi bi-minecart cart-btn" onClick={()=>{
                if(userLoginID===null){
                    SetLoginAlertShow(true)
                }
            }} data-bs-toggle={userLoginID!==null ? "modal" : null} data-bs-target={userLoginID!==null ? "#CartModal" : null}></button>
            {
                len > 0 ?(
                    <>
                    <div className="cart-count-box"><span>{len}</span></div>
                    </>
                ):null
            }
            </div>
        </section>
        <section className="signin-btn-container">
            {
                userLoginID==null ?(
                    <>
                    <button className="signin-btn" data-bs-toggle="modal" data-bs-target="#signin">SIGN IN</button>
                    </>
                ):(
                    <>
                    <button className="user-logged-in bi bi-person border-0" onClick={userProfileBoxShow}></button>
                    </>
                )
            }
            <button className="fa-solid fa-bars mobile-list-bar"></button>
        </section>
    </section>
    <section className="user-profile-box" >
        <section className="profile-banner-box">
            <img src="/images/profileBanner.png" alt="" />
            <div className="profile-image" onMouseOver={plusIconShow} onMouseLeave={()=>PlusIconBox.current.classList.remove("profile-update-plus-icon-show")}>
                <img src={ImageObjectId ==="" ?(
                    userProfileimgName ===undefined ? `/images/userEmpty.png` :
                     `/images/UserProfile/${userProfileimgName}`) : `${ImageObjectId}`} alt="" />
            </div>
            <div className="profile-update-plus-icon " ref={PlusIconBox}>
            <label htmlFor="imageupload" className="bi bi-plus"></label>
            </div>
        </section>
        <button className="fa-solid fa-xmark profile-box-cancel" onClick={()=>{
                    let UserProfileBox=document.querySelector(".user-profile-box")
                    UserProfileBox.classList.add("user-profile-box-hide")
                    UserProfileBox.classList.remove("user-profile-box-show")

                    SetImageObjectId("")
                    SetupdatePersonaldata(true)
                    SetChangeUserData({
                        UserName:"",
                        Phone:"",
                        Height:"",
                        Weight:"",
                        Dob:""
                    })

        }}></button>
        <section  className="update-profile-image">
            {
                ImageObjectId!=="" ? (
                    <>
        <button onClick={UserProfileUpload} className="update-profile-image-button">
        confirm to change Profile
        </button></>
                ) : null
            }
            {updatePersonaldata ===true ?<button className="update-personal-data-icon bi bi-pencil" onClick={UpdatePersonaldata}></button>:null}
        </section>
        {/* <button className="logout-btn" onClick={()=>{
            // sessionStorage.removeItem("UserId")
            // window.location.reload()
            LogoutUser()
        }} >Logout</button> */}
        {/* <img src={`${userProfileimg}`} alt="" /> */}
        <section className="input-form">
        {/* <label htmlFor="imageupload">Click</label> */}
        <input type="file" ref={FileUploadSection} id="imageupload" className="imageupload" onChange={(event)=>{
            // let url=`http://localhost:3030/imageupload`
            // let {data}=axios.post(url,event.target.files[0])
            // console.log(event.target.files[0].name)
           SaveFileDetails()
            
        }} accept="image/png,image/jpg"/>
        <section className="user-profile-details">
            <div>USER NAME</div>
            <div className="user-input-pencil-box"><input type="text" value={updatePersonaldata===true ? UserDetails.UserName : ChangeUserData.UserName} className="w-100" readOnly={updatePersonaldata}
            onChange={(event)=>SetChangeUserData({...ChangeUserData,UserName:event.target.value})}
            />
             {updatePersonaldata===false ? <span className="bi bi-pencil"></span> :null}
            </div>
            <div>EMAIL</div>
            <div className="user-input-pencil-box"><input type="text"  value={UserDetails.Email} className="w-100" readOnly/></div>
            <div>MOBILE</div>
            <div className="user-input-pencil-box"><input type="text"   value={updatePersonaldata===true ? UserDetails.Phone : ChangeUserData.Phone} className="w-100" readOnly={updatePersonaldata}
            onChange={(event)=>SetChangeUserData({...ChangeUserData,Phone:event.target.value})}
            />{updatePersonaldata===false ? <span className="bi bi-pencil"></span> :null}</div>
            <section className="d-flex justify-content-between">
                <div>
                    <div>HEIGHT</div>
                    <div className="user-height-input user-input-pencil-box"><input type="text" readOnly={updatePersonaldata}  value={updatePersonaldata===true ? UserDetails.Height : ChangeUserData.Height}
                    onChange={(event)=>SetChangeUserData({...ChangeUserData,Height:event.target.value})}
                    />
                    {updatePersonaldata===false ? <span className="bi bi-pencil"></span> : <div className="user-metrics  d-flex justify-content-center align-items-center">cm</div>}
                    </div>
                    
                </div>
                <div>
                    <div>WEIGHT</div>
                    <div className="user-height-input user-input-pencil-box"><input type="text"  readOnly={updatePersonaldata}  value={updatePersonaldata===true ? UserDetails.Weight : ChangeUserData.Weight}
                    onChange={(event)=>SetChangeUserData({...ChangeUserData,Weight:event.target.value})}
                    />
                    {updatePersonaldata===false ? <span className="bi bi-pencil"></span> : <div className="user-metrics  d-flex justify-content-center align-items-center">kg</div>}
                    </div>
                </div>
            </section>
            <section className="d-flex justify-content-between">
                <div className="w-100">
                    <div>DATE OF BIRTH</div>
                    <input type="date" readOnly={updatePersonaldata} className="date-of-birth"  value={updatePersonaldata===true ? UserDetails.Dob : ChangeUserData.Dob} 
                    onChange={(event)=>SetChangeUserData({...ChangeUserData,Dob:event.target.value})}/>
                    
                </div>
                <div>
                    <div>AGE</div>
                    <div className="user-input-pencil-box"><input type="text" value={UserDetails.Age > 0 ? "18+" : "18-"} readOnly/>
                    
                    </div>
                    
                </div>
            </section>

        </section>
        {
            updatePersonaldata===true ? 
            <section className="LetMeIn-btn-box LetMeIn-btn-box-userprofile d-flex">
            <section className="let-me-in-text d-flex justify-content-center align-items-center p-lg-2">LET ME OUT</section>
            <section className="let-me-in-btn-box"><button className="fa-solid fa-greater-than"  onClick={LogoutUser}></button></section>
            </section> :
                    <section className="LetMeIn-btn-box LetMeIn-btn-box-userprofile d-flex">
                    <section className="let-me-in-text d-flex justify-content-center align-items-center p-lg-2">LET ME UPDATE</section>
                    <section className="let-me-in-btn-box"><button className="fa-solid fa-greater-than" onClick={UpdateUserData} ></button></section>
                    </section>
        }
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
            <button className="Please-signIn-button" onClick={()=>HandleSigninAlert()}>Ok</button>
            
        </Modal.Footer>
    </Modal>
    {/*NAVIGATION BAR END */}
        </>
    )
}
export default NavigationBar