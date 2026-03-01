import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, id, region, action, reason } = body;

        const prompt = `You are a strict AWS engineer assistant. Generate an AWS CLI command to perform the following cleanup action safely.
Resource Type: ${type}
Resource ID: ${id}
Region: ${region}
Action Needed: ${action}
Reason: ${reason}

Return ONLY the raw AWS CLI command. Do not use markdown code blocks like \`\`\`. Do not include any text or explanations before or after the command.`;

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDipFVsK_XIe4esru8menOx68WkF8JSfgg-5";

        if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
            // Incase the user wants to hardcode it but it's empty, or they don't have an env var.
            return NextResponse.json({ command: `# Error: Please set GEMINI_API_KEY inside your environment variables.` });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "systemInstruction": {
                    "parts": [{ "text": "You are a strict AWS engineer assistant. Output ONLY the raw AWS CLI command string and absolutely nothing else. Do not wrap code in markdown block formats." }]
                },
                "contents": [
                    {
                        "parts": [
                            { "text": prompt }
                        ]
                    }
                ]
            })
        });

        const result = await response.json();

        if (result.error) {
            return NextResponse.json({ command: `# Gemini API Error: ${result.error.message || "Unknown error"}` });
        }

        if (!result.candidates || result.candidates.length === 0) {
            return NextResponse.json({ command: `# Gemini API Error: No completion candidates returned` });
        }

        let command = result.candidates[0]?.content?.parts?.[0]?.text?.trim() || "Error parsing Gemini response";

        // Strip out markdown if the AI mistakenly wrapped it in triple backticks
        command = command.replace(/^```[^\n]*\n/gi, '').replace(/\n```$/gi, '').trim();

        if (!command) command = "# Model returned empty content";

        return NextResponse.json({ command });
    } catch (error: any) {
        console.error("AI Script Generation Error:", error);
        return NextResponse.json({ command: `# Backend Exception: ${error.message}` });
    }
}
