import { useParams } from "react-router-dom"
import NavigationBar from "./NavigationBar"
import SignInModal from "./SignInModals"
import { useEffect, useState } from "react"
import axios from "axios"
const ProductDetails=()=>{
    let {productDetail}=useParams()
    let [WheyProductDetail,SetWheyProductDetail]=useState()
    const GetWheyProduct=async ()=>{
        let url=`http://localhost:3030/getWheyProduct/${productDetail}`
        let {data}=await axios.get(url)
        SetWheyProductDetail(data.result[0])
    }
    useEffect(()=>{
        GetWheyProduct()
    },[])
    return <>
    <NavigationBar/>
    <SignInModal/>
    {
        WheyProductDetail &&
    <section className="product-details-main-container">
        <section className="product-details-image-mainbox d-flex">
            <section className="w-50 product-details-detailContainer d-flex justify-content-end align-items-center">
                <div className="product-details-detailContainer-divmain">
                    <div className="product-details-name">{WheyProductDetail.name}</div>
                    <div><span className="bi bi-currency-rupee"></span>{WheyProductDetail.price}</div>
                    <div className="star-icon-container py-3">
                        {
                             WheyProductDetail.ingredients.map((item)=>{
                                return <>
                                <div><img src="/images/star.png" alt="" className="me-2"/>{item}</div>
                                </>
                            })
                        }
                    </div>
                    <div className="pb-3">{WheyProductDetail.description}</div>
                    {/* <div><button>LET ME BUY</button></div> */}
                </div>
            </section>
            <section className="w-50 product-details-image-container">
                <img src={`/images/WheyProtein/${WheyProductDetail.imageLink}`} alt="" />
            </section>
        </section>
        <section className="product-details-ingredient-detailBox d-flex justify-content-evenly">
            <div className="product-details-ingredient-divmain">
                <div className="fs-4 text-light">nutrients</div>
                <div>
                    <div>serving size: <span>{WheyProductDetail.nutrients.serving_size}</span></div>
                    <div>calories: <span>{WheyProductDetail.nutrients.calories}</span></div>
                    <div>total fat: <span>{WheyProductDetail.nutrients.total_fat}</span></div>
                    <div>cholestral: <span>{WheyProductDetail.nutrients.cholesterol}</span></div>
                    <div>sodium: <span>{WheyProductDetail.nutrients.sodium}</span></div>
                    <div>carbohydrates: <span>{WheyProductDetail.total_carbohydrates}</span></div>
                    <div>protein: <span>{WheyProductDetail.nutrients.protein}</span></div>

                </div>
            </div>
            <div className="product-details-ingredient-divmain">
                <div className="fs-4 text-light">description</div>
                <div>{WheyProductDetail.description}</div>
                <div>{WheyProductDetail.specifications}</div>
            </div>
            <div className="product-details-ingredient-divmain">
                <div className="fs-4 text-light">dietary preferences</div>
                <div>
                    <div>food preference: <span>{WheyProductDetail.food_preference}</span></div>
                    <div>dietary preferences: <span>{WheyProductDetail.dietary_preferences}</span></div>
                    <div>country of origin: <span>{WheyProductDetail.country_of_origin}</span></div>

                </div>
            </div>
            <div className="product-details-ingredient-divmain">
                <div className="fs-4 text-light">others</div>
                <div>
                <div>usage_timings: <span>{WheyProductDetail.usage_timings}</span></div>
                    <div>quantity: <span>{WheyProductDetail.quantity}</span></div>
                    <div>flavour: <span>{WheyProductDetail.flavour}</span></div>
                    <div>Ratings: <span>{WheyProductDetail.ratings}</span></div>

                </div>
            </div>

        </section>
    </section>
}
    </>
}
export default ProductDetails