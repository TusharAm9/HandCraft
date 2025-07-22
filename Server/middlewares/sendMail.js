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

const sendInvoiceMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const {
    _id: orderId,
    createdAt,
    paymentStatus,
    orderStatus,
    shippingAddress,
    totalAmount,
    itemList,
  } = data;

  const customerAddress = shippingAddress;
  const orderDate = new Date(createdAt).toLocaleDateString("en-IN");

  const itemRows = itemList
    ?.map(
      (item, index) => `
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">${index + 1}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${
            item?.productName
          }</td>
          <td style="border: 1px solid #ccc; padding: 8px;">₹${item?.price}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${
            item?.quantity
          }</td>
          <td style="border: 1px solid #ccc; padding: 8px;">₹${(
            item?.price * item?.quantity
          ).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Invoice - ${orderId}</title>
    </head>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <h2 style="text-align: center; color: #000;">🧾 Tax Invoice</h2>
        <hr />

        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h3>Sold By:</h3>
            <p>
              <strong>Artisan Craft</strong><br />
              Alipurduar, West Bengal - 736121<br />
              Phone: +91-XXXXXXXXXX<br />
            </p>
          </div>
          <div>
            <h3>Billed To:</h3>
            <p>
              <strong>${customerAddress?.name}</strong><br />
              ${customerAddress?.street}, ${customerAddress?.city},<br />
              ${customerAddress?.state} - ${customerAddress?.zipCode}<br />
              Phone: ${customerAddress?.phone}
            </p>
          </div>
        </div>

        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td><strong>Invoice No:</strong> ${orderId}</td>
            <td><strong>Date:</strong> ${orderDate}</td>
          </tr>
          <tr>
            <td><strong>Payment Status:</strong> ${paymentStatus}</td>
            <td><strong>Order Status:</strong> ${orderStatus}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: #f5f5f5;">
            <tr>
              <th style="border: 1px solid #ccc; padding: 8px;">S.No</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Product Name</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Unit Price</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Quantity</th>
              <th style="border: 1px solid #ccc; padding: 8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 20px;">
          <h3>Total Amount Paid: ₹${totalAmount.toFixed(2)}</h3>
        </div>

        <p style="margin-top: 40px; font-size: 0.9em; color: #666;">
          This is a computer-generated invoice and does not require a physical signature.
        </p>
      </div>
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

export { sendMail, sendSuccessMail, sendInvoiceMail };
