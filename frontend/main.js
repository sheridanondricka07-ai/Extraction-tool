document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const domainMode = document.getElementById('domainMode');
    const resultCount = document.getElementById('resultCount');
    const extractDomainsBtn = document.getElementById('extractDomains');
    const extractIPsBtn = document.getElementById('extractIPs');
    const extractBothBtn = document.getElementById('extractBoth');
    const clearInputBtn = document.getElementById('clearInput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const toast = document.getElementById('toast');

    // API URL - Adjust based on environment
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3000/api' 
        : '/api';

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.remove('opacity-0', 'translate-y-4');
        toast.classList.add('opacity-100', '-translate-y-2');
        setTimeout(() => {
            toast.classList.remove('opacity-100', '-translate-y-2');
            toast.classList.add('opacity-0', 'translate-y-4');
        }, 2000);
    };

    const handleExtraction = async (endpoint, payload) => {
        try {
            // UI Loading state
            resultCount.textContent = 'Processing...';
            outputText.placeholder = 'Extracting data...';

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Extraction failed');

            const data = await response.json();
            
            let results = [];
            let totalCount = 0;

            if (endpoint === '/extract/both') {
                results = [...data.domains.results, ...data.ips.results];
                totalCount = data.domains.count + data.ips.count;
            } else {
                results = data.results;
                totalCount = data.count;
            }

            outputText.value = results.join('\n');
            resultCount.textContent = `${totalCount} items found`;
            
            if (totalCount === 0) {
                outputText.placeholder = 'No items found in the provided text.';
            }

        } catch (error) {
            console.error(error);
            resultCount.textContent = 'Error occurred';
            showToast('Failed to connect to backend');
        }
    };

    extractDomainsBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) return showToast('Please enter some text');
        handleExtraction('/extract/domains', { text, mode: domainMode.value });
    });

    extractIPsBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) return showToast('Please enter some text');
        handleExtraction('/extract/ips', { text });
    });

    extractBothBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) return showToast('Please enter some text');
        handleExtraction('/extract/both', { text, mode: domainMode.value });
    });

    clearInputBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        resultCount.textContent = '0 items found';
        showToast('Input cleared');
    });

    copyBtn.addEventListener('click', () => {
        if (!outputText.value) return showToast('Nothing to copy');
        navigator.clipboard.writeText(outputText.value).then(() => {
            showToast('Copied to clipboard!');
        });
    });

    downloadBtn.addEventListener('click', () => {
        if (!outputText.value) return showToast('Nothing to download');
        
        const blob = new Blob([outputText.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `extracted_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Download started');
    });
});
