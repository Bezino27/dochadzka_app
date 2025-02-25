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
        <div>
            <h1>Tréningy</h1>
            <ul>
                {trainings.map((training) => {
                    // Naformátovanie dátumu na "deň mesiac" v slovenčine
                    const formattedDate = new Intl.DateTimeFormat('sk-SK', {
                    day: '2-digit',
                    month: 'long',
                }).format(new Date(training.date));
                    const categoryName = categories[training.category] || "Neznáma kategória";

                    return (
                    <li key={training.id}>
                {training.day} {formattedDate} - {categoryName} ---> {training.players.length} hráčov
            </li>
            );
            })}
        </ul>
</div>
);
};

export default Trainings;