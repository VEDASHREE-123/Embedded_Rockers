// AI NEURAL NETWORK PARTICLE ANIMATION - FULL SCREEN IMMERSION
function initAIParticles() {
    const canvas = document.getElementById('bg-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initDots(); // Re-scatter nodes on resizing
    });

    let particles = [];
    const particleCount = 100; // Dense network of App parameters
    
    function initDots() {
        particles = [];
        for(let i=0; i<particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.2, // Subtle drifting
                vy: (Math.random() - 0.5) * 1.2,
                radius: Math.random() * 2 + 1
            });
        }
    }
    initDots();

    function animate() {
        requestAnimationFrame(animate);
        
        // Clear the canvas mathematically to let the beautiful CSS 4-color gradient breathe underneath it!
        ctx.clearRect(0, 0, width, height);
        
        // Render Particles (AI Nodes)
        ctx.fillStyle = '#ffffff'; // Brilliant White Nodes
        ctx.lineWidth = 1;
        
        for(let i=0; i<particleCount; i++) {
            let p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Rebound smoothly off screen edges
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;
            
            // Draw Node
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Connect close particles with neural-network web lines!
            for(let j = i + 1; j < particleCount; j++) {
                let p2 = particles[j];
                let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                
                if(dist < 140) {
                    ctx.globalAlpha = 1 - (dist / 140); // Fade out dynamically based on distance
                    ctx.strokeStyle = '#ffffff'; // Brilliant White Connections 
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1; // reset alpha for next drawing loop
                }
            }
        }
    }
    animate();
}

let currentIntent = "";

const domainCategories = [
    { id: 'travel', icon: '✈️', name: 'Travel Planning' },
    { id: 'finance', icon: '💰', name: 'Finance Management' },
    { id: 'healthcare', icon: '🏥', name: 'Healthcare' },
    { id: 'education', icon: '🎓', name: 'Education' },
    { id: 'event', icon: '🎉', name: 'Event Planning' }
];

