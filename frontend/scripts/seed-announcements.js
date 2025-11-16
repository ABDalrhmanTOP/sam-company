#!/usr/bin/env node
/* eslint-disable */
const axios = require('axios');

async function main() {
  const BASE = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  const TOKEN = process.env.ADMIN_TOKEN || '<PUT_ADMIN_TOKEN_HERE>';

  const client = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } });
  client.interceptors.request.use((config) => {
    if (TOKEN && TOKEN !== '<PUT_ADMIN_TOKEN_HERE>') {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
  });

  const today = new Date().toISOString().slice(0, 10);
  const announcements = [
    { text: 'عرض تجريبي اليوم فقط! إنترنت أسرع بسعر أقل', cta: 'اشترك الآن', language: 'ar', is_active: true, date: today },
    { text: 'Limited time: Fiber promo!', cta: 'Subscribe', language: 'en', is_active: false, date: today },
    { text: 'ترقية مجانية للسرعة لمدة شهر', cta: 'اعرف المزيد', language: 'ar', is_active: false, date: today },
  ];

  console.log(`Seeding announcements to ${BASE} ...`);
  for (const a of announcements) {
    try {
      await client.post('/api/admin/announcements', a);
      console.log('Created:', a.text);
    } catch (err) {
      console.warn('Failed to create:', a.text, err?.response?.status, err?.response?.data || err.message);
    }
  }

  try {
    const { data } = await client.get('/api/announcements/active');
    console.log('Active announcement:', data);
  } catch (err) {
    console.warn('Failed to fetch active announcement', err?.response?.status, err?.response?.data || err.message);
  }

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});








