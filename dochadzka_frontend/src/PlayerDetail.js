import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {API_URL} from "./api";

const PlayerDetail = () => {
    const { id } = useParams(); // Získa parametre z URL
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        // Získaj hráča z API na základe ID
        fetch(`${API_URL}/players/${id}/`)
            .then((response) => response.json())
            .then((data) => setPlayer(data))
            .catch((error) => console.error('Error fetching player:', error));
    }, [id]);

    if (!player) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{player.name}</h2>
            <p>Year of Birth: {player.year_of_birth}</p>
            <p>Email: {player.email}</p>
        </div>
    );
};

export default PlayerDetail;