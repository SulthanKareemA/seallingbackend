// send_email.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

let error = null;
let emails = [];
let lastStatusData = [];
let lastDateData = [];

// Function to fetch email data
const fetchDataEmail = async () => {
  const timeout = 5000; // batas waktu 5 detik
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('http://localhost/nyoba_ultrasonic/data_email.php', {
      signal: controller.signal
    });
    clearTimeout(id); // Menghapus batas waktu jika respon berhasil

    if (!response.ok) {
      throw new Error(`Gagal mengambil data_email.php: ${response.statusText}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.result) && data.result.length > 0) {
      const emails = data.result.map(item => item.email);
      return emails;
    } else {
      throw new Error('Data yang diterima dari API Email kosong atau tidak dalam format yang diharapkan');
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('Kesalahan mengambil data email: Permintaan melebihi batas waktu');
    } else {
      console.error('Kesalahan mengambil data email:', err.message);
    }
    throw err; // Melempar ulang kesalahan agar bisa ditangani oleh Promise.all atau handler lainnya
  }
};

// Contoh penggunaan
fetchDataEmail().then(emails => {
  console.log('Email yang diambil:', emails);
}).catch(err => {
  console.error('Gagal mengambil email:', err);
});



// Function to fetch status and date data
const fetchDataStatusDate = async () => {
  try {
    const response = await fetch('http://localhost/nyoba_ultrasonic/data.php');
    const data = await response.json();
    if (data && Array.isArray(data.result) && data.result.length > 0) {
      const statusData = data.result.slice(-10).map(item => item.status);
      const dateData = data.result.slice(-10).map(item => item.date);
      return { statusData, dateData };
    } else {
      throw new Error('Data received from Status and Date API is empty or not in expected format');
    }
  } catch (err) {
    console.error('Error fetching status and date data:', err);
    throw err; // Rethrow error to be caught by Promise.all
  }
};

// Fetch email data initially
// fetchDataEmail();

// Fetch email data every 5 seconds
// const intervalEmail = setInterval(fetchDataEmail, 5000);

// Fetch status and date data initially
// fetchDataStatusDate();

// Fetch status and date data every 5 seconds (if needed)
// const intervalStatusDate = setInterval(fetchDataStatusDate, 5000);

// Example of using the functions
// handleError();

// Clear intervals when done (optional)
// clearInterval(intervalEmail);
// clearInterval(intervalStatusDate);

// Konfigurasi transporter untuk nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendNotification = (statusData, dateData, emails) => {
  const dangerousStatus = ['Bahaya', 'Siaga'];

  // Pastikan emails adalah array dan memiliki elemen yang valid
  if (Array.isArray(emails) && emails.length > 0) {
    for (let i = 0; i < statusData.length; i++) {
      const status = statusData[i];
      const date = dateData[i];
      const email = emails[i];

      // Memeriksa apakah email terdefinisi dan tidak kosong
      if (email && typeof email === 'string' && email.trim() !== '') {
        // Memeriksa apakah status berubah atau tidak
        if (dangerousStatus.includes(status) && 
            (lastStatusData[i] !== status || lastDateData[i] !== date)) {
          const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: `Peringatan ${status} pada ${date}`,
            text: `Status saat ini: ${status}\nWaktu terdeteksi: ${date}`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(`Error sending email to ${email}:`, error);
              // Log timestamp juga bisa ditambahkan di sini
              console.error('Timestamp:', new Date().toISOString());
            } else {
              console.log('Email sent:', info.response);
              // Update last status and date
              lastStatusData[i] = status;
              lastDateData[i] = date;
            }
          });
        }
      } else {
        console.error('Invalid email: email is undefined or empty');
        console.error('Timestamp:', new Date().toISOString());
      }
    }
  } else {
    console.error('Invalid or empty emails array:', emails);
    console.error('Timestamp:', new Date().toISOString());
  }
};

const fetchDataAndSendNotifications = async () => {
  try {
    const [emails, { statusData, dateData }] = await Promise.all([fetchDataEmail(), fetchDataStatusDate()]);

    if (!emails || !statusData || !dateData) {
      throw new Error('One or more data sets are undefined or empty');
    }

    console.log('Email Data:', emails);
    console.log('Status Data:', statusData);
    console.log('Date Data:', dateData);

    // Memanggil fungsi sendNotification dengan data yang diterima
    sendNotification(statusData, dateData, emails);
  } catch (err) {
    console.error('Error fetching data:', err);
    // Handle error fetching data
  }
};

// Example of handling errors
const handleError = () => {
  if (error) {
    console.error('Error:', error);
    // Example: Display error to the user using alert or console.log
    // alert('Error: ' + error);
  }
};

fetchDataAndSendNotifications();

const intervalFetchDataAndSendNotifications = setInterval(fetchDataAndSendNotifications, 5000);

// module.exports = fetchDataAndSendNotifications;