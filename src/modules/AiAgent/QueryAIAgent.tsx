"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tools, functions } from "@/utils/ai-tools";
import { useAdminApiContext } from "@/apis/adminApiContext";

// API Key provided by user - specific to this experimental agent
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "";

interface Message {
    role: "user" | "model";
    content: string;
}

export default function QueryAIAgent() {

    const [query, setQuery] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const { fetcherOptions } = useAdminApiContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMessage: Message = { role: "user", content: query };
        setMessages(prev => [...prev, userMessage]);
        setQuery("");
        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                tools: [{ functionDeclarations: tools as any }],
            });

            const chat = model.startChat({
                history: messages.map(m => ({
                    role: m.role,
                    parts: [{ text: m.content }]
                }))
            });

            const result = await chat.sendMessage(query);
            const response = result.response;
            const functionCalls = response.functionCalls();

            if (functionCalls && functionCalls.length > 0) {
                // Handle function calls
                // For now, we just handle the first one, or loop through if multiple
                // Start a new part list for the next request
                const toolParts = [];

                for (const call of functionCalls) {
                    const functionName = call.name;
                    const functionArgs = call.args;

                    if (functions[functionName]) {
                        const apiResult = await functions[functionName](functionArgs, fetcherOptions);
                        toolParts.push({
                            functionResponse: {
                                name: functionName,
                                response: { name: functionName, content: apiResult }
                            }
                        });
                    }
                }

                // Send tool results back to model
                if (toolParts.length > 0) {
                    const finalResult = await chat.sendMessage(toolParts);
                    setMessages(prev => [...prev, { role: "model", content: finalResult.response.text() }]);
                }
            } else {
                setMessages(prev => [...prev, { role: "model", content: response.text() }]);
            }

        } catch (error) {
            console.error("Error querying AI:", error);
            setMessages(prev => [...prev, { role: "model", content: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-4 p-5 h-[calc(100vh-100px)]">
            <div className="flex-1 overflow-y-auto border rounded-md p-4 space-y-4">
                {messages.length === 0 && <p className="text-gray-500 text-center mt-10">Ask me anything about the farm system...</p>}
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                            <p>Thinking...</p>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                    placeholder="Ask anything..."
                    className="flex-1 min-h-[50px]"
                    rows={2}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <Button type="submit" disabled={loading}>Ask</Button>
            </form>
        </div>
    )
}