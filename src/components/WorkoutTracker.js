import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const WorkoutTracker=()=>{
    let Navigate=useNavigate()
    // let arr=[10,20,30,100,50]
    // console.log(Math.max(...arr))
    let [WorkoutHistory,SetWorkoutHistory]=useState([])
    let [DatefindState,SetDateFindState]=useState()
    let [workoutTime,SetWorkoutTime]=useState()
    let [AddedExercise,SetAddedexercise]=useState([])
    let [sessionstored,SetsessionStored]=useState([])
    let [sesionStoredExName,SetsesionStoredExName]=useState([])
    let [sessionStoredData,SetsessionStoredData]=useState([])
    let [storeExercise,SetstoreExercise]=useState([])
    let [ExerciseData,SetExerciseData]=useState([])
    let [TimeStart,SetTimeStart]=useState(sessionStorage.getItem("StartBtn"))
    let [ExerciseHover,SetExerciseHover]=useState()
    let ExerciseBoxName=useRef()
    let [ExerciseShortsId,SetExerciseShortsId]=useState("")
    let [ExerciseNamefilter,SetExerciseNamefilter]=useState([])
    let [SearchInput,SetSearchInput]=useState("")
    let [userLoginID,SetUserLOginID]=useState(sessionStorage.getItem("UserId"))
    let [UserDetails,SetUserDetails]=useState({
        UserName:"",
        Weight:""
    })
    const DateFind=()=>{
        let date=new Date
        SetDateFindState(date.toDateString())
        
    }
    const ShowToastMeessege=(Success,Error)=>{
        console.log(Success)
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
    const GetUserProfile=async ()=>{
        let url=`http://localhost:3030/userProfile/${userLoginID}`
        let {data}=await axios.get(url)
        SetUserDetails({...UserDetails,
            UserName:data.result[0].UserName,
            Weight:data.result[0].Weight

        })
    }
    const GetExerciseDetails=async ()=>{
        let url=`http://localhost:3030/exerciseData`
        let {data}=await axios.get(url)
        SetExerciseData(data.result)
    }
    const SearcExercise=(event)=>{
        let value=event.target.value.toLowerCase()
        SetSearchInput(value)
        let searchExerciseResult=ExerciseData.filter((item)=>item.name.toLowerCase().includes(value))
        SetExerciseNamefilter([...searchExerciseResult])

    }
    const StoreExercise=()=>{
        sesionStoredExName.map((item,index)=>{
            
            storeExercise.splice(index,1,{"name":item,"reps":[],"sets":[1],"lbs":[],"tick":[]})
            SetstoreExercise([...storeExercise])
        })
       sessionStorage.setItem("Workouts",JSON.stringify(storeExercise))
       getSessionItems()


        
    }
    const getSessionItems=()=>{
        if(sessionStorage.getItem("Exercise")!==null){
        SetsessionStoredData(JSON.parse(sessionStorage.getItem("Exercise")))}
        else{
            SetsessionStoredData([])
        }
        

    }
    const SetsAdd=(index)=>{
    let updateSets=JSON.parse(sessionStorage.getItem("Exercise"))
    updateSets[index].sets.push(1)
    sessionStorage.setItem("Exercise",JSON.stringify(updateSets))
    getSessionItems()

    }
    const SetsRemove=(index)=>{
        let updateSets=JSON.parse(sessionStorage.getItem("Exercise"))
        updateSets[index].sets.pop()
        updateSets[index].reps.pop()
        updateSets[index].lbs.pop()
        sessionStorage.setItem("Exercise",JSON.stringify(updateSets))
        getSessionItems()
     }
     const setExerciseName=()=>{
        sessionStorage.setItem("AddedExercise",AddedExercise)

     }
     const lbsinput=(event,index,parentIndex)=>{
        let eventvalue=event.target.value
        let updatelbs=JSON.parse(sessionStorage.getItem("Exercise"))
        updatelbs[parentIndex].lbs.splice(index,1,eventvalue)
        sessionStorage.setItem("Exercise",JSON.stringify(updatelbs))

        getSessionItems()
     }
     const repsinput=(event,index,parentIndex)=>{
        let eventvalue=event.target.value
        let updatereps=JSON.parse(sessionStorage.getItem("Exercise"))
        updatereps[parentIndex].reps.splice(index,1,eventvalue)
        sessionStorage.setItem("Exercise",JSON.stringify(updatereps))

        getSessionItems()
     }
     const DeleteExercise=(index)=>{
        let Success="Exercise Deleted Successfully"
        let updateExerciseData=JSON.parse(sessionStorage.getItem("Exercise"))
        updateExerciseData.splice(index,1)
        ShowToastMeessege(Success,undefined)
        sessionStorage.setItem("Exercise",JSON.stringify(updateExerciseData))
         getSessionItems()

     }
     const AddtickBtn=(index,parentIndex)=>{
        let updateTick=JSON.parse(sessionStorage.getItem("Exercise"))
        let tickCheck=updateTick[parentIndex].tick.includes(index)
        if(tickCheck===false){
            updateTick[parentIndex].tick.push(index)

        }
        else{
            let filterTick=updateTick[parentIndex].tick.filter((item)=>item!==index)
            updateTick[parentIndex].tick=[...filterTick]
        }
        sessionStorage.setItem("Exercise",JSON.stringify(updateTick))
        getSessionItems()
     }
    const WorkoutStart=()=>{
        let hour=0
        let minute=0
        let seconds=0
        setInterval(()=>{
            seconds++
            if(seconds==60){
                minute+=1
                seconds=0
            }
            if(minute===60){
                hour+=1
                minute=0
                seconds=0
            }
            let time=hour+"hr"+" "+minute+"min"+" "+seconds+"sec"
            SetWorkoutTime(time)
        },1000)
        sessionStorage.setItem("StartBtn",true)
        SetTimeStart(sessionStorage.getItem("StartBtn"))

     }
     const SaveWorkouts=async ()=>{
        let Success="Workout Data Stored Successfully"
        let url=`http://localhost:3030/saveWorkouts/${userLoginID}`
        let {data}=await axios.post(url,{"Date":DatefindState,"Duration":workoutTime,"Exercise":[...sessionStoredData]})
        if(data.status===true){
            ShowToastMeessege(Success,undefined)
        }
        sessionStorage.removeItem("Exercise")
        sessionStorage.removeItem("AddedExercise")
        sessionStorage.removeItem("StartBtn")
        getSessionItems()
        

     }
     const  GetWorkoutHistory=async ()=>{
        let url=`http://localhost:3030/getworkoutHistory/${sessionStorage.getItem("UserId")}`
        let {data}=await axios.get(url)
        SetWorkoutHistory(data.result)

     }

    useEffect(()=>{
        getSessionItems()
    },[])

    useEffect(()=>{
        GetExerciseDetails()
        DateFind()
        GetWorkoutHistory()
        GetUserProfile()
       
    },[])
    return <>
    <ToastContainer/>
<section className="wokout-tracker-main-box bg-light">
    <section className="w-25 exercise-box-main">
        <section className="exercise-box-search-conatiner">
            <div>
                <button className="bi bi-search"></button>
                <input type="text" name="" id="" placeholder="Search Exercise" value={SearchInput} onChange={(event)=>{SearcExercise(event)}}/>
                <button className="bi bi-x-lg" onClick={()=>{SetSearchInput("")}}></button>
            </div>
            {
                ExerciseNamefilter.length > 0 && SearchInput!==""? <>
                <ul className="list-group exercise-box-searchResult">
                    {
                        ExerciseNamefilter.map((item)=>{
                            return <>
                             <li className="list-group-item d-flex justify-content-between">{item.name} <button className=" bi bi-plus-lg"></button></li>
                            </>
                        })
                    }

            </ul>
                </> : null
            }

        </section>
        <section className="exercise-data-main d-flex ">
            {
                ExerciseData.map((item,index)=>{
                    return <>
                    <div className="exercise-box"  onMouseOver={()=>{
                SetExerciseHover(index)
                // if(ExerciseHover==index){
                //     let exercisenameBox=document.querySelector(".exercise-box-workoutname")
                //     exercisenameBox[0].classList.remove("exercise-box-workoutname-remove")
                //     exercisenameBox[0].classList.add("exercise-box-workoutname-show")
                // }
            }} onMouseLeave={()=>{
                // let exercisenameBox=document.querySelector(".exercise-box-workoutname")
                // // exercisenameBox.classList.remove("exercise-box-workoutname-show")
                // exercisenameBox.classList.add("exercise-box-workoutname-remove")
                SetExerciseHover(null)
            }}>
                {
                    ExerciseHover===index ? <>
                    <div className="exercise-box-workoutname exercise-box-workoutname-show" ref={ExerciseBoxName}>{item.name}
                    <div>target:{item.muscle}</div>
                    </div>
                    </> : null
                }
                <img src={`images/Exercises/${item.IamgeLink}`} alt="" />
                {
                   sessionStoredData.filter((items)=>items.name===item.name).length>0 ? <>
                    <button className="w-50 workout-tracker-addBtn bi bi-check2"></button>
                    </> : <>
                    <button className="w-50 workout-tracker-addBtn" onClick={()=>{
                        let nameItem=[]
                        if(sessionStorage.getItem("AddedExercise")!==null){
                            let sessiondata=[sessionStorage.getItem("AddedExercise")]
                            sessiondata.push(item.name)
                            let arr=JSON.parse(sessionStorage.getItem("Exercise"))
                            let addNewexercise=[...arr,{"name":item.name,"sets":[1],"reps":[],"lbs":[],"tick":[]}]
                            sessionStorage.setItem("AddedExercise",sessiondata)
                            sessionStorage.setItem("Exercise",JSON.stringify(addNewexercise))

                            // console.log(sessionStorage.getItem("AddedExercise").split(","))
                        

                        }
                        else{
                            sessionStorage.setItem("AddedExercise",item.name)
                            let arr=[]
                            arr.push({"name":item.name,"sets":[1],"reps":[],"lbs":[],"tick":[]})
                            sessionStorage.setItem("Exercise",JSON.stringify(arr))
                        }
                    // setExerciseName()
                    getSessionItems()

                }}> <span className="bi bi-plus"></span> ADD</button>
                    </>
                }
                <button className="w-50 workout-tracker-watchBtn" onClick={()=>{SetExerciseShortsId(item.shorts)}}> <span className="bi bi-play"></span> WATCH</button>
                    </div>
                    </>
                })
            }

            
            
        </section>

    </section>
    <section className="w-50 exercise-history-parent">
        <section className="workout-tracker-parent">
        <section className="workoutTracker-image-box">
            <img src="images/gymBanner.png" alt="" />
        </section>
        <section className="workoutTracker-image-box-details d-flex">
            <section>
            <p>USER NAME: <span>{UserDetails.UserName.toUpperCase()}</span> </p>
            <p>WEIGHT: <span>{UserDetails.Weight} KG</span> </p>
            <p>DATE: <span>{DatefindState}</span> </p>
            <p>EXERCISE DURATION: <span>{workoutTime}</span> </p>
            </section>
            <section className="workoutTracker-home-icon-container">
                <button className="bi bi-house-door" onClick={()=>{Navigate("/")}}></button>
                <button className="bi bi-clock-history" onClick={()=>{
                    let HistoryBox=document.querySelector(".exercise-history-container")
                    HistoryBox.classList.remove("exercise-history-container-remove")
                    HistoryBox.classList.add("exercise-history-container-show")
                }}></button>
            </section>

        </section>

        </section>
        {
            sessionStoredData.length==0 ? <>
                    <section className="workout-tracker-quote-container">
            <img src="images/proudquote.png" alt="" />
        </section></> : <>
        <section className="workout-tracking-main">
            {
                sessionStoredData.map((item,index)=>{
                    let ParentItem=item
                    let parentIndex=index
                    return <>
                            <section className="workout-exercise-container">
            <div className="d-flex justify-content-between workout-tracking-trashdiv px-4 py-2 ">
                <p>{item.name}</p>
                <button className="bi bi-trash" onClick={()=>{DeleteExercise(index)}}></button>
            </div>
            <table className="workout-tracking-table">
                <tr>
                    <th>SET</th>
                    <th>PREVIOUS</th>
                    <th>LBS</th>
                    <th>REPS</th>
                    <th></th>
                </tr>
                {
                    item.sets.length>0?
                    item.sets.map((item,index)=>{
                        return <>
                    <tr className="exercise-data-input-container" style={ParentItem.tick.includes(index)===true ? {background:" linear-gradient(179.1deg, rgb(43, 170, 96) 2.3%, rgb(129, 204, 104) 98.3%)"} : null}>
                    <td>{index+1}</td>
                    <td>20lbs*5reps</td>
                    {/* <td>{WorkoutHistory[0].Exercise.map((items)=>items.name===item.name)}</td> */}
                    <td><input type="text" inputMode="numeric" maxLength={3} value={ParentItem.lbs[index]} onChange={(event)=>{lbsinput(event,index,parentIndex)}} readOnly={TimeStart===null ? true : false}/></td>
                    <td><input type="text" inputMode="numeric" maxLength={2} value={ParentItem.reps[index]} onChange={(event)=>{repsinput(event,index,parentIndex)}} readOnly={TimeStart===null ? true : false}/></td>
                    <td><button className="bi bi-check2 workout-tracking-tickBtn" onClick={()=>{AddtickBtn(index,parentIndex)}} style={ParentItem.tick.includes(index)===true ? {background:"green",color:"white"} : null}></button></td>
                </tr>
                        </>
                    }) : null
                }
               
            </table>
            {
                item.sets.length>0?<>
                            <div className="workout-tracking-AddRemoveBtn">
                <button className="bi bi-plus-lg w-50 workout-tracking-Add" onClick={()=>{SetsAdd(index)}}></button>
                <button className="bi bi-dash-lg w-50 workout-tracking-RemoveBtn" onClick={()=>{SetsRemove(index)}}></button>
            </div>
                </> : null
            }
                            </section>

                    </>
                })
            }

            <section className="d-flex justify-content-center align-items-center workout-status">
                {
                    TimeStart===null ? <>
                    <button style={{background:"linear-gradient(green,rgba(0, 128, 0, 0.812))"}} onClick={WorkoutStart}>START</button>
                    </> : <>
                    <button style={{background:"linear-gradient(red,rgba(255, 0, 0, 0.597))"}} onClick={SaveWorkouts}>FINISH</button>
                    </>
                }
            </section>
        </section>
        </>
        }
        <section className="exercise-history-container">
            <button className="bi bi-x-lg history-cancel" onClick={()=>{
             let HistoryBox=document.querySelector(".exercise-history-container")
             HistoryBox.classList.remove("exercise-history-container-show")
             HistoryBox.classList.add("exercise-history-container-remove")

            }}></button>
                        {
                WorkoutHistory.map((item)=>{
                    return <>
                                <div>
                <p>{item.Date}</p>
                <p><span className="bi bi-stopwatch me-2"></span>{item.Duration}</p>
                <table>
                    <tr>
                        <th className="workout-left">Exercise</th>
                        <th className="workout-right">Best Set</th>
                    </tr>
                    {
                        item.Exercise.map((ExerciseName)=>{
                            return <>
                        <tr>
                        <td className="workout-left">{ExerciseName.sets.length} <span className="bi bi-x"></span> {ExerciseName.name}</td>
                        <td className="workout-right" >{Math.max(...ExerciseName.lbs)}lbs <span className="bi bi-x"></span>{Math.max(...ExerciseName.reps)}</td>
                        </tr>
                            </>
                            
                        })
                    }

                </table>
            </div>
                    </>
                })
            }
        </section>
    </section>
    <section className="w-25">
        <section className="shorts-title d-flex justify-content-center align-items-center">
            
            <p className="m-0">EXERCISE TUTORIAL</p>
            <span className="bi bi-play fs-2 text-danger"></span>

        </section>
    <section className="shorts-video-container">
        {
            ExerciseShortsId!=="" ? <>
    <iframe  src={`https://youtube.com/embed/${ExerciseShortsId}` }
    title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
    gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen className="exercise-shorts"></iframe>
            </> : <>
            <section className="shorts-video-container-empty">
            <p className="fs-2">WORRIED ABOUT HOW TO DO EXERCISE IN PROPER FORM?</p>
            <p className="fs-4 text-danger fw-bold">NOT A PROBLEM</p>
            <p className="fs-5">CLICK WATCH BUTTON UNDER EXERCISE LIST</p>
            <img src="images/smile.gif" alt="" />

            </section>
            </>
        }

    </section>
    </section>
</section>
   </>
}
export default WorkoutTracker