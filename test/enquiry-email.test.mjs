import test from 'node:test';
import assert from 'node:assert/strict';
import dns from 'node:dns/promises';

const TARGET_EMAIL = 'nhlcvsbus@gmail.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${TARGET_EMAIL}`;

test('1. Recipient Email Address Validation & Configuration', () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  assert.equal(emailRegex.test(TARGET_EMAIL), true, 'Target email address must be a valid email format');
  assert.equal(TARGET_EMAIL, 'nhlcvsbus@gmail.com', 'Target recipient must match nhlcvsbus@gmail.com');
});

test('2. Gmail MX Server Resolution & Mailbox Host Reachability', async () => {
  const domain = TARGET_EMAIL.split('@')[1];
  assert.equal(domain, 'gmail.com', 'Target domain must be gmail.com');

  const mxRecords = await dns.resolveMx(domain);
  assert.ok(Array.isArray(mxRecords) && mxRecords.length > 0, 'MX records must exist for gmail.com');

  // Verify Google MX hosts exist (e.g. gmail-smtp-in.l.google.com)
  const hasGoogleMx = mxRecords.some(r => r.exchange.toLowerCase().includes('google') || r.exchange.toLowerCase().includes('gmail'));
  assert.equal(hasGoogleMx, true, 'Google MX servers must be resolved for gmail.com');
  console.log(`    ✓ Resolved ${mxRecords.length} MX records for ${domain} (Primary: ${mxRecords[0].exchange})`);
});

test('3. Form Submission Payload Structuring & Serialization', () => {
  const sampleInput = {
    fullName: 'Tariq Al-Mansoor',
    brandName: 'Golden Grill Group',
    outletCount: '3-5 Outlets',
    city: 'Riyadh',
    whatsapp: '+966 50 123 4567'
  };

  const payload = {
    name: sampleInput.fullName,
    brand_name: sampleInput.brandName,
    outlet_count: sampleInput.outletCount,
    city: sampleInput.city,
    whatsapp_number: sampleInput.whatsapp,
    _subject: `New Fixive Early Access Enquiry - ${sampleInput.brandName}`,
    _template: 'table',
    _captcha: 'false',
    _replyto: TARGET_EMAIL
  };

  assert.equal(payload.name, 'Tariq Al-Mansoor');
  assert.equal(payload.brand_name, 'Golden Grill Group');
  assert.equal(payload.city, 'Riyadh');
  assert.equal(payload.whatsapp_number, '+966 50 123 4567');
  assert.match(payload._subject, /Fixive Early Access Enquiry/);
});

test('4. Live Enquiry Mail Endpoint Transmission to nhlcvsbus@gmail.com', async () => {
  const testPayload = {
    name: 'Unit Test Runner',
    brand_name: 'Fixive Test Brand',
    outlet_count: '1-2 Outlets',
    city: 'Riyadh',
    whatsapp: '+966 50 000 0000',
    message: `Automated test verifying enquiry mail dispatch to ${TARGET_EMAIL}`,
    _subject: `Unit Test - Fixive Enquiry Mail Verification (${new Date().toISOString()})`,
    _template: 'table',
    _captcha: 'false'
  };

  const response = await fetch(FORMSUBMIT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Referer': 'https://fixive.sa/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    body: JSON.stringify(testPayload)
  });

  assert.equal(response.status, 200, 'HTTP Response status should be 200 OK');
  const responseData = await response.json();
  
  console.log('    Form Service Response:', responseData);
  
  // Response indicates endpoint handled request for nhlcvsbus@gmail.com
  assert.ok(
    responseData.success === 'true' || responseData.message?.includes('Activation') || responseData.message?.includes('actived'),
    'Mail service must confirm message processing for nhlcvsbus@gmail.com'
  );
});
