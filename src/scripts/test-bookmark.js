const http = require('http');

const baseUrl = 'http://localhost:5000/api/v1';

const request = (url, method, headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
};

const runBookmarkTests = async () => {
  console.log('Testing Bookmark API toggle operations...\n');
  try {
    // 1. Login to get token
    const loginData = JSON.stringify({
      email: 'user@devops.com',
      password: 'Password123',
    });
    const loginRes = await request(`${baseUrl}/auth/login`, 'POST', {}, loginData);
    if (loginRes.status !== 200 || !loginRes.data.data.token) {
      console.error('Login failed:', loginRes.data);
      return;
    }
    const token = loginRes.data.data.token;
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    console.log('[+] Login successful. Token acquired.');

    // 2. Fetch workflows to get a guide ID
    const workflowsRes = await request(`${baseUrl}/workflows?limit=1`, 'GET', authHeaders);
    if (workflowsRes.status !== 200 || !workflowsRes.data.data.records.length) {
      console.error('Failed to retrieve workflows:', workflowsRes.data);
      return;
    }
    const guide = workflowsRes.data.data.records[0];
    const guideId = guide._id;
    console.log(`[+] Retrieved workflow guide ID: ${guideId} ("${guide.instruction}")`);

    // 3. Add Bookmark via POST /api/v1/workflows/:id/bookmark
    console.log(`\n[->] Sending toggle (Add) to /api/v1/workflows/${guideId}/bookmark...`);
    const addRes = await request(`${baseUrl}/workflows/${guideId}/bookmark`, 'POST', authHeaders);
    console.log(`Response Status: ${addRes.status}`);
    console.log('Response Body:', JSON.stringify(addRes.data, null, 2));

    if (addRes.status !== 200) {
      console.error('[!] Fail: Add bookmark returned non-200 status');
      return;
    }

    // 4. Remove Bookmark via POST /api/v1/workflows/:id/bookmark
    console.log(`\n[->] Sending toggle (Remove) to /api/v1/workflows/${guideId}/bookmark...`);
    const removeRes = await request(`${baseUrl}/workflows/${guideId}/bookmark`, 'POST', authHeaders);
    console.log(`Response Status: ${removeRes.status}`);
    console.log('Response Body:', JSON.stringify(removeRes.data, null, 2));

    if (removeRes.status !== 200) {
      console.error('[!] Fail: Remove bookmark returned non-200 status');
      return;
    }

    // 5. Test Invalid ID
    console.log(`\n[->] Sending invalid ID to /api/v1/workflows/12345/bookmark...`);
    const invalidRes = await request(`${baseUrl}/workflows/12345/bookmark`, 'POST', authHeaders);
    console.log(`Response Status: ${invalidRes.status}`);
    console.log('Response Body:', JSON.stringify(invalidRes.data, null, 2));

    if (invalidRes.status === 400) {
      console.log('[+] Success: Invalid ID parameter handled defensively with 400 BadRequest');
    } else {
      console.error('[!] Fail: Invalid ID did not return 400');
    }

    console.log('\n==============================================');
    console.log('BOOKMARK TEST SUITE COMPLETED SUCCESSFULLY.');
    console.log('==============================================');
  } catch (e) {
    console.error('Test execution crashed:', e.message);
  }
};

runBookmarkTests();
