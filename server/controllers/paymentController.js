require("dotenv").config();
const axios = require("axios");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");
const User = require("../models/User"); 
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/email");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const successURL = `${FRONTEND_URL}/success`;
const failedURL = `${FRONTEND_URL}/failed`;

// ✅ Use fallback for callback_url
const PAYSTACK_CALLBACK =
  process.env.PAYSTACK_CALLBACK || `${process.env.BACKEND_URL}/api/payment/verify`;

// 🟢 INITIATE PAYMENT
exports.initiatePayment = async (req, res) => {
  const { email, amount, metadata } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        callback_url: PAYSTACK_CALLBACK,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ url: response.data.data.authorization_url });
  } catch (err) {
    console.error("❌ Payment initialization failed:", err.response?.data || err.message);
    return res.status(500).json({ message: "Payment initialization failed" });
  }
};

// 🟢 VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ message: "Missing payment reference" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    const data = response.data.data;
    const { eventId, userId, quantity } = data.metadata || {};


    if (!eventId || !userId || !quantity) {
      return res.status(400).json({ message: "Incomplete metadata" });
    }

    if (data.status === "success") {
      // Avoid duplicate tickets
      const existingTicket = await Ticket.findOne({ reference: data.reference });
      if (existingTicket) return res.redirect(successURL);

      // Fetch event and user
      const event = await Event.findById(eventId);
      const user = await User.findById(userId);
const data = response.data.data;


  console.log("✅ Paystack verification response:", data);


      if (!event || !user) {
        return res.status(400).json({ message: "Invalid event or user" });
      }

      if (event.totalTickets < quantity) {
        return res.status(400).json({ message: "Not enough tickets available" });
      }

      // Create new ticket
      const ticket = new Ticket({
        event: eventId,
        buyer: userId,
        quantity,
        amount: data.amount / 100,
        reference: data.reference,
      });

      // Update event tickets
      await Event.findByIdAndUpdate(eventId, {
        $inc: { ticketsSold: quantity },
      });

      // Generate and store QR code
      const qrDir = path.join(__dirname, "../uploads/qrcodes");
      if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });

      const qrData = `${FRONTEND_URL}/tickets/validate/${ticket._id}`;
      const qrFileName = `${ticket._id}.png`;
      const qrFilePath = path.join(qrDir, qrFileName);
      await QRCode.toFile(qrFilePath, qrData);

      ticket.qrCode = `qrcodes/${qrFileName}`;
      await ticket.save();

      // Decrease available tickets
      event.totalTickets -= quantity;
      await event.save();

      // Send confirmation email
      await sendEmail(
        user.email,
        "🎟️ Ticket Confirmation",
        `<h2>Hi ${user.name},</h2>
         <p>Your ticket for <b>${event.title}</b> has been confirmed!</p>
         <p>Show this QR code at the entrance:</p>
         <img src="${FRONTEND_URL}/uploads/${ticket.qrCode}" alt="QR Code" />`
      );

      return res.redirect(successURL);
    }

    return res.redirect(failedURL);
  } catch (error) {
    console.error(
      "❌ Payment verification error:",
      error.response?.data || error.message
    );
    return res.status(500).send("Verification failed");
  }


};
