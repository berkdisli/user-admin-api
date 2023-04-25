import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../services/UserService";

const Register = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState("");

    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };
    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };
    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const newUser = new FormData();
            newUser.append("name", name);
            newUser.append("email", email);
            newUser.append("password", password);
            newUser.append("age", age);
            newUser.append("phone", phone);
            newUser.append("image", image);

            const response = await registerUser(newUser);
            toast.success(response.message);

            setName("");
            setEmail("");
            setPhone("");
            setAge("");
            setPassword("");
            setImage("");
        } catch (err) {
            toast(err.response.data.error.message);
        }
    };
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleNameChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="age">Age</label>
                    <input
                        type="age"
                        id="age"
                        name="age"
                        value={age}
                        onChange={handleAgeChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone">Phone number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        pattern="[+]{1}[0-9]{11,14}"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                    />
                </div>
                <input
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                />
                {image && (
                    <div>
                        <img
                            className="user_img"
                            src={URL.createObjectURL(image)}
                            alt="user"
                        />
                    </div>
                )}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;