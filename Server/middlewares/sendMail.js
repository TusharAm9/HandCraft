import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Update || Artician Craft</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#8D6E63; padding:20px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold;">
              Artician Craft - Order Status Update
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 40px; color:#333333;">
              <p style="font-size:16px; line-height:24px;">
                Hello ${data?.customerAddress?.name},
              </p>

              <p style="font-size:16px; line-height:24px;">
                We wanted to let you know that the status of your order <strong>#${data?.orderId}</strong> has been updated.
              </p>

              <p style="text-align:center; margin:30px 0;">
                <span style="display:inline-block; background-color:#f1f1f1; padding:15px 30px; font-size:20px; font-weight:bold; color:#8D6E63; letter-spacing:2px; border-radius:6px;">
                  ${data?.orderStatus}
                </span>
              </p>

              <p style="font-size:14px; line-height:22px;">
                <strong>Order Date:</strong> ${data?.createdAt}<br>
              </p>

              <p style="font-size:16px; line-height:24px; margin-top:30px;">
                Thank you for shopping with Artician Craft. We hope you love your handmade item!
              </p>

              <p style="font-size:16px; line-height:24px; margin-top:30px;">
                Best regards,<br>
                The Artician Craft Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#eeeeee; padding:20px; text-align:center; font-size:12px; color:#777;">
              &copy; 2025 Artician Craft. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  await transport.sendMail({
    from: process.env.GMAIL,
    to: email,
    subject,
    html,
  });
};

const sendSuccessMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Confirmed || Artician Craft</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#6D4C41; padding:20px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold;">
              🎉 Order Confirmed - Artician Craft
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px 40px; color:#333333;">
              <p style="font-size:16px; line-height:24px;">
                Hello ${data?.customerAddress?.name},
              </p>

              <p style="font-size:16px; line-height:24px;">
                Thank you for your purchase! Your order <strong>#${data?.orderId}</strong> has been successfully placed on <strong>${data?.orderDate}</strong>.
              </p>

              <p style="text-align:center; margin:30px 0;">
                <span style="display:inline-block; background-color:#F1F8E9; padding:15px 30px; font-size:20px; font-weight:bold; color:#6D4C41; letter-spacing:1px; border-radius:6px;">
                  Order Placed Successfully
                </span>
              </p>

              <p style="font-size:14px; line-height:22px;">
                We’ll notify you once your handcrafted items are prepared and shipped. Meanwhile, you can view or manage your order through the link below.
              </p>

              <p style="font-size:16px; line-height:24px; margin-top:30px;">
                We appreciate your support for handmade craftsmanship.
              </p>

              <p style="font-size:16px; line-height:24px; margin-top:30px;">
                Warm regards,<br>
                The Artician Craft Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#eeeeee; padding:20px; text-align:center; font-size:12px; color:#777;">
              &copy; 2025 Artician Craft. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
  await transport.sendMail({
    from: process.env.GMAIL,
    to: email,
    subject,
    html,
  });
};

export { sendMail, sendSuccessMail };
