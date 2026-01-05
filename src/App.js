
import { Route, Routes } from "react-router-dom";
import PageProblem from "./components/pageError";
import Homepage from "./components/Homepage";
import ProductPage from "./components/ProductPage";
import ProductDetails from "./components/ProductDetail";
import WorkoutTracker from "./components/WorkoutTracker";
import Bmicalculator from "./components/BmiCalculator";
import Adminnavigation from "./components/AdminNavigationbar";
import FoodTracker from "./components/foodTracker";
import ContactInfo from "./components/contactInfo";

const App=()=>{

  return(
    <>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
        <Route path="*" element={<PageProblem/>} />
        <Route path="/products" element={<ProductPage/>}/>
        <Route path="/productsdetails/:productDetail" element={<ProductDetails/>}/>
        <Route path="/workoutTracker" element={<WorkoutTracker/>}/>
        <Route path="/bmitracker" element={<Bmicalculator/>}/>
        <Route path="/admin/:id" element={<Adminnavigation/>}/>
        <Route path="/foodTracker" element={<FoodTracker/>}/>
        <Route path="/contact" element={<ContactInfo/>}/>
         
    </Routes>
  
   </>
  );

};
export default App;