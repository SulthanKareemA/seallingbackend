import React, { useState } from "react";
// import axios from 'axios';
import { waves } from "../constants";
// import nodemailer from 'nodemailer';

const Peringatan = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const sendData = async (event) => {
    event.preventDefault(); // Mencegah default form submission
    const data = { email };
    try {
      const response = await fetch('http://localhost/nyoba_ultrasonic/data_email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const text = await response.text();
      console.log('Raw response:', text); // Log respons mentah dari server

      if (text === 'Gagal mendaftarkan email') {
        setSuccessMessage('Gagal mendaftarkan email');
        setMessage(''); // Hapus pesan error jika ada
      } else {
        setMessage('Email berhasil terdaftar');
        setSuccessMessage(''); // Hapus pesan sukses jika ada
      }
    } catch (error) {
      console.error('Error sending data:', error);
      setMessage('Error sending data: ' + error.message);
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="w-full py-10 bg-white px-6">
      <div className="max-w-md md:w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden animated">
        <div className="md:justify-center">
          <div className="md:justify-center">
            <img
              className="h-48 w-full object-cover"
              src={waves}
              alt="Modern building architecture"
            />
          </div>
          <div className="p-6">
            <h1 className="block mt-1 font-serif text-2xl md:text-3xl my-6 font-medium text-center text-slate-900">
              Dapatkan Peringatan Dini!
              <p className="text-slate-600 text-xs pl-4 p-1">
                Daftarkan dirimu dan dapatkan fitur peringatan dini sekarang.
              </p>
            </h1>
            {message && <p className="text-green-600 text-center mt-2">{message}</p>}
            {successMessage && <p className="text-red-600 text-center mt-2">{successMessage}</p>}
            <form onSubmit={sendData}>
              <label className="block">
                <span className="block text-sm font-normal pl-4 p-1 text-slate-900">
                  Email:
                </span>
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="email" // Mengubah type menjadi email untuk validasi yang lebih baik
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-sm text-black border border-black rounded-full p-2 pl-4 outline-none"
                    placeholder="Masukan email anda"
                  />
                </div>
                <p className="text-slate-600 text-xs pl-4 p-1">
                  *Pastikan email yang anda masukan sudah benar.
                </p>
              </label>
              <button type="submit"  className="w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:text-white bg-slate-900 text-white h-10 mt-5 rounded-full font-medium mx-auto">
                Kirim
              </button>
              <button onClick={handleGoHome} className="w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:text-white bg-slate-900 text-white h-10 mt-5 rounded-full font-medium mx-auto">
              Go to Home
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peringatan;
