"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentHtml = void 0;
const generatePaymentHtml = (status) => {
    let title = "", message = "", color = "", emoji = "", shadow = "";
    switch (status) {
        case "success":
            emoji = "✅";
            title = "Payment Successful!";
            message = `Your transaction was completed successfully. Enjoy your purchase!`;
            color = "#28a745"; // A more vibrant green
            shadow = "0 10px 30px rgba(40, 167, 69, 0.2)"; // Softer shadow for success
            break;
        case "failed":
            emoji = "❌";
            title = "Payment Failed";
            message = "Unfortunately, your payment could not be processed. Please try again or use a different method.";
            color = "#dc3545"; // A standard, clear red
            shadow = "0 10px 30px rgba(220, 53, 69, 0.2)"; // Softer shadow for failed
            break;
        case "cancelled":
            emoji = "⚠️";
            title = "Payment Cancelled";
            message = "Your payment was cancelled. If this was unintentional, please try again.";
            color = "#ffc107"; // A clear, warning yellow/orange
            shadow = "0 10px 30px rgba(255, 193, 7, 0.2)"; // Softer shadow for cancelled
            break;
    }
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      <style>
        body {
          font-family: 'Roboto', sans-serif; /* Changed font to Roboto */
          background: linear-gradient(135deg, #e0eafc, #cfdef3); /* Lighter, cooler gradient background */
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          overflow: hidden; /* Prevents scrollbar */
        }

        .container {
          text-align: center;
          padding: 50px 40px; /* Increased padding */
          border-radius: 18px; /* Slightly more rounded */
          background-color: #ffffff;
          box-shadow: ${shadow}; /* Dynamic shadow based on status */
          max-width: 520px; /* Increased max-width */
          width: 90%;
          transform: translateY(0); /* Base transform for animation */
          animation: slideInUp 0.8s ease-out forwards; /* Custom slide-in animation */
          border: 1px solid rgba(255, 255, 255, 0.6); /* Subtle light border */
          backdrop-filter: blur(5px); /* Frosted glass effect for container */
          -webkit-backdrop-filter: blur(5px); /* For Safari */
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .emoji {
          font-size: 70px; /* Larger emoji */
          margin-bottom: 20px;
          animation: popIn 0.5s ease-out forwards; /* Pop-in animation for emoji */
        }

        @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
        }

        h1 {
          color: ${color};
          font-size: 32px; /* Larger heading */
          font-weight: 700; /* Bolder heading */
          margin-bottom: 15px;
        }

        p {
          font-size: 19px;
          color: #4a4a4a; /* Darker grey for better readability */
          line-height: 1.6;
          margin-bottom: 35px;
        }

        a.button {
          display: inline-block;
          padding: 14px 30px; /* Larger button */
          background-color: ${color};
          color: #fff;
          text-decoration: none;
          font-weight: 500; /* Slightly lighter weight for button text */
          border-radius: 50px; /* Pill-shaped button */
          box-shadow: 0 6px 15px rgba(0,0,0,0.15); /* Enhanced button shadow */
          transition: all 0.3s ease; /* Smooth transitions for hover */
          position: relative;
          overflow: hidden;
        }

        a.button:hover {
          background-color: #007bff; /* A neutral blue on hover for consistency */
          transform: translateY(-3px); /* Slight lift effect */
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        a.button::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: rgba(255, 255, 255, 0.2); /* Lighter ripple */
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
          opacity: 0; /* Start hidden */
          transition: transform 0.5s ease, opacity 0.5s ease;
        }

        a.button:active::after {
          animation: ripple 0.6s linear forwards; /* Use forwards to keep last state */
        }

        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="emoji">${emoji}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <a class="button" href="https://academi-one.vercel.app/dashboard">⬅️ Back to Home</a>
      </div>
    </body>
    </html>
  `;
};
exports.generatePaymentHtml = generatePaymentHtml;
