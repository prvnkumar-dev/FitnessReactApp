import { useEffect, useRef, useState } from "react"
import Modal from "react-bootstrap/Modal"
import { Link } from "react-router-dom"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
const CartModal=({len})=>{
    // let [cartLength,SetCartLength]=useState(len)
    let [month,Setmonth]=useState(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
    let [ExpectedDelivery,SetExpectedDelivery]=useState()
    let [orderedDate,SetOrderedDate]=useState()
    let lengthCart=len
    let Navigate=useNavigate()
    let quantityInput=useRef()
    let [UserId,SetUserId]=useState(sessionStorage.getItem("UserId"))
    let [userAddress,SetUSerAddress]=useState([])
    let [cartData,SetCartData]=useState([])
    let [TotalCartPrice,SetTotalCartPrice]=useState()
    let [DiscountPrice,SetDiscountPrice]=useState(0)
    let [FinalPrice,SetFinalPrice]=useState()
    let [itemQuantity,SetItemQuantity]=useState([])
    let [coupenList,SetCoupenList]=useState([])
    let [DeliveryAdress,SetDeliveryAddress]=useState({
        Name:"",
        Phone:"",
        Email:"",
        City:"",
        Address:"",
        Pincode:""
    })
    // let [OrderDetails,SetOrderDetails]=useState([{
    //     OrderId:"",
    //     Address:[{
    //         City:"",
    //         Address:"",
    //         Pincode:""
    //     }
            
    //     ],
    //     items:[],
    //     quantity:[],
    //     TotalAmount:"",
    //     DeliveryDate:""
    // }])
    let [OrderDetails,SetOrderDetails]=useState([])
    const GetFullCartData=async ()=>{
        let url=`http://localhost:3030/getCartDetails/${UserId}`
        let {data}=await axios.get(url)
        SetCartData(data.result)
        SetUSerAddress(data.userAddress[0])
        SetDeliveryAddress({...DeliveryAdress,Name:data.userAddress[0].UserName,Phone:data.userAddress[0].Phone,Email:data.userAddress[0].Email})
       let price=data.result.map((item)=>Number(item.price))
       if(price.length!==0){
        SetTotalCartPrice(price.reduce((prev,next)=>prev+next))

       }
       if(itemQuantity.length===0){
        for(let i=0;i<len;i++){
            itemQuantity.push(1)
            SetItemQuantity([...itemQuantity])
        }

       }

    }
    const IncreaseQunatity=(index,price)=>{
        itemQuantity[index]+=1
        SetItemQuantity([...itemQuantity])
        SetTotalCartPrice(TotalCartPrice+Number(price))
    }
    const DecreaseQunatity=(index,price)=>{
        if(itemQuantity[index]>1){
            itemQuantity[index]-=1
            SetItemQuantity([...itemQuantity])
            SetTotalCartPrice(TotalCartPrice-Number(price))

        }
    }
    const DeleteCartItems=async (id,Designed_For)=>{
        let url=`http://localhost:3030/deleteCartItem`
        let {data}=await axios.post(url,{id,Designed_For,UserId})
        if(data.status===true){
            toast.success("Item deleted Scuccessfully",{
                position:"top-right",
                className:"Login-toast-messege",
                pauseOnHover:false,
                draggable:true,
                autoClose:1500
            })
            setTimeout(()=>{
                window.location.reload()
            },1500)

        }

    }
    const MakePayment=async ()=>{
        if(DeliveryAdress.Name!=="" && DeliveryAdress.Email!=="" && DeliveryAdress.Phone!=="" && DeliveryAdress.City!=="" && DeliveryAdress.Address!=="" && DeliveryAdress.Pincode!==""){
        
        let url=`http://localhost:3030/createOrderId`;
        let {data}=await axios.post(url,{Amount:FinalPrice});
        let {order}=data;
    //     SetOrderDetails({...OrderDetails,
    //     OrderId:order.id,
    //     Address:[{
    //         City:DeliveryAdress.City,
    //         Address:DeliveryAdress.Address,
    //         Pincode:DeliveryAdress.Pincode
    //     }],
    //     items:[...cartData],
    //     quantity:[itemQuantity],
    //     TotalAmount:FinalPrice,
    //     DeliveryDate:ExpectedDelivery,
    //     OrderDate:orderedDate
    // })
       var options = {
        "key": "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard
        "amount":order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency":order.currency,
        "name": "P SQUARE FITNESS",
        "description": "Test Transaction",
        "image":`/images/logonew.png`,
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler":async function (response){
            // let saveUserOrder=MenuItems.filter(ordermenu=>ordermenu.quantity >0);
            let SendPaymentDetail={
                payment_id:response.razorpay_payment_id,
                order_id:response.razorpay_order_id,
                signature:response.razorpay_signature,
                // Userorder:saveUserOrder
                
               };
            
            try {
                   let url=`http://localhost:3030/verifyPayment`;
                   let {data}=await axios.post(url,SendPaymentDetail);
                   if(data.status==true){
                    let url=`http://localhost:3030/saveOrder/${UserId}`
                    cartData.map((item,index)=>{
                        OrderDetails[index]={
                            name:item.name,
                            price:item.price,
                            imageLink:item.imageLink,
                            orderId:order.id,
                            Address:DeliveryAdress.Address,
                            quantity:itemQuantity[index],
                            DeliveryDate:ExpectedDelivery,
                            status:"pending",
                            OrderDate:orderedDate,
                            product:item.product
                
                        }
                
                    })
                    SetOrderDetails({...OrderDetails})
                    let {data}=await axios.post(url,[...OrderDetails])
                    // let {data}=await axios.post(url,{
                    //     OrderId:order.id,
                    //     Address:{
                    //         City:DeliveryAdress.City,
                    //         Address:DeliveryAdress.Address,
                    //         Pincode:DeliveryAdress.Pincode
                    //     },
                    //     items:[...cartData],
                    //     quantity:itemQuantity,
                    //     TotalAmount:FinalPrice,
                    //     DeliveryDate:ExpectedDelivery,
                    //     OrderDate:orderedDate,
                    //     status:"pending"

                    // })
                    if(data.status===true){
                        toast.success("Order Has Been Placed Successfully",{
                            position:"top-right",
                            className:"Login-toast-messege",
                            pauseOnHover:false,
                            draggable:true,
                            autoClose:2000
                        })
                        setTimeout(()=>{
                            Navigate("/")
                            window.location.reload()

                        },2200)

                    }


                    // window.location.assign("/");
                   }
                   else{
                    alert("Payment failed");
                    window.location.assign("/");
                   }
                
            } catch (error) {
                console.log(error);
                
            }
    
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9000090000"
        },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
        rzp1.open();
}
else{
    toast.error("Please Fill All Delivery Details",{
        position:"top-right",
        className:"Login-toast-messege",
        pauseOnHover:false,
        draggable:true,
        autoClose:3000
    })
}
      
    }
    useEffect(()=>{
        if(UserId!==null){
            GetFullCartData()

        }
    },[lengthCart])
    return <>
    <ToastContainer/>
         <div className="modal fade" id="CartModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content cart-modal-content">
            <div className="modal-body cart-body">
                <section className="cart-page-header d-flex justify-content-between">
                    <div className="d-flex gap-4 justify-content-center align-items-center">
                        <div className="fs-5 font-bold-items">Your Cart</div>
                        <div className="cart-total-products">{len} Products</div>
                    </div>
                    <div className="d-flex gap-4 justify-content-center align-items-center">
                        <div className="cart-total-products">Total</div>
                        <div className="fs-5 font-bold-items reddit-text"><span className="bi bi-currency-rupee"></span>{TotalCartPrice}</div>
                    </div>
                </section>
                {
                    cartData.map((item,index)=>{
                        return <>
                    <section className="cart-container-final d-flex justify-content-evenly">
                    <div className="cart-image-container">
                    <img src={`/images/cartImages/${item.imageLink}`} alt="" />

                    </div>
                    
                    <div className="cart-description-box">
                        <div className="font-bold-items ">{item.name}</div>
                        <div className="cart-total-products">{item.quantity}</div>
                        <div className="cart-description-text">{item.description}</div>
                    </div>
                    <div className="cart-quantity-box d-flex">
                        <div className="d-flex justify-content-center align-items-center"><input type="text" value={itemQuantity[index]} readOnly ref={quantityInput}/></div>
                        <div className="d-flex justify-content-center align-items-center flex-column gap-2">
                            <div><button onClick={()=>{IncreaseQunatity(index,item.price)}}><img src="/images/up-arrow.png" alt="" /></button></div>
                            <div><button onClick={()=>{DecreaseQunatity(index,item.price)}}><img src="/images/down-arrow.png" alt="" /></button></div>
                        </div>
                    </div>
                    <div className="cart-flavour-box d-flex gap-1 align-items-start">
                        <div className="cart-total-products py-1">ratings</div>
                        <div className="cart-flavour-text">{item.ratings}</div>
                    </div>
                    <div className="cart-price-box">
                        <div className="h-50 reddit-text"><span className="bi bi-currency-rupee"></span>{item.price}</div>
                        <div className="h-50 d-flex justify-content-center align-items-center"><button className="bi bi-x-lg cart-xmark" onClick={()=>{DeleteCartItems(item.id,item.Designed_For)}}></button>
                        </div>
                    </div>

                </section>
                        </>
                    })
                }
                {
                    cartData.length==0 ? <>
                    <section className="cart-empty">
                    <img src="/images/cartEmpty.gif" alt="" />
                </section>
                    </>:null
                }
                
                <section className="cart-footer d-flex justify-content-between p-4">
                    <button className="cart-continue-shoppingBtn" data-bs-dismiss="modal" onClick={()=>{
                        setTimeout(()=>{
                            Navigate("/products")
                        },500)

                    }}>Continue Shopping</button>
                    {/* <Link data-bs-dismiss="modal" to={"/products"} className="cart-continue-shoppingBtn">Continue Shopping</Link> */}
                    {
                        cartData.length>0?<>
                        <button className="cart-proceed-btn" onClick={()=>{
                            let addressBox=document.querySelector(".cart-address-body")
                            addressBox.classList.add("cart-address-body-show")
                            SetFinalPrice(TotalCartPrice+40+DiscountPrice)
                            let Datefind=new Date
                            let date=Datefind.getDate()
                            let day=Datefind.getMonth()
                            SetExpectedDelivery(`${date+2} ${month[day]}`)
                            SetOrderedDate(`${date} ${month[day]}`)


                        }}>Next Step</button>
                        </>:null
                    }
                    
                </section>
                
            </div>
            <div className="modal-body cart-address-body" style={{margin:"0"}}>
                <section className="cart-address-container">
                    <div className="cart-address-titles d-flex w-100">
                        <div className="w-50">02 Address</div>
                        <div className="w-50 d-flex justify-content-end align-items-center"><button className="cart-gpback-btn" onClick={()=>{
                            let addressBox=document.querySelector(".cart-address-body")
                            addressBox.classList.remove("cart-address-body-show")
                        }}><span className="bi bi-arrow-left"></span> Go Back</button></div>
                    </div>
                    <div className="cart-address-input-container d-flex">
                        <section className="cart-inputs">
                            <div><input type="text" readOnly value={userAddress.UserName}/></div>
                            <div><input type="text" readOnly value={userAddress.Email}/></div>
                            <div><input type="text" placeholder="Enter City" value={DeliveryAdress.City} onChange={(event)=>{SetDeliveryAddress({...DeliveryAdress,City:event.target.value})}}/></div>
                            <div><input type="text" placeholder="Enter PinCode" maxLength={6} value={DeliveryAdress.Pincode} onChange={(event)=>{SetDeliveryAddress({...DeliveryAdress,Pincode:event.target.value})}}/></div>
                        </section>
                        <section className="cart-inputs">
                            <div><input type="text" placeholder="last Name"/></div>
                            <div><input type="text"  readOnly value={userAddress.Phone}/></div>
                            <div>  <textarea name="" id=""  rows="3" placeholder="Enter Address" value={DeliveryAdress.Address} onChange={(event)=>{SetDeliveryAddress({...DeliveryAdress,Address:event.target.value})}}></textarea></div>
                        </section>
                    </div>
                    <section>
                    <div className="d-flex cart-coupen-container">
                        <div className="cart-coupen-image-container"><img src="/images/coupen.png" alt="" /></div>
                        <div className="cart-coupen-viewbutton-container w-100"><button>View Availabel coupens</button></div>
                        <div className="d-flex justify-content-center align-items-center cart-coupen-arrow"><button onClick={()=>{
                            if(coupenList.length===0){
                                SetCoupenList([1,2,3])
                            }
                            else{
                                SetCoupenList([])
                            }
                        }}><div className="bi bi-caret-down-fill cart-arrow" style={coupenList.length>0 ? {transform:"rotate(180deg)"} : null}></div></button></div>
                    </div>
                    <ul className="list-group">
                        {
                            coupenList.map((item)=>{
                                return <>
                        <li className="list-group-item d-flex">
                        <div className="cart-coupen-image-container"><img src="/images/coupen.png" alt="" /></div>
                        <div className=" w-100 d-flex justify-content-center align-items-center">
                            <div className="w-75 ps-3"> Upto <span>10%</span> discount on orders above <span className="bi bi-currency-rupee">2999</span></div>
                            <div className="w-25 cart-coupen-apply-btn d-flex justify-content-end"><button>apply</button></div>
                            </div>

                        </li>
                                </>
                            })
                        }
                    </ul>

                    </section>
                    <section className="cart-summary-box w-100">
                    <div className="cart-address-titles mt-3">03 Order Summary</div>
                    <div className="mt-4">
                        <table>
                            <tr>
                                <td>Sub Total</td>
                                <td>:</td>
                                <td><span className="bi bi-currency-rupee"></span>{TotalCartPrice}</td>
                            </tr>
                            <tr>
                                <td>Delivery Charges</td>
                                <td>:</td>
                                <td><span className="bi bi-currency-rupee"></span>40</td>
                            </tr>
                            <tr>
                                <td>Discount</td>
                                <td>:</td>
                                <td><span className="bi bi-currency-rupee"></span>0</td>
                            </tr>
                            <tr>
                                <td>Delivery Expected</td>
                                <td>:</td>
                                <td>{ExpectedDelivery}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>:</td>
                                <td><span className="bi bi-currency-rupee"></span>{FinalPrice}</td>
                            </tr>
                        </table>
                    </div>
                    </section>
                    <section className="w-100 d-flex justify-content-center align-items-center py-5">
                    <div>
                        <button className="cart-proceed-topay-btn" onClick={MakePayment}>Proceed To Pay</button>
                    </div>
                    </section>

                </section>
                

            </div>
            </div></div></div>
            {/* data-bs-toggle={userLoginID===null ? "modal" : null} data-bs-target={userLoginID===null ? "#CartMadal" : null} */}
    </>
}
export default CartModal