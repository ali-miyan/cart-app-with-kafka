import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ListData from "./components/ListData";
import ProductComponent from "./components/AddProduct";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { RootState } from "./store/AuthStore";
import { useSelector } from "react-redux";

function App() {
  const [refreshList, setRefreshList] = useState(false);

  const userId = useSelector((state:RootState) => state.auth.userId);
  console.log(userId);
  

  
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={userId ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={userId ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/"
            element={
              userId ? (
                <>
                  <ListData
                    refreshList={refreshList}
                    setRefreshList={setRefreshList}
                  />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/add-products"
            element={userId ? <ProductComponent /> : <Navigate to="/login" />}
          />
         
        </Routes>
      </Router>
    </>
  );
}

export default App;
