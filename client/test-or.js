const fs = require('fs');

async function test() {
    const OPENROUTER_API_KEY = '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';
    try {
        let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'model': 'nvidia/nemotron-nano-12b-v2-vl:free',
                'messages': [
                    {
                        'role': 'user',
                        'content': 'How many rs are in strawberry?'
                    }
                ],
                'reasoning': { 'enabled': true }
            })
        });
        const result = await response.json();
        fs.writeFileSync('or-out1.json', JSON.stringify(result, null, 2));

        const aiMessage = result.choices[0].message;

        const messages = [
            {
                role: 'user',
                content: 'How many rs are in strawberry?',
            },
            {
                role: 'assistant',
                content: aiMessage.content || '',
                reasoning_details: aiMessage.reasoning_details
            },
            {
                role: 'user',
                content: 'Are you sure? Think carefully. Output ONLY the raw AWS CLI command string.',
            },
        ];

        if (!messages[1].reasoning_details) delete messages[1].reasoning_details;

        const response2 = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'model': 'nvidia/nemotron-nano-12b-v2-vl:free',
                'messages': messages
            })
        });
        const finalResult = await response2.json();
        fs.writeFileSync('or-out2.json', JSON.stringify(finalResult, null, 2));
        console.log("DONE");
    } catch (e) {
        fs.writeFileSync('or-err.txt', String(e));
        console.log("ERR");
    }
}
test();
