
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

async function listModels() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    try {
        // Access the model directly if listModels isn't exposed on the main class in this version
        // Or try to just print what we can. 
        // The SDK usually doesn't have a direct 'listModels' on the instance, it's on the class or manager.
        // Actually, for @google/generative-ai, it is often simpler to just try a simple generation to test connectivity,
        // but the error message suggested calling ListModels.

        // We'll try to find the ModelService if accessible, or just try 'gemini-1.0-pro' 
        // But let's look at how to list models via REST if SDK doesn't make it obvious, 
        // or just assume the SDK has it. 
        // In node SDK it's usually `genAI.getGenerativeModel` but listing is separate.
        // Actually v0.24.1 might not have a direct listModels helper on the client instance easily accessible in a simple script without looking up exact docs.
        // Let's rely on standard fetch to the API endpoint for listing models.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
