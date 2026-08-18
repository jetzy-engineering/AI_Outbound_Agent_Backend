import express from "express";

import "dotenv/config";

import cors from "cors";

const app = express();
app.use(cors({
    origin: "https://outboundagent-vert.vercel.app"
}))

app.use(express.json());


async function makeCall(name, number) {
    const userName = name;
    const userPhone = number;

    const response  = await fetch ("https://api.vapi.ai/call/phone", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.API_KEY}`,
            "Content-type":  "application/json"
        },
        body: JSON.stringify({
            assistantId: process.env.ASSISTANT,
            phoneNumberId: process.env.PHONE,
            customer: {
                number: userPhone,
                name: userName
            }
        })
    });


    const data = await response.json();

    console.log("Vapi status:", response.status);
    console.log("Vapi response:", data);

    if (!response.ok) {
        throw new Error(
            `Vapi call failed: ${JSON.stringify(data)}`
        );
    }

    return data;

}

app.post("/call", async (req, res) => {
    try {
        await makeCall(req.body.name, req.body.number);
        res.status(200).json("Call being made");
    }

    catch (error) {
        res.status(500).json(error.message, null, 2);
    }
})



const port = process.env.PORT;

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running sucessfully on port ${port}`);
 })
