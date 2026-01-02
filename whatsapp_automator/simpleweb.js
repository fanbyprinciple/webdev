const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

client.on('qr', qr => {
    console.clear();
    qrcode.generate(qr, { small: true });
    console.log('>>Scan this QR code with WhatsApp\n');
    console.log('1. Open WhatsApp on your phone');
    console.log('2. Tap Menu → Linked Devices → Link a Device');
    console.log('3. Scan the QR code above');
});

client.on('ready', () => {
    console.log('>>WhatsApp bot is ready!');
    console.log('Send "!ping" to test it');
});

client.on('authenticated', () => {
    console.log('>>Authenticated successfully!');
});

client.on('auth_failure', msg => {
    console.error('>>Authentication failed:', msg);
});

client.on('message', msg => {
    console.log(`>>Message from ${msg.from}: ${msg.body}`);
    
    if (msg.body[0] == '!') {

        msg.reply('🏓 pong!');
    }
    
});

console.log('🚀 Starting WhatsApp bot...');
client.initialize();