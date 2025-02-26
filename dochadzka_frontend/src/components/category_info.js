import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import {fetchPlayersByCategory, API_URL} from "../api";

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [players, setPlayers] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showAllTrainings, setShowAllTrainings] = useState(false);


    useEffect(() => {
        fetchPlayersByCategory(categoryName).then(setPlayers);
        fetch(`${API_URL}/trainings/${categoryName}/`)
            .then((response) => response.json())
            .then((data) => setTrainings(data))
            .catch((error) => console.error("Chyba pri načítaní tréningov:", error));

    },  [categoryName]);

    const togglePlayerTrainings = (playerId) => {
        setSelectedPlayer(selectedPlayer === playerId ? null : playerId);
    };

    const isPlayerInTraining = (training, playerId) => {
        return training.players.includes(playerId);
    };

    const toggleAllTrainings = () => {
        setShowAllTrainings(!showAllTrainings);
    };



    return (
        <div className="bg-gray-100 py-12 px-6 min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                <h2 className="text-4xl font-extrabold text-center text-blue-700">{categoryName}</h2>

                {/* Hráči */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Hráči</h3>
                    <Link to={`/addtraining/${categoryName}`} className="text-gray-300 hover:text-white">
                        Pridať tréning
                    </Link>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                        {players.map((player) => {
                            const playerAttendance = trainings.filter(training => isPlayerInTraining(training, player.id)).length;
                            const trainingsCount = trainings.length;
                            const attendance = trainingsCount ? (playerAttendance/trainingsCount*100).toFixed(0) : 0;

                            // Dynamické nastavenie farby pozadia podľa účasti
                            let backgroundColorClass = "bg-red-600"; // Default pre menej ako 50%
                            if (attendance >= 60 && attendance < 70) {
                                backgroundColorClass = "bg-orange-400"; // 50-59%
                            } else if (attendance >= 70 && attendance < 80) {
                                backgroundColorClass = "bg-yellow-300"; // 60-79%
                            } else if (attendance >= 80 && attendance < 90) {
                                backgroundColorClass = "bg-green-400"; // 80-89%
                            } else if (attendance >= 90) {
                                backgroundColorClass = "bg-green-600"; // 90-100%
                            }


                            return (
                            <div
                                key={player.id}
                                className={`rounded-lg shadow-sm p-4 hover:shadow-md transition duration-300 cursor-pointer border border-transparent hover:border-blue-500`}
                                onClick={() => togglePlayerTrainings(player.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-medium text-gray-700">
                                        {player.jersey_number} {player.first_name} {player.last_name} -
                                    </h4>
                                    <span className={`${backgroundColorClass} ml-2 inline-block rounded-full py-1 px-4 text-right text-2x2 text-black sm:px-2 sm:text-sm`}>
                                           <strong>{attendance}%</strong>
                                        </span>
                                </div>
                                {selectedPlayer === player.id && (
                                    <div className="mt-4 space-y-4">
                                        <h5 className="text-xl font-semibold text-gray-800">Tréningy hráča</h5>
                                        <ul className="space-y-4 mt-4">
                                            {trainings.map(training => {
                                                const formattedDate = new Intl.DateTimeFormat('sk-SK', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                }).format(new Date(training.date));

                                                const isInTraining = isPlayerInTraining(training, player.id);

                                                return (
                                                    <li key={training.id} className="flex items-center space-x-3 text-gray-700">
                                                        <span>{training.day} - {formattedDate}</span>
                                                        {isInTraining ? (
                                                            <>
                                                                <span className="text-green-500">✔️</span>



                                                            </>
                                                        ) : (
                                                            <span className="text-red-500">❌</span>
                                                        )}

                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )})}
                    </div>
                </div>

                {/* Zobrazenie všetkých tréningov */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold text-gray-800">Všetky Tréningy</h3>
                        <button
                            onClick={toggleAllTrainings}
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                        >
                            {showAllTrainings ? "Skryť" : "Zobraziť"}
                        </button>
                    </div>
                    {showAllTrainings && (
                        <ul className="space-y-2">
                            {trainings.map(training => {
                                const formattedDate = new Intl.DateTimeFormat('sk-SK', { day: '2-digit', month: 'long' }).format(new Date(training.date));
                                return (
                                    <li key={training.id} className="flex items-center text-gray-700">
                                        <span>{training.day} - {formattedDate}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;