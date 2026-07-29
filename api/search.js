// api/search.js
exports.handler = async function(event, context) {
    const q = event.queryStringParameters.q;
    if (!q) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: '缺少问题参数' })
        };
    }

    try {
        // Node 18+ 内置 fetch，直接使用
        const response = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`
        );
        const data = await response.json();

        let answer = '';
        if (data.Abstract && data.Abstract.trim() !== '') {
            answer = data.Abstract + '\n\n';
            if (data.AbstractURL) answer += `来源：${data.AbstractURL}`;
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            const snippets = data.RelatedTopics.slice(0, 3).map((t, i) => {
                const text = typeof t === 'string' ? t : t.Text;
                const url = t.FirstURL || '';
                return `${i + 1}. ${text}${url ? ' (' + url + ')' : ''}`;
            }).join('\n');
            answer = `有关“${q}”的搜索结果：\n${snippets}\n\n以上信息仅供参考。`;
        } else {
            answer = '没有找到相关信息，请换个问题试试。';
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ answer })
        };
    } catch (err) {
        console.error('搜索失败:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ answer: '搜索服务暂时不可用。' })
        };
    }
};
