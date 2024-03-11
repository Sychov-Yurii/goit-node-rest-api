import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { fromEnv } from "@aws-sdk/credential-provider-env";

const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

export const sendVerificationEmail = async (email, verificationToken) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<p>Please verify your email by clicking the following link:</p>
                 <a href="http://localhost:3000/users/verify/${verificationToken}">Verify Email</a>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Please verify your email by clicking the following link: 
                 http://localhost:3000/users/verify/${verificationToken}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Email Verification",
      },
    },
    Source: process.env.SENDER_EMAIL,
  };

  try {
    const data = await ses.send(new SendEmailCommand(params));
    console.log("Email sent", data);
  } catch (error) {
    console.error(error);
  }
};
