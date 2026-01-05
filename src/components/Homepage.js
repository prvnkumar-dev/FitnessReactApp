
import { createContext, useContext, useEffect, useState } from "react"
import NavigationBar from "./NavigationBar"
import SignInModal from "./SignInModals"
import axios from "axios"
import AOS from "aos"
import 'aos/dist/aos.css';
import Modal  from "react-bootstrap/Modal"
import ProductPage from "./ProductPage"
import HomeTracker from "./HomeTracker"
import { useNavigate } from "react-router-dom"
// let DummyWord=createContext()
// let WheyProteinContext=createContext()
// let WheyCartContext=createContext()
const Homepage=()=>{
    let Navigate=useNavigate()
    let [NavBarCartCount,SetNavBarCartCount]=useState()
    let [UserID,SetUserId]=useState(sessionStorage.getItem("UserId"))
    let [LoginAlertShow,SetLoginAlertShow]=useState()
    let [AddcartMouseHover,SetAddCartMouseHover]=useState()
    let [WheyProteinDetail,SetWheyProteinDetail]=useState([])
    let [FullWheyProteinDetail,SetFullWheyProteinDetail]=useState([])
    let [WheyCartItems,SetWheyCartItems]=useState([])
    let [Whey,SetWhey]=useState([])
    let [WheyProteinCartItems,SetWheyProteinCartItems]=useState({
        UserId:UserID,
        name:"",
        price:"",
        imageLink:"",
        ratings:"",
        description:"",
        specifications:"",
        quantity:"",
        id:"",
        product:""
    })
    // let [HomeWheyProteindetail,SetHomeWheyProteindetail]=useState([])
    const  WheyProteinDetails=async ()=>{
        let url=`http://localhost:3030/wheydetails`
        let {data}=await axios.get(url)
        SetFullWheyProteinDetail(data.result)
        SetWheyProteinDetail(data.result.slice(0,8))
        // WheyProteinDetail!== "" ? SetHomeWheyProteindetail(WheyProteinDetail.slice(0,8)):console.log("empty")
       
    }
    const  WheyProteinCartDetails=async ()=>{
        let url=`http://localhost:3030/wheycartdetails`
        let {data}=await axios.post(url,{UserID:UserID})
        // SetWheyCartItems(data.result)
        // console.log(data.result)
        SetWhey(data.result)
        SetNavBarCartCount(data.NavBarCartCount)

    }
    const WheyProteinScroll=(event)=>{
        let WheyBox=document.querySelector(".whey-protein-products-main")
        WheyBox.scrollLeft+=1600


    }
    const WheyProteinScrollLeft=()=>{
        let WheyBox=document.querySelector(".whey-protein-products-main")
        WheyBox.scrollLeft-=1600

    }
    const HandleSigninAlert=()=>SetLoginAlertShow(false)
    // const  AddWheyProteinCart=(name,price,imageLink,ratings,description,specifications,quantity,id)=>{
    //     SetWheyProteinCartItems({...WheyProteinCartItems,name:name,price:price,imageLink:imageLink,
    //         ratings:ratings,description:description,specifications:specifications,quantity:quantity,id:id})
        
    // }
    const AddWheyCart=async ()=>{
        let url=`http://localhost:3030/addWheycart`
        let {data}=await axios.post(url,{...WheyProteinCartItems})
        data.status===true ? console.log("Item Added Successfully") :  console.log("Item Not Added")
       
        SetWheyProteinCartItems({
            UserId:UserID,
            name:"",
            price:"",
            imageLink:"",
            ratings:"",
            description:"",
            specifications:"",
            quantity:"",
            id:"",
            product:""
        })
        WheyProteinCartDetails()
    }
    // const CartCheck=(id)=>{
    //     let res=WheyCartItems.filter((item)=>item.id==id)
    //     // let arr=[10,20,40]
    //     // let res=arr.includes(40)
    //     console.log(res)
    // }
    useEffect(()=>{
        WheyProteinDetails()
        if (UserID !==null){
            WheyProteinCartDetails()
            // console.log("User exists")
        }
        // console.log(sessionStorage.getItem("UserId"))
        AOS.init()
    },[])

    return(
    <>
    {/* <WheyProteinContext.Provider value={FullWheyProteinDetail}>
    <NavigationBar len={Whey.length}/>
    </WheyProteinContext.Provider> */}

    {/* <DummyWord.Provider value={dummy}>
    <SignInModal/>
    <NavigationBar len={WheyCartItems.length}/>

    </DummyWord.Provider> */}
    {/* <DummyWord.Provider value={dummy}>
        <SignInModal/>
    </DummyWord.Provider> */}
    {/* <WheyCartContext.Provider value={Whey}>

    </WheyCartContext.Provider> */}
      <NavigationBar len={NavBarCartCount}/>
    
    <SignInModal/>
    {/*HOMEPAGE START */}
    <section className="d-lg-flex">
        <section className="bg-image">
            {/* <img src=".//images/NewHomepageBG.jpg" alt="">  */}
            <video src="videos/homepageBG.mp4" muted autoPlay></video>
        </section>
        <section className="join-us-mainBox">
            <p className="Homepage-quote-text"><span className="text-danger">PUSH HARDER</span> THAN YESTERDAY</p>
            <p className="Homepage-quote-text">IF YOU <span className="text-danger">WANT</span> A </p>
            <p className="Homepage-quote-text"><span className="text-danger">DIFFERENT</span> TOMMORROW</p>
            <p className="Homepage-description-text">Welcome to <span>P<sup>2</sup>Fitness</span>, your ultimate destination for achieving your fitness goals and living a healthier, 
            more active lifestyle. Our innovative platform empowers you to take control of your fitness journey with precision and purpose</p>
            <button className="get-start-btn border-0 text-light  py-lg-3 px-lg-5 mt-lg-3" onClick={()=>{
                window.location.href="#home-tracker"
            }}>Get Started</button>
        </section>
    
        </section>
        <div className="dark-line"></div>
    <section className="wheyprotein-box">
        <section className="whey-protein-titlebox" data-aos="fade-up">
            <p className="our-protein-text fs-2 fw-bold text-light">OUR PROTEIN PRODUCTS</p>
            <p className="text-secondary">Fuel your body, feed your muscles, with the power of whey</p>
        </section>
        <section className="scroll-container">
        <section className="whey-protein-products-main d-flex" data-aos="fade-right">
            {
                WheyProteinDetail && WheyProteinDetail.map((item,index)=>{
                    return(
                        <>
                <section className="whey-product-container" key={item} onMouseOver={()=>SetAddCartMouseHover(index)} onMouseLeave={()=>{
                    SetAddCartMouseHover(null)
                    SetWheyProteinCartItems({
                        UserId:UserID,
                        name:"",
                        price:"",
                        imageLink:"",
                        ratings:"",
                        description:"",
                        specifications:"",
                        quantity:"",
                        id:""
                    })
                }} >
                <img src={`/images/WheyProtein/${item.imageLink}`} alt="" onClick={()=>{Navigate(`/productsdetails/${item._id}`)}}/>
                <p className="text-light name-text">{item.name.toUpperCase()}</p>
                <p className=" text-light price-text"><span className="fa-solid fa-indian-rupee me-1"></span>{item.price}</p>
                {
                   Whey.filter((cartitem)=>cartitem.id===item._id).length===0 && AddcartMouseHover===index && WheyProteinCartItems.name==="" ? (
                        <>
                 <section className="add-to-cart">
                 {/* <button onClick={()=>{
                    if(localStorage.getItem("UserId")==null)
                    else console.log("Loged in")
                 }}>Add To Cart</button> */}
                 <button onClick={()=>{
                    if(sessionStorage.getItem("UserId")==null){
                        SetLoginAlertShow(true)

                    }
                    else{
                        // AddWheyProteinCart(
                        // item.name,
                        // item.price,
                        // item.imageLink,
                        // item.ratings,
                        // item.description,
                        // item.specifications,
                        // item.quantity,
                        // item._id)
                        SetWheyProteinCartItems({...WheyProteinCartItems,name:item.name,
                            price:item.price,
                            imageLink:item.imageLink,
                            ratings:item.ratings,
                            description:item.description,
                            specifications:item.specifications,
                            quantity:item.quantity,
                            id:item._id,
                            product:0
                        })
                    }
                 }}>Add To Cart</button>
                </section>
                        </>
                    ) : null
                }
               <section className="add-to-cart">
                    {
                        WheyProteinCartItems.name !=="" && AddcartMouseHover===index ?(
                            <>
                            <button className="bg-success" onClick={AddWheyCart}>Confirm</button>
                            </>
                        ):null
                    }
                        
                </section>
                {
                   Whey.filter((cartitem)=>cartitem.id===item._id).length > 0 ?(
                        <>
                <div className="cart-added-image">
                    <img src="/images/CartTick.png" alt="" />
                </div>
                {
                    AddcartMouseHover===index ?(
                        <>
                <section className="add-to-cart">
                <button data-bs-toggle="modal" data-bs-target="#CartModal">View Cart</button>
                </section>
                        </>
                    ):null
                }
                        </>
                    ):null
                }
            </section>
                        </>
                    )
                })
            }
        </section>
        </section>
        <section className="scroll-btn-box d-flex justify-content-center align-items-center p-3">
        <button className="previous-scroll-btn " onClick={WheyProteinScrollLeft}>{"<<"}</button>
        <button className="forward-scroll-btn "  onClick={WheyProteinScroll}>{">>"}</button>
        </section>
        {/* <section className="see-all-products">
            <p>VIEW ALL PRODUCTS</p>
        </section> */}
    </section>
    {/* <button onClick={(event)=>{WheyProteinScrollLeft(event)}}>{">"}</button> */}
    <Modal show={LoginAlertShow} centered  animation={false} className="Please-signIn-box" data-aos="fade-up" onHide={HandleSigninAlert}>
        <Modal.Header className="Please-signIn-body Please-signIn-header justify-content-end">
            <button className="fa-solid fa-xmark" onClick={()=>HandleSigninAlert()}></button>
        </Modal.Header>
        <Modal.Body className="Please-signIn-body">
            <p className="Please-signIn-text">PLEASE SIGNIN TO EXPLORE MORE</p>
        </Modal.Body>
        <Modal.Footer className="Please-signIn-body">
            <button className="Please-signIn-button" onClick={()=>HandleSigninAlert()}>OK</button>
            
        </Modal.Footer>
    </Modal>
    <HomeTracker/>
   </>
   )

}
// export {WheyCartContext}
// export {WheyProteinContext}
// export {WheyProteinContext}
export default Homepage