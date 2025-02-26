export const API_URL = "http://49.13.194.189:8000/api";

// Funkcia na získanie kategórií
export const fetchCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories/`);
        if (!response.ok) {
            throw new Error("Chyba pri načítaní kategórií");
        }
        return await response.json();
    } catch (error) {
        console.error("Chyba pri načítaní kategórií:", error);
        return [];
    }
};

// Funkcia na získanie hráčov
export const fetchPlayers = async () => {
    try {
        const response = await fetch(`${API_URL}/players/`);
        if (!response.ok) {
            throw new Error("Chyba pri načítaní hráčov");
        }
        return await response.json();
    } catch (error) {
        console.error("Chyba pri načítaní hráčov:", error);
        return [];
    }
};

// Funkcia na získanie hráčov
export const fetchPlayersByCategory = async (categoryName) => {
    try {
        const response = await fetch(`${API_URL}/players/${categoryName}/`);
        if (!response.ok) {
            throw new Error("Chyba pri načítaní hráčov");
        }
        return await response.json();
    } catch (error) {
        console.error("Chyba pri načítaní hráčov:", error);
        return [];
    }
};



// Funkcia na získanie tréningov
export const fetchTrainings = async () => {
    try {
        const response = await fetch(`${API_URL}/trainings/`);
        if (!response.ok) {
            throw new Error("Chyba pri načítaní tréningov");
        }
        return await response.json();
    } catch (error) {
        console.error("Chyba pri načítaní tréningov:", error);
        return [];
    }
};

// Funkcia na získanie tréningov
export const fetchabsence = async () => {
    try {
        const response = await fetch(`${API_URL}/absence/`);
        if (!response.ok) {
            throw new Error("Chyba pri načítaní tréningov");
        }
        return await response.json();
    } catch (error) {
        console.error("Chyba pri načítaní tréningov:", error);
        return [];
    }
};



export const fetchTrainingsByCategory = async (categoryName) => {
    try {
        const response = await fetch(`${API_URL}/trainings/${categoryName}`);
        if (!response.ok) {
            throw new Error("Chyba pri načítaní tréningov");
        }
        return await response.json();
    } catch (error) {
        console.error("Chyba pri načítaní tréningov:", error);
        return [];
    }
};



// Funkcia na vytvorenie tréningu
export const createTraining = async (trainingData) => {
    try {
        const response = await fetch(`${API_URL}/trainings/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(trainingData),
        });
        if (!response.ok) {
            throw new Error("Chyba pri vytváraní tréningu");
        }
        return await response.json();
    } catch (error) {
        console.error("Chyba pri vytváraní tréningu:", error);
        return null;
    }
};

//funkcia pre načítanie hráča podľa jeho ID
export const fetchPlayerById = async (playerID) => {
    try {
        const response = await fetch(`${API_URL}/players/${playerID}/`);
        if (!response.ok) {
            throw new Error(`Chyba pri načítaní hráča s ID ${playerID}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchTrainingsByPlayerId = async (playerID) => {
    try {
        const response = await fetch(`${API_URL}/players/${playerID}/trainings/`);
        if (!response.ok) {
            throw new Error(`Chyba pri načítaní tréningov pre hráča s ID ${playerID}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};