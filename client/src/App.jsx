import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/protectedroutes";
import AuthWatcher from "./components/Authwatcher";
import Signup from "./components/signup";
import Home from "./components/home";
import Login from "./components/login";
import Landing from "./components/landing";
import Recipes from "./components/recipes";
import Ingredient from "./components/ingredient";
import Profile from "./components/profile";
import EditUser from "./components/edit-user";
import AddRecipe from "./components/add-recipe";
import RecipeDetail from "./components/recipe-details";
import ViewRecipe from "./components/view-recipes";
import EditRecipe from "./components/edit-recipe";

function App() {
  return (
    <BrowserRouter>
      <AuthWatcher />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/ingredient" element={<Ingredient />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-user" element={<EditUser />} />
          <Route path="/view-recipes" element={<ViewRecipe />} />
          <Route path="/add-recipes" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
