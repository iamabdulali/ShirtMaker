// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51OTmDuDrmRTy0GxZrFUIcg5tEyrYSq1mbEsXL3TdiDX0EM9gQSzaq0FyOGwlxeaogZNxjXxX2qgSPoALj9RTEUEj00HuJ0ilbo"
);
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
    allowedHeaders: true,
  })
);

app.use(express.json());

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { imageSrc, sizes, color } = req.body;

    console.log(imageSrc, sizes, color);

    const sum = Object.values(sizes).reduce((acc, value) => acc + value, 0);

    console.log(sum);

    // // Validate input parameters
    // if (!imageSrc || !quantity || isNaN(quantity) || quantity <= 0) {
    //   return res.status(400).send("Invalid input parameters");
    // }

    // Create a Checkout session with the selected image and quantity
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            unit_amount: 2499,
            product_data: {
              name: "T-Shirt",
              description: "Awesome T-Shirt",

              images: [
                 imageSrc,
              ],
            },
            currency: "usd",
          },
          quantity: sum,
        },
      ],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      custom_text: {
        shipping_address: {
          message:
            "Please note that we can't guarantee 2-day delivery for PO boxes at this time.",
        },
        submit: {
          message: "We'll email you instructions on how to get started.",
        },
      },
      phone_number_collection: {
        enabled: true,
      },

      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/new-index.html`,
      // Pass the selected image information to the metadata
      payment_method_types: ["card"],
      payment_intent_data: {
        metadata: {
          sizeDetails: JSON.stringify(sizes),
          ShirtFront: imageSrc,
          shirtColor: color,
        },
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(4242, () => console.log("Running on port 4242"));
