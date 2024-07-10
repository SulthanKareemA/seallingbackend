const nodemailer = require('nodemailer');

let error = null;

// Function to fetch email data
const fetchDataEmail = async () => {
  try {
    const response = await fetch('http://localhost/nyoba_ultrasonic/data_email.php');
    const data = await response.json();
    if (data && Array.isArray(data.result) && data.result.length > 0) {
      const emails = data.result.map(item => item.email);
      return emails;
    } else {
      throw new Error('Data received from Email API is empty or not in expected format');
    }
  } catch (err) {
    console.error('Error fetching email data:', err);
    throw err; // Rethrow error to be caught by Promise.all
  }
};

// Function to display email (example: update DOM)
// const displayEmails = (emails) => {
//   const emailElement = document.getElementById('emails');
//   emailElement.innerHTML = ''; // Clear previous content
//   emails.forEach(email => {
//     const emailItem = document.createElement('div');
//     emailItem.textContent = email;
//     emailElement.appendChild(emailItem);
//   });
// };

// Function to fetch status and date data
const fetchDataStatusDate = async () => {
  try {
    const response = await fetch('http://localhost/nyoba_ultrasonic/data.php');
    const data = await response.json();
    if (data && Array.isArray(data.result) && data.result.length > 0) {
      const statusData = data.result.map(item => item.status);
      const dateData = data.result.map(item => item.date);
      return { statusData, dateData };
    } else {
      throw new Error('Data received from Status and Date API is empty or not in expected format');
    }
  } catch (err) {
    console.error('Error fetching status and date data:', err);
    throw err; // Rethrow error to be caught by Promise.all
  }
};

// Function to display status and date (example: update DOM)
// const displayData = (statusData, dateData) => {
//   const statusElement = document.getElementById('status');
//   const dateElement = document.getElementById('date');
//   statusElement.innerHTML = '';
//   dateElement.innerHTML = '';
//   statusData.forEach(status => {
//     const statusItem = document.createElement('div');
//     statusItem.textContent = status;
//     statusElement.appendChild(statusItem);
//   });
//   dateData.forEach(date => {
//     const dateItem = document.createElement('div');
//     dateItem.textContent = date;
//     dateElement.appendChild(dateItem);
//   });
// };

// Fetch email data initially
fetchDataEmail();

// Fetch email data every 5 seconds
const intervalEmail = setInterval(fetchDataEmail, 5000);

// Fetch status and date data initially
fetchDataStatusDate();

// Fetch status and date data every 5 seconds (if needed)
const intervalStatusDate = setInterval(fetchDataStatusDate, 5000);

// Example of handling errors
const handleError = () => {
  if (error) {
    console.error('Error:', error);
    // Example: Display error to the user using alert or console.log
    // alert('Error: ' + error);
  }
};

// Example of using the functions
handleError();

// Clear intervals when done (optional)
// clearInterval(intervalEmail);
// clearInterval(intervalStatusDate);

// Konfigurasi transporter untuk nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sulthaankareem@gmail.com',
    pass: 'imzxlmphghgwimez',
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
        if (dangerousStatus.includes(status)) {
          const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: `Peringatan ${status} pada ${date}`,
            text: `Status saat ini: ${status}\nWaktu terdeteksi: ${date}`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        }
      } else {
        console.error('Invalid email: email is undefined or empty');
      }
    }
  } else {
    console.error('Invalid or empty emails array:', emails);
  }
};




// Menggunakan Promise.all untuk menunggu hasil kedua fungsi
// Menggunakan Promise.all untuk menunggu hasil kedua fungsi
Promise.all([fetchDataEmail(), fetchDataStatusDate()])
  .then(([emails, { statusData, dateData }]) => {
    if (!emails || !statusData || !dateData) {
      throw new Error('One or more data sets are undefined or empty');
    }

    console.log('Email Data:', emails);
    console.log('Status Data:', statusData);
    console.log('Date Data:', dateData);

    // Memanggil fungsi sendNotification dengan data yang diterima
    sendNotification(statusData, dateData, emails);
  })
  .catch(err => {
    console.error('Error fetching data:', err);
    // Handle error fetching data
  });
