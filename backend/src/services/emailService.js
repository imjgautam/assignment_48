const nodemailer = require('nodemailer');

// Create a transporter using Ethereal Email (for testing)
let transporter;

const createTransporter = async () => {
    if (transporter) return transporter;

    try {
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        console.log('✅ Ethereal Email Configured:', testAccount.user);
        console.log('📧 Preview emails at: https://ethereal.email/messages');
        
        return transporter;
    } catch (error) {
        console.error('Failed to create email transporter:', error);
        return null;
    }
};

const sendRfpEmail = async (email, title, description) => {
    try {
        const mailer = await createTransporter();
        if (!mailer) throw new Error('Email transporter not initialized');

        const info = await mailer.sendMail({
            from: '"RFP System" <system@rfp-app.com>',
            to: email,
            subject: `New RFP: ${title}`,
            text: description,
            html: `
                <h2>New Request for Proposal</h2>
                <p><strong>Title:</strong> ${title}</p>
                <hr/>
                <h3>Description:</h3>
                <p>${description.replace(/\n/g, '<br/>')}</p>
                <hr/>
                <p>Please submit your proposal through our system.</p>
                <p><em>Note: This is a test email from Ethereal Email service.</em></p>
            `,
        });

        console.log(`✅ Message sent: ${info.messageId}`);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`📧 Preview URL: ${previewUrl}`);
        
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendRfpEmail
};
