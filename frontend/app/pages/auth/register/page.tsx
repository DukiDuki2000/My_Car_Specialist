'use client'; // Upewnij się, że komponent jest klientem

import { FormEvent, useState } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage('Hasła muszą się zgadzać!');
            return;
        }

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: ["user"],
        };

        try {
            const response = await fetch('http://localhost:8081/user/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || 'Użytkownik zarejestrowany pomyślnie!');
            } else {
                const error = await response.json();
                setMessage(error.message || 'Wystąpił błąd przy rejestracji.');
            }
        } catch (error) {
            setMessage('Błąd połączenia z serwerem.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
            <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-4">My Car Specialist</h1>
                <h2 className="text-lg text-center text-gray-500 mb-6">Tworzenie konta</h2>
                <hr className="mb-6 border-t-2 border-blue-400 w-1/2 mx-auto" />

                {message && <p className="text-center text-red-500 mb-4">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Imię:</label>
                            <input
                                className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Wpisz swoje imię"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Nazwisko:</label>
                            <input
                                className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Wpisz swoje nazwisko"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nazwa użytkownika:</label>
                            <input
                                className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Wpisz nazwę użytkownika"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email:</label>
                            <input
                                className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Wpisz email"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Numer telefonu:</label>
                        <input
                            className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Wpisz numer telefonu"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Hasło:</label>
                            <input
                                className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Wprowadź hasło"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Powtórz hasło:</label>
                            <input
                                className="w-full px-4 py-2 rounded-md bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Powtórz hasło"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md font-medium transition duration-300 transform hover:scale-105"
                    >
                        Utwórz konto
                    </button>
                </form>
            </div>
        </div>
    );
}