/** Initialize Website Dynamics */
document.addEventListener("DOMContentLoaded", () => {
    
    initAIParticles(); // Execute the full-screen AI network canvas animation!
    
    const grid = document.getElementById('category-grid');
    
    domainCategories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <span class="category-icon">${category.icon}</span>
            <span class="category-name">${category.name}</span>
        `;
        card.onclick = () => fetchAppSchema(category.id);
        grid.appendChild(card);
    });

    const magicBtn = document.getElementById('magic-btn');
    if(magicBtn) magicBtn.addEventListener('click', runMagicGeneration);
});

/** MAGIC PREFILL GENERATION */
function detectCategoryFromText(text) {
    text = text.toLowerCase();
    
    if (/(trip|travel|flight|hotel|vacation|goa|days|tour)/.test(text)) return 'travel';
    if (/(budget|expense|spend|income|money|salary|save|₹|\$)/.test(text)) return 'finance';
    if (/(doctor|health|symptom|pain|hospital|medicine|pill|water|sick)/.test(text)) return 'healthcare';
    if (/(study|exam|course|assignment|subject|learn|student)/.test(text)) return 'education';
    if (/(party|wedding|birthday|event|guest|celebrate)/.test(text)) return 'event';
    
    return 'travel'; // fallback
}

function extractMagicData(text) {
    const data = {};
    const budgetMatch = text.match(/(?:rs\.?|₹|\$)\s*([\d,]+)/i);
    if (budgetMatch) {
        data.budget = budgetMatch[1].replace(/,/g, '');
    } else {
        const numMatch = text.match(/with\s+([\d,]+)/i) || text.match(/budget\s+of\s+([\d,]+)/i);
        if (numMatch) data.budget = numMatch[1].replace(/,/g, '');
    }
    
    const daysMatch = text.match(/(\d+)\s+days?/i);
    if (daysMatch) data.days = daysMatch[1];
    
    const destMatch = text.match(/to\s+([A-Z][a-zA-Z]*|[a-zA-Z]+)(?=\s|$|for|with)/i);
    if (destMatch) data.destination = destMatch[1];
    
    return data;
}

function prefillWorkspace(intent, data) {
    if (intent === 'travel') {
        if (data.destination) {
            const destEl = document.getElementById('travel-dest');
            if (destEl) destEl.value = data.destination.charAt(0).toUpperCase() + data.destination.slice(1);
        }
        if (data.budget) {
            const budgEl = document.getElementById('travel-total');
            if (budgEl) { budgEl.value = data.budget; budgEl.dispatchEvent(new Event('input')); }
        }
        if (data.days) {
            const btn = document.getElementById('travel-add-day');
            if (btn) {
                for (let i = 0; i < parseInt(data.days); i++) btn.click();
            }
        }
    } else if (intent === 'finance') {
        if (data.budget) {
            const limEl = document.getElementById('f-lim');
            if (limEl) { limEl.value = data.budget; limEl.dispatchEvent(new Event('input')); }
        }
    }
}

function runMagicGeneration() {
    const inputEl = document.getElementById('magic-input');
    const text = inputEl.value.trim();
    if (!text) return;
    
    const intent = detectCategoryFromText(text);
    const extracted = extractMagicData(text);
    
    // Show Loading
    document.getElementById('loading-modal').classList.add('active');
    
    setTimeout(() => {
        // Hide loading
        document.getElementById('loading-modal').classList.remove('active');
        
        if (typeof isSpecialApp === 'function' && isSpecialApp(intent)) {
            currentIntent = intent;
            renderSpecialApp(intent);
            prefillWorkspace(intent, extracted);
            openAppModal();
        } else {
            fetchAppSchema(intent); 
        }
    }, 1500); // 1.5 seconds delay
}

/** Modal Handlers */
function openAppModal() {
    const modal = document.getElementById('app-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeAppModal() {
    const modal = document.getElementById('app-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; 
    const magicInput = document.getElementById('magic-input');
    if(magicInput) magicInput.value = '';
}

document.getElementById('app-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAppModal();
    }
});

/** Fetches corresponding UI Config from Flask Backend */
async function fetchAppSchema(intentId) {
    if (typeof isSpecialApp === 'function' && isSpecialApp(intentId)) {
        currentIntent = intentId;
        renderSpecialApp(intentId);
        openAppModal();
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intent: intentId })
        });
        
        const data = await response.json();
        
        if (data.ui_schema) {
            currentIntent = data.intent_detected;
            renderDynamicApp(data.ui_schema);
            openAppModal(); 
        }
    } catch (e) {
        alert("Ensure app.py backend is running on 127.0.0.1:5000!");
    }
}

/** Appends Form Controls to the DOM Model Real-Time */
function renderDynamicApp(schema) {
    const canvas = document.getElementById('dynamic-canvas');
    canvas.innerHTML = ''; 
    
    const appWrapper = document.createElement('div');
    appWrapper.className = 'dynamic-app';
    
    const title = document.createElement('h2');
    title.textContent = schema.title;
    appWrapper.appendChild(title);
    
    const desc = document.createElement('p');
    desc.textContent = schema.description;
    appWrapper.appendChild(desc);
    
    schema.components.forEach(comp => {
        const compDiv = document.createElement('div');
        compDiv.className = 'dynamic-component';
        
        if (comp.label && comp.type !== 'button') {
            const label = document.createElement('label');
            label.textContent = comp.label;
            compDiv.appendChild(label);
        }
        
        if (comp.type === 'input') {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = comp.id;
            compDiv.appendChild(input);
        } 
        else if (comp.type === 'date') {
            const input = document.createElement('input');
            input.type = 'date';
            input.id = comp.id;
            compDiv.appendChild(input);
        }
        else if (comp.type === 'select') {
            const select = document.createElement('select');
            select.id = comp.id;
            comp.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.toLowerCase();
                option.textContent = opt;
                select.appendChild(option);
            });
            compDiv.appendChild(select);
        }
        else if (comp.type === 'button') {
            const button = document.createElement('button');
            button.id = comp.id;
            button.textContent = comp.label;
            
            button.onclick = () => {
                if (comp.action === 'reset') {
                    closeAppModal();
                    return;
                }
                const inputs = appWrapper.querySelectorAll('input, select');
                const formData = {};
                inputs.forEach(inp => { formData[inp.id] = inp.value; });
                submitFormData(currentIntent, formData, button);
            };
            compDiv.appendChild(button);
        }
        else if (comp.type === 'text') {
            const textPanel = document.createElement('div');
            textPanel.className = 'info-panel';
            textPanel.textContent = comp.content;
            compDiv.appendChild(textPanel);
        }
        else if (comp.type === 'chart') {
            const chartArea = document.createElement('div');
            chartArea.innerHTML = `<div class="chart-bar-bg"><div class="chart-bar-fill"></div></div>`;
            compDiv.appendChild(chartArea);
        }
        
        appWrapper.appendChild(compDiv);
    });
    
    canvas.appendChild(appWrapper);
}

/** Handles Dynamic Processed Data Resubmission Loop */
async function submitFormData(intent, formData, btn) {
    btn.textContent = "Processing...";
    try {
        const response = await fetch('http://127.0.0.1:5000/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intent: intent, form_data: formData })
        });
        const data = await response.json();
        if (data.success && data.ui_schema) {
            renderDynamicApp(data.ui_schema);
        }
    } catch (e) {
        btn.textContent = "Error";
    }
}
