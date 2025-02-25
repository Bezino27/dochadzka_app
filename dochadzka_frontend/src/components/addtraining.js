import React, { useState, useEffect } from "react";
import {fetchCategories, fetchPlayersByCategory} from "../api";
import {useNavigate, useParams} from "react-router-dom";

const AddTrainingForm = () => {
    const navigate = useNavigate();
    const { categoryName } = useParams();
    const [players, setPlayers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [formData, setFormData] = useState({
        category: "",
        day: "",
        date: "",
        time: "",
        players: [],  // Zoznam hráčov, ktorí sú na tréningu
        absences: {},  // Zoznam absencií hráčov, kde kľúč je ID hráča a hodnota je dôvod
    });

    useEffect(() => {
        fetchCategories().then((fetchedCategories) => {
            // Automatické nastavenie prvej kategórie
            if (fetchedCategories.length > 0) {
                const selectedCategory = fetchedCategories.find(
                    (cat) => cat.name === categoryName
                );
                if (selectedCategory) {
                    setFormData({ ...formData, category: selectedCategory.id });
                }
            }
        });

        fetchPlayersByCategory(categoryName).then(setPlayers);
    }, [categoryName]);

    const handlePlayerChange = (e) => {
        const value = parseInt(e.target.value);
        setFormData({
            ...formData,
            players: e.target.checked
                ? [...formData.players, value]
                : formData.players.filter((id) => id !== value),
        });
    };

    const handleAbsenceChange = (e, playerId) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            absences: {
                ...formData.absences,
                [playerId]: value,
            },
        });
    };

    const getDayFromDate = (dateString) => {
        if (!dateString) return "";
        const days = ["Nedeľa", "Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota"];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setFormData({
            ...formData,
            date: selectedDate,
            day: getDayFromDate(selectedDate),
        });
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setFormData({
            ...formData,
            players: selectAll ? [] : players.map((player) => player.id),  // Ak je selectAll true, vymažeme všetkých, inak všetkých označíme
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Najprv pridáme tréning
        fetch("http://127.0.0.1:8000/api/addtraining/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Tréning pridaný:", data);
                alert("Tréning bol úspešne pridaný!");

                // Po pridaní tréningu uložíme absencie
                Object.keys(formData.absences).forEach((playerId) => {
                    const reason = formData.absences[playerId];
                    const isAbsent = !formData.players.includes(parseInt(playerId));

                    if (isAbsent && reason) {
                        // Uložíme absenciu pre daného hráča
                        fetch("http://127.0.0.1:8000/api/addabsence/", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                training: data.id,  // ID vytvoreného tréningu
                                player: playerId,
                                reason: reason,
                            }),
                        }).then((response) => response.json())
                            .then((absenceData) => {
                                console.log("Absencia pridaná:", absenceData);
                            });
                    }
                });

                // Presmerujeme používateľa späť na stránku kategórie
                navigate(`/category_info/${categoryName}`);

                // Resetuj formulár
                setFormData({
                    category: "",
                    day: "",
                    date: "",
                    time: "",
                    players: [],
                    absences: {},
                });
            })
            .catch((error) => console.error("Chyba pri pridávaní tréningu:", error));
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pridať tréning</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Kategória:</label>
                    <input
                        type="text"
                        name="category"
                        value={categoryName}  // Použi správnu hodnotu zo stavu
                        className="mt-1 p-2 w-full border rounded-md"
                        readOnly
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Dátum:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleDateChange}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Deň:</label>
                    <input
                        type="text"
                        name="day"
                        value={formData.day}
                        readOnly
                        className="mt-1 p-2 w-full border rounded-md bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Čas:</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        list="time-options"
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                    <datalist id="time-options">
                        <option value="15:00"></option>
                        <option value="16:30"></option>
                        <option value="17:00"></option>
                        <option value="18:30"></option>
                    </datalist>
                </div>

                <div>
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200">
                        {selectAll ? "Odznačiť všetkých" : "Označiť všetkých"}
                    </button>

                    <label className="block text-gray-700 font-medium">Hráči:</label>
                    <div className="mt-2 grid grid-cols-1 ">
                        {players.map((player) => (
                            <div key={player.id}>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={player.id}
                                        checked={formData.players.includes(player.id)}
                                        onChange={handlePlayerChange}
                                        className="h-4 w-4"
                                    />
                                    <span>{player.first_name} {player.last_name}</span>
                                </label>
                                {!formData.players.includes(player.id) && (
                                    <div>
                                        <label className="block text-gray-700">Dôvod absencie:</label>
                                        <input
                                            type="text"
                                            value={formData.absences[player.id] || ""}
                                            list="reason-options"
                                            onChange={(e) => handleAbsenceChange(e, player.id)}
                                            className="mt-1 p-2 w-full border rounded-md"
                                        />
                                        <datalist id="reason-options">
                                            <option value="Neuviedol"></option>
                                            <option value="Choroba"></option>
                                            <option value="Škola"></option>
                                            <option value="Zranenie"></option>
                                            <option value="Mimo KE"></option>

                                        </datalist>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
                    Pridať tréning
                </button>
            </form>
        </div>
    );
};

    export default AddTrainingForm;