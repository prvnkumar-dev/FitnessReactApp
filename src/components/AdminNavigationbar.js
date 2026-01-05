import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut,Pie } from "react-chartjs-2"
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
const Adminnavigation=({top})=>{
    ChartJS.register(ArcElement, Tooltip, Legend,Title);
    let AdminActive=useRef()
    let ProductScroll=useRef()
    let Navigate=useNavigate()
    let BorderMove=useRef()
    let [userOrderTitle,SetUserOrderTitle]=useState(0)
    let [UserOrders,SetUserOrders]=useState([])
    let [UserDetails,SetUserDetails]=useState([])
    let [NavOptions,SetNavOptions]=useState(1)
    let [PageList,SetPageList]=useState([])
    let [SelectedPage,SetSelectedPage]=useState(1)
    let [Products,SetProducts]=useState([])
    let [updateStock,SetUpdateStock]=useState(null)
    let [NewStockqty,SetNewStockqty]=useState()
    let [NewProductStyle,SetNewProductStyle]=useState({
        left:"-75%"
    })
    let [Chartdatset,SetChartDataset]=useState({
        Whey:"",
        Gym:""
    })
    let [orderStatusTitle,SetOrderStatusTitle]=useState(["All Orders","Completed","Pending","Cancelled"])
    let [adminActiveDiv,SetadminActiveDiv]=useState({
        position:"absolute",
        transition:"2s",
        top:"100px",
    })
    let [filterOptions,SetfilterOptions]=useState({
        ProductName:0
    })
    const AdminActiveFun=(top)=>{

        AdminActive.current.style.top=`${top}px`
       

    }
    const GetUserDetails=async ()=>{
        let url=`http://localhost:3030/getuserdetails`
        let {data}=await axios.get(url)
        SetUserDetails(data.result)

    }

    const GetProductDetais=async ()=>{
        let url=`http://localhost:3030/filterWhey`
        let {data}=await axios.post(url,filterOptions)
        SetProducts(data.resultsort)
        let page=Math.ceil(data.resultsort.length/3)
        let arr=[]
        for(let i=1;i<=page;i++){
            arr.push(i)

        }
        SetPageList(arr)
        SetChartDataset({...Chartdatset,Whey:data.wheyDatasetresult,Gym:data.GymDatasetresult})
    }
    const SetPageResult=(index)=>{
        if((index+1)===(SelectedPage+1)){
           SetSelectedPage(index+1)
           ProductScroll.current.scrollLeft+=860

        }
        if((SelectedPage-1)===(index+1)){
            SetSelectedPage(index+1)
            ProductScroll.current.scrollLeft-=860
        }

    }
    const UpdateStocks=async (id)=>{
        let url=`http://localhost:3030/updateStock`
        let {data}=await axios.post(url,{id,NewStockqty,productname:filterOptions.ProductName})
        if(data.status===true){
            toast.success("Stock Updated Successfully",{
                position:"top-right",
                className:"Login-toast-messege",
                pauseOnHover:false,
                draggable:true,
                autoClose:3000
            })
        }
        SetUpdateStock(null)
        GetProductDetais()
    }
    const GetUserOrders=async ()=>{
        let url=`http://localhost:3030/getUserOrders`
        let {data}=await axios.get(url)
        SetUserOrders(data.result)

    }
    useEffect(()=>{
        GetProductDetais()

    },[filterOptions])
    return <>
    <ToastContainer/>
    <section className="admin-page-main d-flex">
    <section className="admin-nav-bar-main">
        <img src="/images/MainLogo.png" alt="" />
        <section className="admin-nav-linkContainer">
        <div><span className="bi bi-bag me-3"></span><Link className="admin-links" onClick={()=>{AdminActiveFun(75) 
        SetNavOptions(1)
        }}>Products</Link></div>
        <div><span className="bi bi-cart3 me-3"></span><Link className="admin-links" onClick={()=>{AdminActiveFun(185)
        SetNavOptions(2)
        GetUserOrders()
    }} 
        >Orders</Link></div>
        <div><span className="bi bi-person me-3"></span><Link className="admin-links" onClick={()=>{
            GetUserDetails()
            AdminActiveFun(290)
            SetNavOptions(3)
            SetfilterOptions({...filterOptions,ProductName:0})
        }}>Users</Link></div>
        <div><span className="bi bi-tag me-3"></span><Link className="admin-links" onClick={()=>{AdminActiveFun(400)
        SetNavOptions(4)}}>Coupens</Link></div>
        <section className="admin-activediv"  ref={AdminActive}></section>
        </section>
    </section>
    {
        NavOptions===1 ? <>
        <section className="admin-productpage admin-detailsection">
        <section className="product-name-borderActs-parent ">
                <section className="product-name-box d-flex">
                    <section className="product-wheyprotein w-50">
                        <button className="pro-but" onClick={(event)=>{
                             filterOptions.ProductName=0
                             SetfilterOptions({...filterOptions})
                            BorderMove.current.classList.remove("gym-name-box-cliks")
                            BorderMove.current.classList.add("supplement-name-box-cliks")
                            
                        }} ><img src="/images/supplementProduct.png" alt="" /></button>
                    </section>
                    <section className="product-gym-equipments w-50">
                        <button onClick={()=>{
                            filterOptions.ProductName=1
                            SetfilterOptions({...filterOptions})
                          BorderMove.current.classList.remove("supplement-name-box-cliks")
                          BorderMove.current.classList.add("gym-name-box-cliks")
                        }}><img src="/images/gymproduct.png" alt="" /></button>
                    </section>
                </section>
                <div className="product-name-borderActs " ref={BorderMove}></div>
        </section>
        <section className="p-3">
            <button className="admin-addnewProduct" onClick={()=>{
                SetNewProductStyle({...NewProductStyle,left:"0"})
            }}><span className="bi bi-plus-lg"></span> Add New product</button>
        </section>
        <section className="adminpage-product-main d-flex ">
            <section className="admin-product-container w-75 d-flex justify-content-evenly align-items-center" ref={ProductScroll}>
                {
                    Products.map((item,index)=>{
                        return<>
                <section className="admin-product-containerItems">
                <div className="admin-product-imageContainer">
                <img  src={filterOptions.ProductName===0 ? `/images/wheyProtein/${item.imageLink}`:`/images/GymEqipments/${item.imageLink}` } alt="" />
                </div>

                <div className="d-flex justify-content-between p-2">
                    <div><span className="bi-currency-rupee"></span>{item.price}</div>
                    <div>{item.ratings}<span className="bi bi-star-fill admin-productStar ms-1"></span></div>
                </div>
                <div className="px-2">
                    <div className="fs-5">{item.name}</div>
                    <div className="text-secondary">{filterOptions.ProductName===0 ?item.flavour :item.Designed_For}</div>
                </div>
                <div className="admin-product-stockBox d-flex justify-content-between  align-items-center px-2 pb-2">
                    <div className=""><span className="text-danger">{item.stock}</span> Stocks</div>
                    <div><span className="text-danger">{item.orders}</span> Orders</div>
                    <div>
                        {
                            updateStock!==index ? <>
                            <button className="admin-editstocks-btn" onClick={()=>{SetUpdateStock(index)}}><span className="bi bi-pencil text-danger"></span> Edit Stocks</button>
                            </> : null
                        }
                    
                        {
                            updateStock===index ? <>
                            <div>
                            <button className="edit-stockConfirm-btn" onClick={()=>{
                                UpdateStocks(item._id)
                            }}><span className="bi bi-check-lg"></span></button>
                            <input type="text" onChange={(event)=>{SetNewStockqty(event.target.value)}} className="stock-input"/>

                            </div>
                            </>
                            :null
                        }
                        
                        
                    </div>
                </div>
               

                </section>
                        </>
                    })
                }
                <section className="add-newProduct-box" style={NewProductStyle}>
                    <section className="new-product-container">
                        <section className="d-flex w-100 gap-3">
                        <section className="w-50">
                            <div>Name</div>
                            <input type="text" name="" id="" />
                            <div>price</div>
                            <input type="text" name="" id="" />
                            <div>image link</div>
                            <input type="text" name="" id="" />
                            <div>Food preference</div>
                            <input type="text" name="" id="" />
                            <div>country</div>
                            <input type="text" name="" id="" />
                            <div>usage</div>
                            <input type="text" name="" id="" />
                        </section>
                        <section className="w-50">
                        <div>ratings</div>
                            <input type="text" name="" id="" />
                            <div>quantity</div>
                            <input type="text" name="" id="" />
                            <div>flavour</div>
                            <input type="text" name="" id="" />
                            <div>Dieatary Preference</div>
                            <input type="text" name="" id="" />
                            <div>stock</div>
                            <input type="text" name="" id="" />
                            <div>orders</div>
                            <input type="text" name="" id="" />
                        </section>

                        </section>
                        <section>
                            <div>description</div>
                            <textarea name="" id=""  rows="2"></textarea>
                            <div>specification</div>
                            <textarea name="" id=""  rows="2"></textarea>
                            <div>ingredients</div>
                            <textarea name="" id=""  rows="2"></textarea>
                        </section>
                        <section className="d-flex w-100 gap-3">
                            
                            <section className="w-50">
                                <div>serving size</div>
                                <input type="text" name="" id="" />
                                <div>calories</div>
                                <input type="text" name="" id="" />
                                <div>fat</div>
                                <input type="text" name="" id="" />
                            </section>
                            <section className="w-50">
                            <div>carbohydrates</div>
                                <input type="text" name="" id="" />
                                <div>protein</div>
                                <input type="text" name="" id="" />
                                <div>sodium</div>
                                <input type="text" name="" id="" />
                            </section>
                        </section>
                        <section className="w-100 d-flex justify-content-evenly align-items-center">
                            <button>finish</button>
                        </section>
                        
                    </section>
                    <button className="bi bi-x-lg addnew-product-cancelBtn" onClick={()=>{
                        SetNewProductStyle({...NewProductStyle,left:"-75%"})
                    }}></button>

                </section>
            </section>
            <section className="product-chart-container w-25 d-flex justify-content-center align-items-center">
            <Doughnut
            
             data={
                {
                labels:["Gym Equipments","supplements"],
                datasets:[{
                    data:[Chartdatset.Gym,Chartdatset.Whey],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)']
                }]
            }
        }
        options={{
            plugins:{
                title:{
                    display:true,
                    text:"Fitness Product Stock Classification"
                }
            }
        }}
        
            />

        </section>
        </section>
        <section className="admin-products-pagelist d-flex w-75 justify-content-center align-items-center gap-2">
            {
                PageList.map((item,index)=>{
                    return<>
                    <button style={item===SelectedPage ? {backgroundColor:"red",boxShadow:"0 0 5px red",transform:"scale(1.2)"} : null} onClick={()=>{
                        SetPageResult(index)
                    }}>{item}</button>
                    </>
                })
            }
            
        </section>

        </section>
        </>:null
    }
    {
    NavOptions===2 ? <>
    <section className="admin-user-orders-page w-100">
    <section className="d-flex  align-items-center py-4">
        <div className="fw-bold fs-4">User Orders:</div>
        <div className="text-secondary ms-2 mt-1">{UserOrders.length} orders Found</div>
    </section>
    <section className="d-flex admin-user-titles py-3">
        {
            orderStatusTitle.map((item,index)=>{
                return <>
                <div style={userOrderTitle===index ? {color:"red",borderBottom:"1px solid red"} : null} onClick={()=>{SetUserOrderTitle(index)}}>{item}</div>
                </>
            })
        }
    </section>
    <section className="admin-userorder-table-container w-100 ">
        <table className="w-100">
            <tr className="admin-userorder-table-title">
                <td>No</td>
                <td>Order ID</td>
                <td>Product Name</td>
                <td>Order date</td>
                <td>Address</td>
                <td>Amount</td>
                <td>UserId</td>
                <td>Status</td>
            </tr>
            {
                UserOrders.map((item)=>{
                    return <>
                <tr className="admin-order-productDetailBox">
                <td>1</td>
                <td className="text-danger">{item.orderId}</td>
                <td className="d-flex justify-content-center align-items-center  w-100">
                    <div className="admin-userorder-productImage w-25"><img src={item.product===0 ? `/images/wheyProtein/${item.imageLink}`:`/images/GymEqipments/${item.imageLink}`} alt="" /></div>
                    <div className="w-75">{item.name}</div>
                </td>
                <td>{item.OrderDate}</td>
                <td>{item.Address}</td>
                <td className="fw-bold"><span className="bi bi-currency-rupee"></span>{item.price}</td>
                <td className="text-danger">{item.UserId}</td>
                <td>
                    <div>
                        <span className="admin-orderstatus-div">{item.status}</span>
                    </div>
                </td>
            </tr>
                    
                    </>
                })
            }
        </table>
    </section>

    </section>
    </> : null
}
    {
        NavOptions===3 ? <>
    
    <section className="admin-userpage admin-detailsection bg-light">
        <section className="w-100 d-flex userdetail-table-container">
            <div className="w-50 fs-3  usermangaement-text">User Management</div>
            <div className="w-50 d-flex justify-content-end">
                <div className="admin-userSearch">
                    <input type="text" placeholder="Search Users..."/>
                    <button className="bi bi-search"></button>
                </div>
            </div>
        </section>
        <section className="userdetail-table-container user-table">
            <table className="w-100 user-detail-table">
                <tr className="admin-user-heading-fixed">
                    <td className="user-table-headings">Name</td>
                    <td className="user-table-headings">Role</td>
                    <td className="user-table-headings">Actions</td>
                </tr>
                {
                    UserDetails.map((item)=>{
                        return <>
                    <tr className="user-details-main">
                    <td className="d-flex w-100 justify-content-center align-items-center gap-3">
                        <div className="w-50 d-flex justify-content-end">
                            <div className="user-details-main-profileimage">
                            <img src={item.ProfileImage===undefined ? `/images/userEmpty.png` : `/images/UserProfile/${item.ProfileImage}`} alt="" />
                            </div>
                        </div>
                        <div className="user-details-Name w-50">
                            <div>{item.UserName}</div>
                            <div className="user-detail-email">{item.Email}</div>

                        </div>

                    </td>
                    <td className=" user-detail-userrole">
                        <button style={item.Role==="User"?{background:"linear-gradient(green,rgba(0, 128, 0, 0.762))"}:{background:"linear-gradient(red,rgba(255, 0, 0, 0.751))"}}>{item.Role}</button>
                    </td>
                    <td>
                        <button className="user-remove-btn" style={item.Role==="Admin" ? {display:"none"}:null}>Remove <span className="bi bi-trash text-danger"></span></button>
                    </td>
                </tr>
                        </>
                    })
                }
                
            </table>
        </section>
        <section className="user-detail-footer pt-3">
            <div><span className="fw-bold text-danger">Total</span>:<span className="mx-1">{UserDetails.length-1}</span>Users</div>
        </section>
        
    </section>
    </> : null
}

    </section>
    </>
}
export default Adminnavigation