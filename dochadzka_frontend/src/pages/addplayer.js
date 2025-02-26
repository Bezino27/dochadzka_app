import React, { useState, useEffect } from "react";
import {API_URL} from "../api";

const AddPlayerForm = () => {
    const [formData, setFormData] = useState({
        jersey_number: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        email_1: "",
        email_2: "",
        attendance_count: 0,
        all_training_count: 0,
        categories: [],
    });

    const [categories, setCategories] = useState([]);

    // Načítanie kategórií z backendu
    useEffect(() => {
        fetch(`${API_URL}/categories/`)
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Chyba pri načítaní kategórií:", error));
    }, []);

    // Spracovanie zmeny vstupných údajov
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Spracovanie výberu kategórií
    const handleCategoryChange = (e) => {
        const value = parseInt(e.target.value);
        setFormData({
            ...formData,
            categories: e.target.checked
                ? [...formData.categories, value]
                : formData.categories.filter(category => category !== value),
        });
    };

    // Odoslanie formulára na backend
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${API_URL}/addplayer/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Hráč pridaný:", data);

                alert("Hráč bol úspešne pridaný!");
                setFormData({
                    jersey_number: "",
                    first_name: "",
                    last_name: "",
                    birth_date: "",
                    email_1: "",
                    email_2: "",
                    attendance_count: 0,
                    all_training_count: 0,
                    categories: [],
                });
            })
            .catch((error) => console.error("Chyba pri pridávaní hráča:", error));
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Pridať nového hráča</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                    <input
                        type="number"
                        name="jersey_number"
                        placeholder="Číslo dresu"
                        value={formData.jersey_number}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Meno"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Priezvisko"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email_1"
                        placeholder="Primárny email"
                        value={formData.email_1}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email_2"
                        placeholder="Sekundárny email (nepovinné)"
                        value={formData.email_2}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Výber kategórií */}
                <div className="form-group">
                    <h3 className="text-xl font-medium text-gray-700 mb-4">Kategórie:</h3>
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={category.id}
                                    checked={formData.categories.includes(category.id)}
                                    onChange={handleCategoryChange}
                                    className="h-4 w-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <label className="text-gray-700">{category.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Odoslať formulár */}
                <div className="form-group">
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Pridať hráča
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPlayerForm;