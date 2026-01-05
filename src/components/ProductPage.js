import NavigationBar from "./NavigationBar"
import SignInModal from "./SignInModals"
import Homepage from "./Homepage"
import { Link, useNavigate } from "react-router-dom"
import {  useEffect, useRef, useState } from "react"
import axios from "axios"
import { Modal } from "react-bootstrap"
import { Bounce, ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
const ProductPage=()=>{
    let [NavBarCartCount,SetNavBarCartCount]=useState()
    let Navigate=useNavigate()
    let [userLoginId,SetUserLoginId]=useState(sessionStorage.getItem("UserId"))
    let [LoginAlertShow,SetLoginAlertShow]=useState()
    let [whey,SetWhey]=useState([])
    let [AddCartItems,SetAddCartItems]=useState({
    })
    let [PageNumberCount,SetPageNumberCount]=useState([])
    let [lastprice,SetlastPrice]=useState([1,2,3,4,5])
    let [loopdrag,Setloopdrag]=useState([])
    let dragLine=useRef()
    let [foodtypeFilter,SetfoodtypeFilter]=useState([])
    let [drag,Setdrag]=useState({
        backgroundColor:"black",
        width:"0%",
        transition:".5s"
    })
    let [filterOptions,SetfilterOptions]=useState({
        PageNumber:1,
        ProductName:0
    })

    let [selectedDragPrice,SetselectedDragPrice]=useState([0])

    let [SearchItems,SetSearchItems]=useState([])
    let [SearchInput,SetSearchInput]=useState("")
    let [FullWheyProteinDetail,SetFullWheyProteinDetail]=useState([])
    let [CartStar,SetCartStar]=useState([1,2,3,4,5])
    let BorderMove=useRef()
    const HandleSigninAlert=()=>SetLoginAlertShow(false)
    const SearchProducts=(event)=>{
        
        let searchItem=event.target.value.toLowerCase()
        SetSearchInput(searchItem)

        let searchResult=FullWheyProteinDetail.filter((item)=>item.name.toLowerCase().includes(searchItem))
        SetSearchItems(searchResult.length > 0 ? searchResult : [{name:"No Products Found"}])

    }
    const FilteredWheyResult=(type,event,index)=>{
        let eventValue= event!==undefined ? event.target.value : null
        filterOptions.PageNumber=1
        switch(type){
            case "sort":
                filterOptions["sort"]=Number(eventValue)
                
                break
            case "dragsort":
                if(index>0){
                    if(filterOptions.ProductName==0){
                        filterOptions["dragsort"]=Number(index)*1000

                    }
                    else{
                        filterOptions["dragsort"]=Number(index)*3000
                    }
                }
                else{
                    if(filterOptions["dragsort"]!==undefined){
                        delete filterOptions.dragsort
                    }
                }
                
                break
            case "foodtype":
                if(event.target.checked==true){

                    if(filterOptions["foodtype"]===undefined){
                        filterOptions["foodtype"]=[eventValue]
                       
                    }
                    else{
                       let foodtypeIncludes=filterOptions["foodtype"].includes(eventValue)
                        if(foodtypeIncludes===false){
                            filterOptions["foodtype"]=[...filterOptions["foodtype"],eventValue]
                            
                        }
                    }
                }
                else{
                    let foodtypeFilter=filterOptions["foodtype"].filter((item)=>{
                        return item !==eventValue
                    })
                    if(foodtypeFilter.length>0){
                        filterOptions["foodtype"]=[...foodtypeFilter]
                    }
                    else{
                        delete filterOptions.foodtype
                    }
                    
                }
                break
            case "country":
                filterOptions["country"]=eventValue
                   
        }
        SetfilterOptions({...filterOptions})

    }
    const GetFilteredWheyData=async ()=>{
        let url=`http://localhost:3030/filterWhey`
        let {data}=await axios.post(url,filterOptions)
        SetFullWheyProteinDetail(data.result)
        SetPageNumberCount(data.PageNumberCount)
    }
    const  WheyProteinCartDetails=async ()=>{
        let url=`http://localhost:3030/wheycartdetails`
        let {data}=await axios.post(url,{UserID:userLoginId,ProductName:filterOptions.ProductName})
        SetWhey(data.result)
        SetNavBarCartCount(data.NavBarCartCount)

    }
    const AddWheyCart=async ()=>{
        let url=`http://localhost:3030/addWheycart`
        let {data}=await axios.post(url,{...AddCartItems})
            let Success="Item Added Successfully"
            toast.success(Success,{
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition:Bounce,
            })
        // }
       SetAddCartItems({})
       WheyProteinCartDetails()
    }
    useEffect(()=>{
        let UserId=sessionStorage.getItem("UserId")
        if(UserId!==null){
            WheyProteinCartDetails()
        }
    },[])
    useEffect(()=>{
        GetFilteredWheyData()
    },[filterOptions])
    useEffect(()=>{
        if(AddCartItems.name !==undefined){
        AddWheyCart()
        }
    },[AddCartItems])
    return(
        <>
        <section className="product-page-nav-bar">
        <NavigationBar len={NavBarCartCount}/>
        <SignInModal/>
        </section>
        <section className="Products-page-main bg-light d-flex">
            <section className="filter-box-main  w-25">
                <section className="filter-box bg-light w-25">
                    <section className="filter-icon-container d-flex gap-2 w-100 justify-content-center align-items-center">
                        <img src="/images/filter-icon.png" alt="" />
                        <p className="fw-bold m-0" >FILTERS</p>
                    </section>
                    <section className="filter-setting-box">
                        <p className="fw-bold ">PRICE</p>
                        <div className="mb-3"><input type="radio" name="pricedetail" id="LtoH" className="me-2" value={1} onChange={(event)=>{
                            FilteredWheyResult("sort",event)
                        }}/><label htmlFor="LtoH">Low To High</label></div>        
                        <div><input type="radio" name="pricedetail" id="HtoL" className="me-2" value={-1} onChange={(event)=>{
                            FilteredWheyResult("sort",event)}}/><label htmlFor="HtoL">High To Low</label></div>
                        {/* <section className="d-flex w-100 justify-content-between">
                        {
                            lastprice.map((item,index)=>{
                                return <>
                                <div className="price-drag-box" onClick={()=>{
                                    console.log(index*25)
                                    Setdrag({...drag,width:`${index*25}%`})
                                }}></div>
                                </>
                            })
                        }

                        </section> */}
                        {/* <div className="price-drag-line" style={drag} ref={dragLine}></div> */}
                        <section className="filter-ball-container-main mt-3">
                            <section className="d-flex justify-content-between filter-ball-container-main-child">
                                {
                                    lastprice.map((item,index)=>{
                                        return <>
                                        <div className="filter-drag-line-ball" onClick={()=>{
                                            FilteredWheyResult("dragsort",undefined,index)
                                            Setdrag({...drag,width:`${index*25}%`})
                                            if(selectedDragPrice.includes(index)==false){
                                                
                                                // selectedDragPrice.push(index)
                                                // SetselectedDragPrice([...selectedDragPrice])
                                                for(let i=0;i<=index;i++){
                                                    selectedDragPrice[i]=i
                                                    SetselectedDragPrice([...selectedDragPrice])
                                                }
                                            }
                                            else{
                                                let res=selectedDragPrice.filter((item)=>item<=index)
                                                
                                                SetselectedDragPrice([...res])
                                            }
                                            
                                        }} style={{backgroundColor:selectedDragPrice.includes(index)==true ? `black` : `grey` }}></div>
                                        </>
                                    })
                                }
                                
                            </section>
                            {
                                filterOptions.ProductName===0 ? <>
                            <section>
                                <div className="d-flex w-100 filter-drah-pricelist">
                                    <div className="w-100 d-flex justify-content-center">1000</div>
                                    <div className="w-100 d-flex justify-content-center">2000</div>
                                    <div className="w-100 d-flex justify-content-center">3000</div>
                                    <div className="w-100 d-flex justify-content-center">4000</div>
                                </div>
                                <div className="filter-drag-line">
                                    <div className="filter-drag-line-child" style={drag}></div>
                                </div>
                            </section>
                                </> :
                                <>
                                <section>
                                <div className="d-flex w-100 filter-drah-pricelist">
                                    <div className="w-100 d-flex justify-content-center">3000</div>
                                    <div className="w-100 d-flex justify-content-center">6000</div>
                                    <div className="w-100 d-flex justify-content-center">9000</div>
                                    <div className="w-100 d-flex justify-content-center">{">10000"}</div>
                                </div>
                                <div className="filter-drag-line">
                                    <div className="filter-drag-line-child" style={drag}></div>
                                </div>
                            </section>
                                </>
                            }
                        </section>
                        {
                            filterOptions.ProductName==0 ? <>
                        <p className="mt-4 fw-bold">FOOD TYPE</p>
                        <div className="mb-3"><input type="checkbox" name="fooddetail" id="veg" className="me-2" value={"Vegetarian"} onChange={(event)=>{
                         FilteredWheyResult("foodtype",event)}}/><label htmlFor="veg">Vegetarian</label></div>        
                        <div><input type="checkbox" name="fooddetail" id="non-veg" className="me-2" value={"Non-Vegetarian"}onClick={(event)=>{
                          FilteredWheyResult("foodtype",event)   
                        }}/><label htmlFor="non-veg">Non Vegetarian</label></div>
                        <p className="mt-4 fw-bold">COUNTRY</p>
                        <div className="mb-3"><input type="radio" name="countrydetail" id="india" className="me-2" value={"India"} onChange={(event)=>{
                            FilteredWheyResult("country",event)
                        }}/><label htmlFor="india">India</label></div>        
                        <div><input type="radio" name="countrydetail" id="usa" className="me-2" value={"United States"}  onChange={(event)=>{
                            FilteredWheyResult("country",event)
                        }}/><label htmlFor="usa">USA</label></div>
                            </> : null
                        }
                    </section>
                    <section className="filter-clear-btnbox W-100">
                            <button onClick={()=>window.location.reload()}>CLEAR FILTER</button>
                        </section>
                </section>
            </section>

            <section className="products-container-main-box w-75">
                <section className="product-name-borderActs-parent">
                <section className="product-name-box d-flex">
                    <section className="product-wheyprotein w-50">
                        <button className="pro-but" onClick={(event)=>{
                             if(filterOptions.dragsort!==undefined) delete filterOptions.dragsort
                             if(filterOptions.sort!==undefined) delete filterOptions.sort
                             filterOptions.ProductName=0
                             SetfilterOptions({...filterOptions})
                             Setdrag({...drag,width:`0%`})
                             SetselectedDragPrice([0])
                            BorderMove.current.classList.remove("gym-name-box-cliks")
                            BorderMove.current.classList.add("supplement-name-box-cliks")
                            if(userLoginId!==null)WheyProteinCartDetails()
                        }} ><img src="/images/supplementProduct.png" alt="" /></button>
                    </section>
                    <section className="product-gym-equipments w-50">
                        <button onClick={()=>{
                             
                            if(filterOptions.dragsort!==undefined) delete filterOptions.dragsort
                            if(filterOptions.sort!==undefined) delete filterOptions.sort
                            if(filterOptions.foodtype!==undefined) delete filterOptions.foodtype
                            if(filterOptions.country!==undefined) delete filterOptions.country
                            filterOptions.ProductName=1
                            SetfilterOptions({...filterOptions})
                            Setdrag({...drag,width:`0%`})
                            SetselectedDragPrice([0])
                          BorderMove.current.classList.remove("supplement-name-box-cliks")
                          BorderMove.current.classList.add("gym-name-box-cliks")
                          if(userLoginId!==null)WheyProteinCartDetails()
                        }}><img src="/images/gymproduct.png" alt="" /></button>
                    </section>
                </section>
                <div className="product-name-borderActs" ref={BorderMove}></div>
                </section>
                <section className="product-page-searchBar-main w-100">
                    <div className="product-page-searchBar-container">
                    <div className="product-page-searchBar-absolute">
                        <div className="product-page-searchBar">
                            <button className="bi bi-search"></button>
                            <input type="text" name="" id="" placeholder="Search Products" value={SearchInput} onChange={(event)=>{SearchProducts(event)}}/>
                            <button className="bi bi-x-lg search-bar-xmark" onClick={()=>{
                                SetSearchInput("")
                                SetSearchItems([])
                            }}></button>
                        </div>
                        <div className="product-page-searchBar-resultBox">
                            <ul className="list-group">
                                {
                                    SearchItems.map((item)=>{
                                        return(
                                            <>
                                            <li className="list-group-item search-result-li">{item.name}</li>
                                            </>)

                                        
                                    })
                                }
                            </ul>
                        </div>

                    </div>
                    </div>

                </section>
                {
                    FullWheyProteinDetail.length > 0 ? <>
                <section className="product-page-whey-section d-flex">
                    {
                        FullWheyProteinDetail.map((item)=>{
                            return(
                                <>
                        <section className="product-page-whey-container">
                        <section className="product-page-whey-Imagecontainer"><img src={filterOptions.ProductName===0 ? `/images/wheyProtein/${item.imageLink}` : `/images/GymEqipments/${item.imageLink}`} alt="" onClick={()=>{
                            if(filterOptions.ProductName===0) Navigate(`/productsdetails/${item._id}`)
                        }}/>
                        {
                            whey.filter((cartitem)=>cartitem.id===item._id).length > 0 ? <>
                            <button><img src="/images/pinktick.png" alt="" /></button>
                            </> : <>
                            <button className="product-page-cartAdded" onClick={()=>{
                                if(sessionStorage.getItem("UserId")==null){
                                SetLoginAlertShow(true)
                                
                                }
                                else{
                                            AddCartItems["UserId"]=userLoginId
                                            AddCartItems["name"]=item.name
                                           AddCartItems["price"]=item.price
                                            AddCartItems["imageLink"]=item.imageLink
                                            AddCartItems["ratings"]=item.ratings
                                            AddCartItems["description"]=item.description
                                            AddCartItems["specifications"]=item.specifications
                                            AddCartItems["quantity"]=item.quantity
                                            AddCartItems["id"]=item._id
                                            AddCartItems["product"]=filterOptions.ProductName
                                            if(filterOptions.ProductName>0){
                                                AddCartItems["color"]=item.color
                                                AddCartItems["Designed_For"]=item.Designed_For
                                            }
                                            else{
                                                delete AddCartItems.color
                                                delete AddCartItems.Designed_For
                                            }
                                            SetAddCartItems({...AddCartItems})

                                    
                                    // else{
                                    //     SetGymCartItems({...GymCartItems,
                                            
                                    //         name:item.name,
                                    //         price:item.price,
                                    //         imageLink:item.imageLink,
                                    //         ratings:item.ratings,
                                    //         description:item.description,
                                    //         specifications:item.specifications,
                                    //         quantity:item.quantity,
                                    //         color:item.color,
                                    //         Designed_For:item.Designed_For,
                                    //         id:item._id
                                    //     })
                                    // }
                                }
                            }}><img src="/images/productCart.png" alt="" /></button>
                            </>
                        }
                        
    
                        </section>
                        <section className="cart-detail-box mt-4 p-4">
                        
                        <p className="cart-name-para">{item.name}</p>
                        <section className="d-flex justify-content-between text-secondary">
                            <p>{filterOptions.ProductName===0 ? item.flavour : item.Designed_For}</p>
                            <p><span className="bi bi-currency-rupee"></span>{item.price}</p>
                        </section>
                        <section className="d-flex">
                            {
                                CartStar.map(()=>{
                                    return(
                                        <>
                                        <img src="/images/cartstar.png" alt="" className="cart-star me-1"/>
                                        </>
                                    )
                                })
                                
                            }
                            
                        </section>
                        </section>
                    </section>

                                </>
                            )
                        })
                    }
                    
                    <section className="product-page-pagination d-flex  justify-content-center align-items-center gap-2 w-100 pb-4">
                        {
                            PageNumberCount.map((item,index)=>{
                                return <>
                                <button style={filterOptions.PageNumber===index+1 ?{backgroundColor:"Black",color:"white"} :{backgroundColor:"rgba(211, 211, 211, 0.515)"} } onClick={()=>{
                                    SetfilterOptions({...filterOptions,PageNumber:item})
                                }}>{item}</button>
                                </>
                            })
                        }
                

            </section>
                </section>
                    </>
                    :
                    <>
                <section className="product-not-found-main">
                    <img src="/images/sadEmoji.gif" alt="" />
                    <section className="d-flex justify-content-center align-items-center product-not-found-textbox ">
                    <p>Product Not Found For Applied Filter</p>
                    <button onClick={()=>{window.location.reload()}}>CLEAR FILTER</button>
                    </section>
                </section>
                    </>
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
            <button className="Please-signIn-button" onClick={()=>HandleSigninAlert()}>OK</button>
            
        </Modal.Footer>
    </Modal>

        </>
    )
}
export default ProductPage