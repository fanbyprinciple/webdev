const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI('your-api-key-here');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

client.on('qr', qr => {
    console.clear();
    qrcode.generate(qr, { small: true });
    console.log('>>Scan QR code with WhatsApp');
});

client.on('ready', () => {
    console.log('>>Bot ready! Type ![question] to chat with Gemini');
});

client.on('message', async msg => {
    console.log(`From ${msg.from}: ${msg.body}`);
    
    // Skip status messages
    if (msg.from === 'status@broadcast') return;
    
    // Simple command handler
    if (msg.body.startsWith('!') ) {

        const question = msg.body.slice(1).trim();
        
        if (!question) {
            msg.reply('❌ Please provide a question after !ask');
            return;
        }
        
        try {
            await msg.reply('💭 Thinking...');
            
            const result = await model.generateContent(question);
            const response = await result.response;
            const answer = response.text();
            
            await msg.reply(answer);
            
        } catch (error) {
            console.error('Error:', error);
            msg.reply('❌ Error: ' + error.message);
        }
    }
    else if (msg.body === '!ping') {
        msg.reply('🏓 pong!');
    }
    else if (msg.body === '!help') {
        msg.reply('Commands: !ping, !ask [question], !gemini [question]');
    }
});

console.log('🚀 Starting WhatsApp bot...');
client.initialize();