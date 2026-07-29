// api/login.js
const crypto = require('crypto');

// 直接在这里定义用户列表，不必设置环境变量
const users = [
    { username: '2024080818541', password: '8541' }
];

// 生成简单的令牌
function generateToken(username, secret) {
    const payload = `${username}:${Date.now()}`;
    const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return hash + ':' + payload;
}

const SECRET = 'my-secret-key-2024';

exports.handler = async (event) => {
    // 只允许 POST 请求
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ success: false, message: '方法不允许' })
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { username, password } = body;

        const user = users.find(u => u.username === username);
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ success: false, message: '账号或密码错误' })
            };
        }
        if (user.password !== password) {
            return {
                statusCode: 401,
                body: JSON.stringify({ success: false, message: '账号或密码错误' })
            };
        }

        const token = generateToken(username, SECRET);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, token })
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: '服务器错误: ' + e.message })
        };
    }
};
