// netlify/functions/chat.js
const VOLC_ACCESS_KEY = 'TjJWbU0yWTJOalkzT0RNd05EazVZMkkyWldSbVpHSmpObU16WWpReU5ERQ==';      // ← 替换这里
const VOLC_SECRET_KEY = 'VxCgNvLTE.ChBpZGRMZWNPZTdxaUdpUlgwELaIle4HGAEqEHlzE6MCNU78pYu5-P5VH_4.zfeHmBE0fL3VIJl5QrAwzU_gJvtiULa5UImFxtnh-eOaIhPkjYx1b1PR-T7QL1KA7cQsiZg7rD8siocWyzgveAeZ';      // ← 替换这里

// 获取豆包API的token（自动续期）
async function getVolcToken() {
    const url = 'https://auth.volcengine.com/api/v2/auth/token';
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            access_key_id: VOLC_ACCESS_KEY,
            secret_access_key: VOLC_SECRET_KEY,
            duration_seconds: 3600 // 1小时有效期
        })
    });
    const data = await res.json();
    if (data.access_token) return data.access_token;
    throw new Error('获取豆包token失败');
}

exports.handler = async function(event) {
    const q = event.queryStringParameters.q;
    if (!q) return { statusCode: 400, body: JSON.stringify({ error: '缺少问题参数' }) };

    try {
        const token = await getVolcToken();
        // 豆包模型API地址（使用免费模型 doubao-lite-128k）
        const apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                model: 'doubao-lite-128k',   // 免费模型，速度快
                messages: [{ role: 'user', content: q }]
            })
        });
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || '';
        return { statusCode: 200, body: JSON.stringify({ answer }) };
    } catch (err) {
        return { statusCode: 200, body: JSON.stringify({ answer: '' }) };
    }
};
