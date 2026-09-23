import nodemailer from "nodemailer"

const sendReminderEmail = async (to, subject, message) => {
    try {
        const testAccount = await nodemailer.createTestAccount()

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })

        const info = await transporter.sendMail({
            from: '"Schedula" <no-reply@schedula.com>',
            to: to,
            subject: subject,
            text: message
        })

        console.log("Reminder email sent! Preview URL:", nodemailer.getTestMessageUrl(info))

    } catch (error) {
        console.error("Error sending email:", error.message)
    }
}

export { sendReminderEmail }