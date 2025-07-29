"use client";
import { useState } from "react";
import { juices } from "../data/juices";
import Link from "next/link";

export default function EventPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    juices: [],
    juiceQuantities: {},
    quantity: "",
    snacks: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    if (name === "juices") {
      setForm((prev) => {
        if (checked) {
          return { ...prev, juices: [...prev.juices, value] };
        } else {
          const { [value]: _, ...restQuantities } = prev.juiceQuantities;
          return { ...prev, juices: prev.juices.filter((j) => j !== value), juiceQuantities: restQuantities };
        }
      });
    } else if (name === "snacks") {
      setForm({ ...form, snacks: checked });
    } else if (name.startsWith("quantity-")) {
      const juiceName = name.replace("quantity-", "");
      setForm((prev) => ({
        ...prev,
        juiceQuantities: { ...prev.juiceQuantities, [juiceName]: value }
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const juiceList = form.juices.map(j => `${j} (${form.juiceQuantities[j] || 1})`).join(", ");
  const whatsappMessage =
    `Event Request:%0A` +
    `Name: ${form.name}%0A` +
    `Email: ${form.email}%0A` +
    `Phone: ${form.phone}%0A` +
    `Date: ${form.date}%0A` +
    `Time: ${form.time}%0A` +
    `Juices by Gallon: ${juiceList}%0A` +
    (form.snacks ? `I'll ask about the local snacks!%0A` : "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-lg flex justify-start mb-4">
        <div className="w-full flex justify-center">
          <Link href="/" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow">
            ← Back to Home
          </Link>
        </div>
      </div>
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 mt-8">
        <h1 className="text-2xl font-extrabold text-orange-600 mb-6 text-center">Let's Party!</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" className="w-full border rounded-lg px-3 py-2" />
            <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Your Email" className="w-full border rounded-lg px-3 py-2" />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full border rounded-lg px-3 py-2" />
            <input name="date" value={form.date} onChange={handleChange} required type="date" className="w-full border rounded-lg px-3 py-2" />
            <input name="time" value={form.time} onChange={handleChange} required type="time" className="w-full border rounded-lg px-3 py-2" />
            <div className="w-full border rounded-lg px-3 py-2 bg-white">
              <div className="font-semibold mb-1">Select Juices (By Gallon)</div>
              {Object.values(juices).map((juice) => (
                <div key={juice.name} className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    name="juices"
                    value={juice.name}
                    checked={form.juices.includes(juice.name)}
                    onChange={handleChange}
                  />
                  <span>{juice.name}</span>
                  {form.juices.includes(juice.name) && (
                    <input
                      type="number"
                      name={`quantity-${juice.name}`}
                      min="1"
                      value={form.juiceQuantities[juice.name] || 1}
                      onChange={handleChange}
                      className="w-16 border rounded px-1 py-0.5 ml-2"
                      placeholder="Qty"
                    />
                  )}
                </div>
              ))}
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  name="snacks"
                  checked={form.snacks}
                  onChange={handleChange}
                />
                <span>I'll ask about the local snacks!</span>
              </label>
            </div>
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors">Share Event Details</button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div><b>Name:</b> {form.name}</div>
              <div><b>Email:</b> {form.email}</div>
              <div><b>Phone:</b> {form.phone}</div>
              <div><b>Date:</b> {form.date}</div>
              <div><b>Time:</b> {form.time}</div>
              <div><b>Juices:</b> {form.juices.map(j => `${j} (${form.juiceQuantities[j] || 1})`).join(", ")}</div>
              {form.snacks && <div><b>Snacks:</b> I'll ask about the local snacks!</div>}
            </div>
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition-colors"
            >
              Share via WhatsApp
            </a>
            <button onClick={() => setSubmitted(false)} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors">Edit Details</button>
          </div>
        )}
      </div>
    </div>
  );
} 