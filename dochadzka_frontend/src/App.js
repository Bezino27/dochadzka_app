import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar";
import Home from "./pages/home";
import Players from "./components/players";
import Trainings from "./components/trainings";
import AddPlayerForm from "./pages/addplayer";
import CategoryPage from "./components/category_info"; // Pridaj túto stránku
import PlayerPage from "./components/player_info";

import "./styles.css";
import AddTrainingForm from "./components/addtraining";

const App = () => {
    return (
        <Router>
            <div className="container">
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/players" element={<Players />} />
                    <Route path="/trainings" element={<Trainings />} />
                    <Route path="/addplayer" element={<AddPlayerForm />} />
                    <Route path="/category_info/:categoryName" element={<CategoryPage />} />
                    <Route path="/player_info/:playerID" element={<PlayerPage />} />
                    <Route path="/addtraining/:categoryName" element={<AddTrainingForm />} />


                </Routes>
            </div>
        </Router>
    );
};

export default App;