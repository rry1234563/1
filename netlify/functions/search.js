// netlify/functions/search.js
exports.handler = async function(event) {
    const q = event.queryStringParameters.q;
    if (!q) {
        return { statusCode: 400, body: JSON.stringify({ error: '缺少问题参数' }) };
    }

    try {
        // 使用阿里通义千问免费公共接口，无需任何密钥
        const apiUrl = 'https://qwen-free-api.onrender.com/v1/chat/completions';
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen-turbo',
                messages: [
                    { role: 'user', content: q }
                ]
            })
        });
        const data = await response.json();

        let answer = '';
        if (data.choices && data.choices.length > 0) {
            answer = data.choices[0].message.content;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ answer })
        };
    } catch (err) {
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: '' })
        };
    }
};
