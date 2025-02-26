import React, { useEffect, useState } from "react";
import { fetchCategories, fetchPlayers, fetchTrainings, createTraining } from "../api";

const Trainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [categories, setCategories] = useState({});

    useEffect(() => {
        fetchTrainings().then(setTrainings);
        fetchCategories().then((data) => {
            const categoryMap = {};
            data.forEach(category => {
                categoryMap[category.id] = category.name;
            });
            setCategories(categoryMap);
        });

    }, []);


    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Tréningy</h1>
            <ul className="space-y-3">
                {trainings.map((training) => {
                    // Naformátovanie dátumu na "deň mesiac" v slovenčine
                    const formattedDate = new Intl.DateTimeFormat("sk-SK", {
                        day: "2-digit",
                        month: "long",
                    }).format(new Date(training.date));
                    const categoryName = categories[training.category] || "Neznáma kategória";

                    return (
                        <li
                            key={training.id}
                            className="flex justify-between items-center p-4 bg-gray-100 border-l-4 border-blue-500 rounded-lg"
                        >
          <span className="text-lg font-semibold text-gray-700">
            {training.day} {formattedDate} - {categoryName}
          </span>
                            <span className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full">
            {training.players.length} hráčov
          </span>
                        </li>
                    );
                })}
            </ul>
        </div>
);
};

export default Trainings;