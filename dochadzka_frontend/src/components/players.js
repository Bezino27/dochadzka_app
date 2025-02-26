import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {API_URL} from "../api";

const Players = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/players/`)
            .then(response => response.json())
            .then(data => setPlayers(data))
            .catch(error => console.error("Chyba pri načítaní hráčov:", error));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Hráči</h1>
            <ul className="space-y-4">
                {players.map(player => (
                    <Link
                        key={player.id}
                        to={`/player_info/${player.id}`}
                        className="block p-4 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                    >
                        <li className="flex justify-between items-center text-gray-800">
                            <span className="font-medium">{player.jersey_number} - {player.first_name} {player.last_name}</span>
                            <span className="text-sm text-gray-500">{player.birth_date.substring(0, 4)}</span>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default Players;