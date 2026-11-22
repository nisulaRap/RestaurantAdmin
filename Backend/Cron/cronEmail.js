const { sendEmailNotification } = require("../services/emailService");

const statusMessages = {
    Pending: {
        subject: "Your Order is Pending",
        body: "Thank you for placing your order. Your order is currently pending and will be processed shortly."
    },
    Confirmed: {
        subject: "Your Order is Confirmed",
        body: "Good news! Your order has been confirmed and is now being prepared."
    },
    Preparing: {
        subject: "Your Order is Being Prepared",
        body: "Your order is being carefully prepared by our team. It will be ready soon!"
    },
    ReadyToDeliver: {
        subject: "Your Order is Ready to Deliver",
        body: "Your order is ready and will be delivered to you shortly. Please stay available."
    },
    Cancelled: {
        subject: "Your Order Has Been Cancelled",
        body: "We’re sorry to inform you that your order has been cancelled. If you have any questions, please contact support."
    }
};

async function sendOrderStatusEmail(customerEmail, orderId, status) {
    if (!statusMessages[status]) {
        console.warn("Invalid status for email:", status);
        return;
    }

    if (!customerEmail) {
        console.error("Customer email is missing.");
        return;
    }

    const { subject, body } = statusMessages[status];

    const emailBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>${subject}</h2>
            <p>${body}</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p>Thank you for shopping with us!</p>
            <br/>
            <p>– The Team</p>
        </div>
    `;

    await sendEmailNotification(customerEmail, subject, emailBody);
}

module.exports = { sendOrderStatusEmail };