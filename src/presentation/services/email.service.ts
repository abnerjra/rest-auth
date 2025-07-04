import nodemailer, { Transporter } from "nodemailer";

interface SendMailOptions {
    to: string | string[],
    subject: string,
    htmlBody: string,
    attachements?: Attachment[]
}

interface Attachment {
    filename: string,
    path: string
}

export class EmailService {
    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        mailerSecretKey: string,
        private readonly postToProvider: boolean
    ) {

        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: mailerSecretKey,
            }
        });
    }

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachements = [] } = options
        try {
            if (!this.postToProvider) return true;

            const sendInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachements
            });

            // console.log( sentInformation );

            return true
        } catch (error) {
            return false
        }
    }
}