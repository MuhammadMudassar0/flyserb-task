"use client";

import axios from "axios";
import React, { useState } from "react";

export const UserInfoForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { fullName: name, email, message };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/save/save-user-data`,
        payload
      );

      if (res.status === 201 || res.status === 200) {
        alert(" Data saved successfully! Email will be sent shortly.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert(" Error saving data. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to save data. Please check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label className="mr-10"> Full name</label>
          <input
            type="text"
            required
            id="fullName"
            onChange={(e) => setName(e.target.value)}
            className="border rounded rounded-lg mb-3 p-1"
            value={name}
          />
        </div>
        <div>
          <label className="mr-5"> Email Address</label>
          <input
            type="email"
            required
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded rounded-lg mb-3 p-1"
            value={email}
          />
        </div>
        <div>
          <label className="mr-10"> Message</label>
          <input
            type="text"
            required
            id="message"
            onChange={(e) => setMessage(e.target.value)}
            className="border rounded rounded-lg mb-3 p-1"
            value={message}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="text-white p-2 bg-cyan-500 rounded rounded-lg"
            disabled={isSubmitting}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
