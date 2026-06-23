// Toss Payments 서버사이드 결제 확인 엔드포인트
// 환경변수 TOSS_SECRET_KEY 필요 (Netlify → Site settings → Environment variables)
// secretKey는 절대 클라이언트 코드에 포함 금지

const https = require('https');

exports.handler = async (event) => {
  const p = event.queryStringParameters || {};
  const { paymentKey, orderId, amount, plan = 'pro' } = p;

  const fail = () => ({
    statusCode: 302,
    headers: { Location: '/?pay_fail=1' }
  });

  if (!paymentKey || !orderId || !amount) return fail();

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    console.error('TOSS_SECRET_KEY not set');
    return fail();
  }

  const auth = Buffer.from(secretKey + ':').toString('base64');
  const body = JSON.stringify({ paymentKey, orderId, amount: parseInt(amount, 10) });

  try {
    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.tosspayments.com',
        path: '/v1/payments/confirm',
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + auth,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }, res => {
        let data = '';
        res.on('data', c => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });

    if (result.status === 200) {
      return {
        statusCode: 302,
        headers: { Location: `/?pay_ok=1&plan=${encodeURIComponent(plan)}` }
      };
    }

    console.error('Toss confirm 실패:', result.status, result.data);
    return fail();
  } catch (err) {
    console.error('confirm-payment 오류:', err.message);
    return fail();
  }
};
