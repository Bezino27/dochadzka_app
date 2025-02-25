import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchabsence, fetchCategories, fetchPlayerById, fetchTrainingsByPlayerId } from "../api";

const PlayerPage = () => {
    const { playerID } = useParams();
    const [player, setPlayer] = useState(null);
    const [trainings, setTrainings] = useState([]);
    const [categories, setCategories] = useState({});
    const [absences, setAbsences] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null); // Ukladanie vybraného tréningu



    useEffect(() => {
        fetchPlayerById(playerID).then(setPlayer);
        fetchTrainingsByPlayerId(playerID).then(setTrainings);
        fetchabsence().then(setAbsences);
        fetchCategories().then((data) => {
            const categoryMap = {};
            data.forEach(category => {
                categoryMap[category.id] = category.name;
            });
            setCategories(categoryMap);
        });
    }, [playerID]);

    if (!player) {
        return <p>Načítavam hráča...</p>;
    }

    // Rozdelenie tréningov do sekcií podľa kategórie
    const categorizedTrainings = trainings.reduce((acc, training) => {
        const categoryName = categories[training.category];
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(training);
        return acc;
    }, {});

    const isPlayerInTraining = (training, playerId) => {
        return training.players.includes(playerId);
    };

    const toggleAbsence = (absenceId) => {
        setSelectedTraining((prev) => (prev === absenceId ? null : absenceId));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Detail hráča</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-medium text-gray-700">Informácie o hráčovi</h2>
                <ul className="list-none space-y-3 mt-4 text-gray-600">
                    <li><strong>Číslo dresu:</strong> {player.jersey_number}</li>
                    <li><strong>Celé meno:</strong> {player.first_name} {player.last_name}</li>
                    <li><strong>Email:</strong> {player.email_1}</li>
                    <li><strong>Dátum narodenia:</strong> {player.birth_date}</li>
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-medium text-gray-700 mb-4">Tréningy</h2>

                {/* Iterovanie cez kategorie a zobrazenie tréningov */}
                {Object.keys(categorizedTrainings).map((categoryName) => {
                    const playerAttendance = categorizedTrainings[categoryName].filter(training => isPlayerInTraining(training, player.id)).length;
                    const trainingsCount = categorizedTrainings[categoryName].length;
                    const attendance = trainingsCount ? (playerAttendance/trainingsCount*100).toFixed(0) : 0;

                    return (
                        <div key={categoryName} className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800">{categoryName} - {attendance}% účasť</h3>
                            <div className="space-y-4 mt-4">
                                {categorizedTrainings[categoryName].map((training) => {
                                    const formattedDate = new Intl.DateTimeFormat('sk-SK', {
                                        day: '2-digit',
                                        month: 'long',
                                    }).format(new Date(training.date));

                                    const formattedTime = training.time ? training.time.slice(0, 5) : "Neznámy čas";

                                    const isInTraining = isPlayerInTraining(training, player.id);

                                    return (
                                        <div key={training.id}>
                                            {/* Tréningový blok */}
                                            <div
                                                className={`flex items-center p-4 rounded-lg shadow-md transition-colors min-h-[80px] cursor-pointer 
                                                ${isInTraining ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'}`}
                                                onClick={() => !isInTraining && toggleAbsence(training.id)}
                                            >
                                                <div className="flex-1 text-gray-700">
                                                    <div className="font-medium">{training.day} - {formattedDate} - {formattedTime}</div>
                                                </div>
                                                <div className="flex justify-end items-center ml-4">
                                                    {isInTraining ? (
                                                        <span className="text-green-500">✔</span>
                                                    ) : (
                                                        <span className="text-red-500">✘</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Zobrazenie absencií len ak je tréning vybraný a hráč nebol prítomný */}
                                            {!isInTraining && selectedTraining === training.id && (
                                                <div className="mt-2 p-3 bg-yellow-50 rounded-lg border-2 border-yellow-300 shadow-sm">
                                                    <h4 className="text-md font-semibold text-gray-800">Dôvod absencie:</h4>
                                                    {absences.filter((absence) => absence.player === player.id && absence.training === training.id)
                                                        .map((absence) => (
                                                            <p key={absence.id} className="text-gray-700">
                                                                - {absence.reason?.trim() ? absence.reason : "Neuvedený dôvod"}
                                                            </p>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerPage;