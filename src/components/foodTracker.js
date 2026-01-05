import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut,Pie } from "react-chartjs-2"
import NavigationBar from "./NavigationBar"
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import AOS from "aos"
import 'aos/dist/aos.css';

const FoodTracker=()=>{
    ChartJS.register(ArcElement, Tooltip, Legend,Title);
    let [days,Setdays]=useState(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"])
    let [dayresult,Setdayresult]=useState()
    let [foodSearch,SetFoodSearch]=useState("")
    let [foodSearchresult,SetFoodSearchResult]=useState([])
    let [Recipedata,SetRecipedata]=useState([])
    let [Goal,SetGoal]=useState(null)
    let [userLoginID,SetUserLOginID]=useState(sessionStorage.getItem("UserId"))
    let [UserDetails,SetUserDetails]=useState({
        UserName:"",
        Weight:""
    })
    let [trackStatus,SetTrackStatus]=useState(false)
    let [modifyFoodNutrients,SetModifyFoodNutrients]=useState({
        name:"",
        calories:"",
        serving_size_g:"",
        fat_total_g:"",
        fat_saturated_g:"",
        protein_g:"",
        sodium_mg:"",
        potassium_mg:"",
        cholesterol_mg:"",
        carbohydrates_total_g:"",
        fiber_g:"",
        sugar_g:""
    })
    let [consumedNutrients,SetconsumedNutrinets]=useState({
        protein:0,
        carbs:0,
        fibre:0,
        calories:0,
        fat:0

    })
    let [TotalNutrients,SetTotalNutrients]=useState({
        protein:"",
        carbs:"",
        fibre:"",
        calories:"",
        fat:""

    })
    let [FoodList,SetFoodList]=useState({
        Breakfast:[],
        MorningSnack:[],
        Lunch:[],
        Dinner:[]
    })
    let [date,Setdate]=useState([])
    let [TotalGramCount,SetTotalGramCount]=useState([10,20,30,40,50,60,70,80,90,100])
    let [SelectedFoodGram,SetSelectedFoodGram]=useState([])
    const getTotalDays=(month,year)=>{
        return new Date(year,month,0).getDate()
        
    }
    const GetUserProfile=async ()=>{
        let url=`http://localhost:3030/userProfile/${userLoginID}`
        let {data}=await axios.get(url)
        SetUserDetails({...UserDetails,
            UserName:data.result[0].UserName,
            Weight:Number(data.result[0].Weight)

        })
    }
    const SetdateDay=()=>{
        let datefunction=new Date()
        let dayset=datefunction.getDay()
        Setdayresult(dayset)
        let dateset=datefunction.getDate()
        let dateIncrement=7-dayset
        let monthset=datefunction.getMonth()
        let yearset=datefunction.getFullYear()
        let totaldayspermonth=getTotalDays(monthset+1,yearset)
        let dateindex=0
        let overflowdate=1
        for(let i=dateset-dayset;i<=dateset+5;i++){
            if(i>totaldayspermonth){
                date[dateindex]=overflowdate
                overflowdate++
            }
            else{
                date[dateindex]=i

            }
            
            Setdate([...date])
            dateindex++
        }
    }
    const StoreRecipedata=async ()=>{
        let url=`https://api.api-ninjas.com/v1/recipe?query=${foodSearch}`
        let {data}=await axios.get(url,{
            headers:{
                "X-Api-Key":"xJfypf67WpHwF6LF/4X09A==BxqTkOVhcHj8hfus"

            }
        })
        SetRecipedata(data)
    }
    const GetFoodSearchResult=async ()=>{
        if(foodSearch !==""){
            // const Mypromise=async ()=>{
            //     let url=`https://api.api-ninjas.com/v1/nutrition?query=${foodSearch}`
            //     let {data}=await axios.get(url,{
            //         headers:{
            //             "X-Api-Key":"xJfypf67WpHwF6LF/4X09A==BxqTkOVhcHj8hfus"
            //         }
            //     })
            //     console.log(data)
            // }
            const Mypromise=new Promise(async(resolve)=>{
                let url=`https://api.api-ninjas.com/v1/nutrition?query=${"1g"+" "+foodSearch}`
                let {data}=await axios.get(url,{
                    headers:{
                        "X-Api-Key":"xJfypf67WpHwF6LF/4X09A==BxqTkOVhcHj8hfus"
                    }
                })
                if(data.length>0){
                    resolve(data)
                    SetFoodSearchResult(data[0])
                    SetModifyFoodNutrients({
                        name:data[0].name,
                        calories:data[0].calories,
                        serving_size_g:data[0].serving_size_g,
                        fat_total_g:data[0].fat_total_g,
                        fat_saturated_g:data[0].fat_saturated_g,
                        protein_g:data[0].protein_g,
                        sodium_mg:data[0].sodium_mg,
                        potassium_mg:data[0].potassium_mg,
                        cholesterol_mg:data[0].cholesterol_mg,
                        carbohydrates_total_g:data[0].carbohydrates_total_g,
                        fiber_g:data[0].fiber_g,
                        sugar_g:data[0].sugar_g
                    })
                    StoreRecipedata()

                }
                else{
                    resolve(data)
                    toast.error("Food Not Found",{
                        position:"top-right",
                        className:"Login-toast-messege",
                        pauseOnHover:false,
                        draggable:true,
                        autoClose:3000
                    })
                    
                }

            })
            toast.promise(Mypromise, {
                pending: "Getting Food Results",
                success: "Food Fetched Succesfully",
                error: "error Occured",
              });

            
        }
    }
    const ModifyFood=(gram)=>{
        SetModifyFoodNutrients({...modifyFoodNutrients,
            calories:foodSearchresult.calories*gram,
            serving_size_g:foodSearchresult.serving_size_g*gram,
            fat_total_g:foodSearchresult.fat_total_g*gram,
            fat_saturated_g:foodSearchresult.fat_saturated_g*gram,
            protein_g:foodSearchresult.protein_g*gram,
            sodium_mg:foodSearchresult.sodium_mg*gram,
            potassium_mg:foodSearchresult.potassium_mg*gram,
            cholesterol_mg:foodSearchresult.cholesterol_mg*gram,
            carbohydrates_total_g:foodSearchresult.carbohydrates_total_g*gram,
            fiber_g:foodSearchresult.fiber_g*gram,
            sugar_g:foodSearchresult.sugar_g*gram

            
        })
    }
    const AddFoodTolist=(value)=>{
        let Foodpayload={
            name:modifyFoodNutrients.name,
            serving_size_g:modifyFoodNutrients.serving_size_g,
            calories:modifyFoodNutrients.calories


        }
        SetconsumedNutrinets({...consumedNutrients,
            protein:Number(consumedNutrients.protein)+modifyFoodNutrients.protein_g,
            carbs:Number(consumedNutrients.carbs)+modifyFoodNutrients.carbohydrates_total_g,
            fibre:Number(consumedNutrients.fibre)+modifyFoodNutrients.fiber_g,
            calories:Number(consumedNutrients.calories)+modifyFoodNutrients.calories,
            fat:Number(consumedNutrients.fat)+modifyFoodNutrients.fat_total_g
        })
        if(Number(value)===0){
            FoodList.Breakfast.push(Foodpayload)
        }
        if(Number(value)===1){
            FoodList.MorningSnack.push(Foodpayload)
        }
        if(Number(value)===2){
            FoodList.Lunch.push(Foodpayload)
        }
        if(Number(value)===3){
            FoodList.Dinner.push(Foodpayload)
        }
        SetFoodList({...FoodList})
        SetFoodSearchResult([])
        SetSelectedFoodGram([])
        SetRecipedata([])
        SetFoodSearch("")
        toast.success("Food Added Successfully",{
            position:"top-right",
            className:"Login-toast-messege",
            pauseOnHover:false,
            draggable:true,
            autoClose:3000
        })
    }
    const TrackGoal=()=>{
        let weightinput=document.querySelector(".setgoal-weightinput")

        if(weightinput.value===""){
            toast.error("Please Update Weight In Profile",{
                position:"top-right",
                className:"Login-toast-messege",
                pauseOnHover:false,
                draggable:true,
                autoClose:3000
            })

        }
        if(Goal===null){
            toast.error("Please Set The Goal",{
                position:"top-right",
                className:"Login-toast-messege",
                pauseOnHover:false,
                draggable:true,
                autoClose:3000
            })

        }
        else{
            SetTrackStatus(true)
            SetTotalNutrients({...TotalNutrients,
                protein:UserDetails.Weight*0.8,
                carbs:Goal==="0" ? UserDetails.Weight*5 : UserDetails.Weight*2,
                fibre:UserDetails.Weight*1.2,
                calories:Goal==="0" ? 3000 : 2500,
                fat:Goal==="0" ? UserDetails.Weight*1.5 : UserDetails.Weight*1
            })
        }

    }
    useEffect(()=>{
        SetdateDay()
        GetUserProfile()
        AOS.init()
    },[])
    return <>
    <NavigationBar/>
    <ToastContainer/>
    <section className="bg-success py-5"></section>
    {
        trackStatus===true ? <>
    
    <section className="food-tracker-parent px-5">
        <section className="food-trcaker-chart-main d-flex w-100 py-5">
            <section className="w-25 d-flex justify-content-center ">
                <div>
                    <div className="mb-2">WELCOME <span className="text-danger">{UserDetails.UserName.toUpperCase()}</span></div>
                <div className="text-secondary" style={{fontSize:"13px"}}>PLAN YOUR DAY WITH OUR</div>
                <div className="fw-bold fs-1"><span className="text-danger">Food</span> Tracker</div>

                </div>
            </section>
            <section className="w-75 d-flex justify-content-center ">
                <div>
                <div className="fw-bold mb-3">PROGRESS YOUR DAY</div>
                <section className="d-flex">
                <div className="foodtracker-chart">
                <Doughnut
                
            
            data={
               {
               labels:[`Protein ${consumedNutrients.protein}g`],
               
               datasets:[{
                   data:[consumedNutrients.protein,TotalNutrients.protein-consumedNutrients.protein],
                   backgroundColor: [
                       '#c13e72',"transparent"],
                       borderColor:["transparent","lightgrey"],
                       borderWidth:1
                       
               }]
           }
       }
       
           />

                </div>
                <div className="foodtracker-chart">
                <Doughnut
                
            
            data={
               {
               labels:[`Carbohydrates ${consumedNutrients.carbs}g`],
               
               datasets:[{
                   data:[consumedNutrients.carbs,TotalNutrients.carbs-consumedNutrients.carbs],
                   backgroundColor: [
                       '#FFBF69',"transparent"],
                       borderColor:["transparent","lightgrey"],
                       borderWidth:1
                    // borderColor:["rgb(255, 99, 132)","lightgrey"],
                    // borderWidth:1,
                    
               }]
           }
       }
           />

                </div>
                <div className="foodtracker-chart">
                <Doughnut
                
            
            data={
               {
               labels:[`Fiber ${consumedNutrients.fibre}g`],
               
               datasets:[{
                   data:[consumedNutrients.fibre,TotalNutrients.fibre-consumedNutrients.fibre],
                   backgroundColor: [
                       '#80B918',"transparent"],
                       hoverBorderColor:["#80B918","lightgrey"], 
                       borderColor:["transparent","lightgrey"],
                       borderWidth:1
                    // borderColor:["rgb(255, 99, 132)","lightgrey"],
                    // borderWidth:1,
                    
               }]
           }
       }
       
           />

                </div>
                <div className="foodtracker-chart">
                <Doughnut
                
            
            data={
                
               {
                
    
               labels:[`Fat ${consumedNutrients.fat}g`],
               
               datasets:[{
                   data:[consumedNutrients.fat,TotalNutrients.fat-consumedNutrients.fat],
                   backgroundColor: [
                       '#FA6775',"transparent"],
                       
                       borderColor:["transparent","lightgrey"],
                       borderWidth:1

                    // borderColor:["rgb(255, 99, 132)","lightgrey"],
                    // borderWidth:1,
                    
               }]
           }
       }
           />

                </div>
                <div className="foodtracker-chart">
                <Doughnut
                
            
            data={
               {
               labels:[`Calories ${consumedNutrients.calories}cal`],
               
               datasets:[{
                   data:[consumedNutrients.calories,TotalNutrients.calories-consumedNutrients.calories],
                   backgroundColor: [
                       '#0077B6',"transparent"],
                       borderColor:["transparent","lightgrey"],
                       borderWidth:1
                    // borderColor:["rgb(255, 99, 132)","lightgrey"],
                    // borderWidth:1,
                    
               }]
           }
       }
       
           />

                </div>

                </section>
                </div>
            </section>

        </section>
        <section className="foodtracker-goalSettingmain  d-flex">
            <section className="foodtracker-datebox">
                <div className="text-secondary">Current Date</div>
                <div className="fs-3">{new Date().toDateString()}</div>
            </section>
            <section className="d-flex justify-content-evenly align-items-center foodtrcaker-Goalbox">
                <div>
                    <p className="goal-names">Goals</p>
                    <p className="text-primary">Today</p>
                </div>
                <div>
                    <p className="goal-names">Protein</p>
                    <p style={{color:"#c13e72",fontWeight:"500"}}>{TotalNutrients.protein} g</p>
                </div>
                <div>
                    <p className="goal-names">Carbohydrates</p>
                    <p style={{color:"#FFBF69",fontWeight:"500"}}>{TotalNutrients.carbs} g</p>
                </div>
                <div>
                    <p className="goal-names">Fibre</p>
                    <p style={{color:"#80B918",fontWeight:"500"}}>{TotalNutrients.fibre} g</p>
                </div>
                <div>
                    <p className="goal-names">Fat</p>
                    <p style={{color:" #FA6775 ",fontWeight:"500"}}>{TotalNutrients.fat} g</p>
                </div>
                <div>
                    <p className="goal-names">Calories</p>
                    <p style={{color:"#0077B6",fontWeight:"500"}}>{TotalNutrients.calories} cal</p>
                </div>
            </section>
        </section>
        <section className="py-5 d-flex justify-content-evenly">
            {
                days.map((item,index)=>{
                    return <>
            <div className="food-tracker-calender-imageBox" >
            <img src="/images/calender.png" alt="" />
            <div className="w-100 food-tracker-calenderText" style={dayresult===index ? {color:"red"} : null}>
            <div className="fs-3 fw-bold pt-3">{date[index]}</div>
            <p>{item}</p>
            </div>
        </div>
                    </>
                })
            }

        </section>
        <section className="foodTracker-searchBar-container" data-aos="fade-up">
            <section className=" foodtracker-searchbar-main">
                <section className="d-flex justify-content-center align-items-center ">
                <section className="foodtracker-searchbar">
                <input type="text" placeholder="Search Food here" value={foodSearch} onChange={(event)=>{SetFoodSearch(event.target.value)}}/>
                <div className="bi bi-search" onClick={GetFoodSearchResult}>

                </div>
            </section>

                </section>
                <section className="foodMeal-tracker-Box d-flex justify-content-evenly flex-wrap"  data-aos="fade-left">
                    <section className="foodMeal-tracker-container p-3" style={{background:"#F5F5DC",boxShadow:"0 0 5px #F5F5DC"}}>
                        <section className="d-flex justify-content-center align-items-center">
                        <div className="foodMeal-tracker-image">
                            <img src="/images/foodNutrient/breakfast.avif" alt="" />
                        </div>
                        </section>
                        <div className="fs-5 text-warning py-2 d-flex justify-content-center align-items-center">Breakfast</div>
                        <div className="added-food-items-box">
                            <ul className="list-group py-2">
                                {
                                     FoodList.Breakfast.map((item,index)=>{
                                        return <>
                                    <li className="list-group-item d-flex">
                                    <div className="w-50">
                                        <div className="food-name">{item.name}</div>
                                        <div>{item.serving_size_g} grams</div>
                                    </div>
                                    <div className="w-50 d-flex justify-content-end align-items-center">
                                        <div>{item.calories} Cal <button className="bi bi-trash"></button></div>
                                    </div>
                                </li>
                                        </>
                                    }) 
                                }

                            </ul>
                        </div>
                    </section>
                    <section className="foodMeal-tracker-container p-3" style={{background:"#ACE1AF",boxShadow:"0 0 5px #ACE1AF"}}>
                        <section className="d-flex justify-content-center align-items-center">
                        <div className="foodMeal-tracker-image">
                            <img src="/images/foodNutrient/snack.avif" alt="" />
                        </div>
                        </section>
                        <div className="fs-5 text-success py-2 d-flex justify-content-center align-items-center">Morning Snack</div>
                        <div className="added-food-items-box">
                            <ul className="list-group py-2">
                                {
                                    FoodList.MorningSnack.map((item,index)=>{
                                        return <>
                                    <li className="list-group-item d-flex">
                                    <div className="w-50">
                                        <div className="food-name">{item.name}</div>
                                        <div>{item.serving_size_g} grams</div>
                                    </div>
                                    <div className="w-50 d-flex justify-content-end align-items-center">
                                        <div>{item.calories} Cal <button className="bi bi-trash"></button></div>
                                    </div>
                                </li>
                                        </>
                                    })
                                }

                            </ul>
                        </div>
                    </section>
                    <section className="foodMeal-tracker-container p-3" style={{background:"#B9D9EB",boxShadow:"0 0 5px #B9D9EB"}}>
                        <section className="d-flex justify-content-center align-items-center">
                        <div className="foodMeal-tracker-image">
                            <img src="/images/foodNutrient/lunch.avif" alt="" />
                        </div>
                        </section>
                        <div className="fs-5 text-primary py-2 d-flex justify-content-center align-items-center">Lunch</div>
                        <div className="added-food-items-box">
                            <ul className="list-group py-2">
                            {
                                    FoodList.Lunch.map((item,index)=>{
                                        return <>
                                    <li className="list-group-item d-flex">
                                    <div className="w-50">
                                        <div className="food-name">{item.name}</div>
                                        <div>{item.serving_size_g} grams</div>
                                    </div>
                                    <div className="w-50 d-flex justify-content-end align-items-center">
                                        <div>{item.calories} Cal <button className="bi bi-trash"></button></div>
                                    </div>
                                </li>
                                        </>
                                    })
                                }

                            </ul>
                        </div>
                    </section>
                    <section className="foodMeal-tracker-container p-3" style={{background:"#F88379",boxShadow:"0 0 5px #F88379"}}>
                        <section className="d-flex justify-content-center align-items-center">
                        <div className="foodMeal-tracker-image">
                            <img src="/images/foodNutrient/dinner.avif" alt="" />
                        </div>
                        </section>
                        <div className="fs-5 py-2 d-flex justify-content-center align-items-center" style={{color:"red"}}>Dinner</div>
                        <div className="added-food-items-box">
                            <ul className="list-group py-2">
                            {
                                    FoodList.Dinner.map((item,index)=>{
                                        return <>
                                    <li className="list-group-item d-flex">
                                    <div className="w-50">
                                        <div className="food-name">{item.name}</div>
                                        <div>{item.serving_size_g} grams</div>
                                    </div>
                                    <div className="w-50 d-flex justify-content-end align-items-center">
                                        <div>{item.calories} Cal <button className="bi bi-trash"></button></div>
                                    </div>
                                </li>
                                        </>
                                    })
                                }

                            </ul>
                        </div>
                    </section>
                </section>

            </section>
            <section className=" foodResult-container" style={foodSearchresult=="" ? {display:"none"} : {display:"block"}}>
            <section className="foodResult-container-image-main">
                <section className="foodResult-container-image">
                    <img src={`https://source.unsplash.com/random?${foodSearch}`} alt="" />
                </section>
                <section className="foodResult-container-image foodResult-container-text">
                    <section className="p-4">
                    <div className="fs-4" style={{textTransform:"capitalize"}}>{modifyFoodNutrients.name}</div>
                    <div><span>{modifyFoodNutrients.serving_size_g}g</span><span> - {modifyFoodNutrients.calories} cal</span></div>
                    </section>
                </section>
                </section>
            <section className="recipe-parent">
                <section className="foodquantityBox d-flex py-3">
                    <div className="w-50 d-flex ps-4 align-items-center fs-5">Pick The Food Quantity</div>
                    <div className="w-50">
                        <section className="food-quantity-parent">
                        <section className="foodquantity-input-main">
                        {
                                TotalGramCount.map((item,index)=>{
                                    return <>
                             <div className="food-quantity-input"  style={SelectedFoodGram[0]==index ?  {background:"linear-gradient(147deg, #990000 0%, #ff0000 74%)",boxShadow:" 0 0 5px red"} : null}
                             >
                            <input type="text" name="" id="" value={TotalGramCount[index]} onChange={(event)=>{
                                TotalGramCount[index]=event.target.value
                                SetTotalGramCount([...TotalGramCount])
                            }}/>
                            <button className="fa-solid fa-greater-than" onClick={()=>{
                                SelectedFoodGram[0]=index
                                SelectedFoodGram[1]=TotalGramCount[index]
                                SetSelectedFoodGram([...SelectedFoodGram])
                                ModifyFood(TotalGramCount[index])
                            }}></button>
                            </div>
                                    </>
                                })
                            }
                        </section>
                        <section className="food-quantity-border">
                            <div className="d-flex w-100">
                                <div className="food-quantity-border-div">

                                </div>
                                <div className="food-quantity-border-gram ms-5">
                                    GRAM
                                </div>

                            </div>

                        </section>
                        </section>
                    </div>
                </section>
                <section className="food-macroNutrient-Box px-4">
                    <div className="fs-5 my-3">Macro Nutrients</div>
                    <section className="d-flex justify-content-evenly">
                        <section className="foodnutrient-box">
                            Protein
                            <div className="foodnutrient-box-image">
                                <img src="/images/foodNutrient/protein.png" alt="" />
                            </div>
                            {Number(modifyFoodNutrients.protein_g).toFixed(1)} g
                        </section>
                        <section className="foodnutrient-box">
                            Carbs
                            <div className="foodnutrient-box-image">
                                <img src="/images/foodNutrient/carbs.png" alt="" />
                            </div>
                            {Number(modifyFoodNutrients.carbohydrates_total_g).toFixed(1)} g
                        </section>
                        <section className="foodnutrient-box">
                            Fiber
                            
                            <div className="foodnutrient-box-image">
                                <img src="/images/foodNutrient/fiber.png" alt="" />
                            </div>
                            {Number(modifyFoodNutrients.fiber_g).toFixed(1)} g
                        </section>
                        <section className="foodnutrient-box">
                            fats
                            <div className="foodnutrient-box-image">
                                <img src="/images/foodNutrient/fats.png" alt="" />
                            </div>
                            {Number(modifyFoodNutrients.fat_total_g).toFixed(1)} g
                        </section>
                    </section>
                </section>
                <section className="food-microNutrient-Box px-4">
                    <div className="fs-5 my-3">Micro Nutrients</div>
                    <div className="d-flex gap-5">
                        <div className="w-25 mb-2">pottasium</div>
                        <div className="w-25 mb-2">{modifyFoodNutrients.potassium_mg}mg</div>
                    </div>
                    <div className="d-flex gap-5">
                        <div className="w-25 mb-2">Sodium</div>
                        <div className="w-25 mb-2">{modifyFoodNutrients.sodium_mg}mg</div>
                    </div>
                    <div className="d-flex gap-5">
                        <div className="w-25 mb-2">cholestral</div>
                        <div className="w-25 mb-2">{modifyFoodNutrients.cholesterol_mg}mg</div>
                    </div>
                    <div className="d-flex gap-5">
                        <div className="w-25 mb-2">sugar</div>
                        <div className="w-25 mb-2">{modifyFoodNutrients.sugar_g}g</div>
                    </div>
                </section>
                <section className="addFood-box my-2 px-4">
                    <div className="fs-5">Add Food</div>
                    <section className="d-flex addfood-list mt-3">
                        <div>Breakfast <button className="bi bi-plus-lg" value={0} onClick={(event)=>{AddFoodTolist(event.target.value)}}></button></div>
                        <div>Morning Snack <button className="bi bi-plus-lg" value={1} onClick={(event)=>{AddFoodTolist(event.target.value)}}></button></div>
                        <div>Lunch <button className="bi bi-plus-lg" value={2} onClick={(event)=>{AddFoodTolist(event.target.value)}}></button></div>
                        <div>Dinner <button className="bi bi-plus-lg" value={3} onClick={(event)=>{AddFoodTolist(event.target.value)}}></button></div>
                    </section>
                </section>
                <div className="w-100 d-flex justify-content-center align-items-center py-4 "><p className="view-recipe-text text-decoration-underline" onClick={()=>{
                    let recipeBox=document.querySelector(".recipe-container-main")
                    recipeBox.classList.remove("recipe-container-main-hide")
                    recipeBox.classList.add("recipe-container-main-show")
                }}>View Recipe <span className="bi bi-arrow-right ms-2"></span></p></div>
            <section className="recipe-container-main">
            <div className="d-flex justify-content-end "><button className="bi bi-x-circle recipe-cancel-btn" onClick={()=>{
                        let recipeBox=document.querySelector(".recipe-container-main")
                        recipeBox.classList.remove("recipe-container-main-show")
                        recipeBox.classList.add("recipe-container-main-hide")
                    }}></button></div>
                <section className=" recipe-container-child">
                
                    {
                        Recipedata.map((item,index)=>{
                            return <>
                        <div className="recipe-container" style={index%2===0 ? {backgroundColor:"#ACE1AF"} : {backgroundColor:"#F5F5DC"}}>
                        <div className="recipe-name-text">{item.title}<span className="ms-2">({item.servings})</span></div>
                        <div>
                            <div className="text-danger">Ingredients</div>
                            <div className="recipe-justify">{item.ingredients}</div>
                        </div>
                        <div>
                            <div className="text-danger">Instructions</div>
                            <div className="recipe-justify">{item.instructions}</div>
                        </div>
                        </div>

                            </>
                        })
                    }
                    </section>
            </section>
            </section>

            </section>
        </section>
    </section>
    </> : <>
    <section className="set-goal-box">
        <section className="setting-goal-container">
            <div className="fs-2 text-danger">Set Your Goal</div>
            <div>Your Body Weight</div>
            <div><input type="text" readOnly className="setgoal-weightinput" value={UserDetails.Weight}/><span className="ms-2">kg</span></div>
            <div>Your Goal</div>
            <div className="d-flex setGoal-image justify-content-center align-items-center">
                <div>
                    <img src="/images/gain.png" alt="" />
                    <button className="" value={0} onClick={(event)=>{SetGoal(event.target.value)}} style={Goal==="0" ? {backgroundColor:"green",color:"white"} : null}>gain</button>
                </div>
                <div>
                    <img src="/images/loss.png" alt="" />
                    <button className="" value={1} onClick={(event)=>{SetGoal(event.target.value)}} style={Goal==="1" ? {backgroundColor:"green",color:"white"} : null}>lose</button>
                </div>
            </div>
            <div>
                <button className="setgoal-trackbtn" onClick={TrackGoal}>track</button>
            </div>
        </section>
    </section>
    </>
    }
    </>
}
export default FoodTracker