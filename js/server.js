
const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your Gmail
    pass: 'your-app-password' // Use app password from Google Account settings
  }
});

app.post('/submit-order', (req, res) => {
  const orderData = req.body;
  
  // Read existing orders
  const data = JSON.parse(fs.readFileSync('yy.json', 'utf8'));
  data.orders.push(orderData);
  
  // Save to file
  fs.writeFileSync('yy.json', JSON.stringify(data, null, 2));

  // Send email
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'dimadrobot84@gmail.com',
    subject: 'New Order Received',
    text: JSON.stringify(orderData, null, 2)
  };

  transporter.sendMail(mailOptions);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
