const express = require('express');
const cors = require('cors');
const psl = require('psl');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to clean and extract domains
const extractDomains = (text, mode) => {
    // 1. Remove emails (strip everything before @)
    const textWithoutEmails = text.replace(/[a-zA-Z0-9._%+-]+@/g, '');
    
    // 2. Remove protocols (http, https, ftp, etc.)
    const textWithoutProtocols = textWithoutEmails.replace(/(https?|ftp|file):\/\//gi, '');

    // 3. Robust Domain Regex
    // This matches standard domain patterns but excludes things that are clearly not domains (like just numbers)
    const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/gi;
    
    const matches = textWithoutProtocols.match(domainRegex) || [];
    
    let processed = matches.map(d => d.toLowerCase());

    if (mode === 'root') {
        processed = processed.map(d => {
            const parsed = psl.get(d);
            return parsed || d; // Fallback to original if parsing fails
        });
    }

    // Remove duplicates
    return [...new Set(processed)].filter(d => d.includes('.')); // Ensure it has at least one dot
};

// Helper to extract valid IPv4
const extractIPs = (text) => {
    const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    const matches = text.match(ipRegex) || [];
    return [...new Set(matches)];
};

app.post('/api/extract/domains', (req, res) => {
    const { text, mode } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });
    
    const domains = extractDomains(text, mode);
    res.json({ 
        count: domains.length,
        results: domains
    });
});

app.post('/api/extract/ips', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });
    
    const ips = extractIPs(text);
    res.json({ 
        count: ips.length,
        results: ips
    });
});

// Bonus: Extract Both
app.post('/api/extract/both', (req, res) => {
    const { text, mode } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });
    
    const domains = extractDomains(text, mode);
    const ips = extractIPs(text);
    
    res.json({ 
        domains: {
            count: domains.length,
            results: domains
        },
        ips: {
            count: ips.length,
            results: ips
        }
    });
});

// Export the app for Vercel
module.exports = app;
