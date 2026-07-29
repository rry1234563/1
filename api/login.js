exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const { username, password } = JSON.parse(event.body);
    if (username === '2024080818541' && password === '8541') {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, token: 'test-token' })
        };
    }
    return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: '账号或密码错误' })
    };
};
