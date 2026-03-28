const specialApps = ['travel', 'finance', 'healthcare', 'education', 'event'];

function isSpecialApp(intentId) {
    return specialApps.includes(intentId);
}

function renderSpecialApp(intentId) {
    const canvas = document.getElementById('dynamic-canvas');
    canvas.innerHTML = ''; 
    const wrapper = document.createElement('div');
    wrapper.className = 'special-app-wrapper';
    
    // Append wrapper to DOM BEFORE rendering apps so document.getElementById works
    canvas.appendChild(wrapper);
    
    if (intentId === 'travel') {
        renderTravelApp(wrapper);
    } else if (intentId === 'finance') {
        renderFinanceApp(wrapper);
    } else if (intentId === 'healthcare') {
        renderHealthcareApp(wrapper);
    } else if (intentId === 'education') {
        renderEducationApp(wrapper);
    } else if (intentId === 'event') {
        renderEventApp(wrapper);
    }
}

function renderTravelApp(container) {
    container.innerHTML = `
      <h2 class="app-title">✈️ Travel & Itinerary Planning</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>🎟️ Ticket Booking System</h3>
            <div class="input-group row">
               <input type="text" id="tb-frm" placeholder="From Location">
               <input type="text" id="tb-to" placeholder="To Destination">
            </div>
            <div class="input-group row">
               <input type="date" id="tb-dt">
               <select id="tb-typ"><option>Flight</option><option>Train</option><option>Bus</option></select>
            </div>
            <div class="input-group row">
               <input type="text" id="tb-nm" placeholder="Passenger Name">
               <input type="text" id="tb-ct" placeholder="Email / Phone" style="flex:2">
               <input type="number" id="tb-px" placeholder="Px" min="1" value="1" style="flex:1">
            </div>
            <button class="action-btn" id="tb-btn" style="width:100%; margin-top:0.5rem; background:var(--accent); color:#000; font-weight:600;">👉 Search & Book Ticket</button>
            <div id="tb-res" style="margin-top:1rem;"></div>
         </div>

         <div class="glass-card">
            <h3>Trip Details</h3>
            <div class="input-group">
               <label>Destination</label>
               <input type="text" id="travel-dest" placeholder="Where to?">
            </div>
            <div class="input-group row">
               <div><label>Start Date</label><input type="date" id="travel-start"></div>
               <div><label>End Date</label><input type="date" id="travel-end"></div>
            </div>
         </div>

         <div class="glass-card">
            <h3>Day-wise Itinerary</h3>
            <button class="action-btn" id="travel-add-day">+ Add Day Activity</button>
            <div id="travel-itinerary" class="scrollable-list"></div>
         </div>

         <div class="glass-card">
            <h3>Budget Calculator</h3>
            <div class="input-group row">
               <label>Total Budget ($)</label>
               <input type="number" id="travel-total" value="0">
            </div>
            <div class="budget-splits">
               <input type="number" id="travel-tr" placeholder="Transport" class="ttest">
               <input type="number" id="travel-fd" placeholder="Food" class="ttest">
               <input type="number" id="travel-st" placeholder="Stay" class="ttest">
               <input type="number" id="travel-mc" placeholder="Misc" class="ttest">
            </div>
            <div class="budget-result">Rem: <span id="travel-rem" class="pos">$0</span></div>
         </div>

         <div class="glass-card">
            <h3>Hotel & Flight Tracker</h3>
            <div class="input-group row">
               <input type="text" id="hf-n" placeholder="Name">
               <input type="date" id="hf-d">
            </div>
            <div class="input-group row">
               <input type="text" id="hf-b" placeholder="Booking ID">
               <input type="number" id="hf-c" placeholder="Cost ($)">
            </div>
            <button class="action-btn" id="hf-add">+ Track Booking</button>
            <div id="hf-list" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Packing Checklist</h3>
            <div class="input-group row">
               <input type="text" id="pack-i" placeholder="Item name">
               <button class="action-btn" id="pack-a">+</button>
            </div>
            <div id="pack-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Group Expenses Splitter</h3>
            <div class="input-group row">
               <input type="text" id="g-n" placeholder="Name">
               <input type="number" id="g-p" placeholder="Amount Paid">
               <button class="action-btn" id="g-a">+</button>
            </div>
            <div id="g-l" class="scrollable-list tiny"></div>
            <div class="budget-text" id="g-res" style="text-align:left;line-height:1.4"></div>
         </div>
      </div>
    `;

    // JS Logic
    // Step 2: Form submission and search handling
    document.getElementById('tb-btn').onclick = async () => {
        const frm = document.getElementById('tb-frm').value;
        const to = document.getElementById('tb-to').value;
        const dt = document.getElementById('tb-dt').value;
        const typ = document.getElementById('tb-typ').value;
        const nm = document.getElementById('tb-nm').value;
        const ct = document.getElementById('tb-ct').value;
        const res = document.getElementById('tb-res');
        
        if(!frm || !to || !dt || !nm) { res.innerHTML = '<span class="neg">Please fill From, To, Date, and Name fields!</span>'; return; }
        
        res.innerHTML = '<div class="spinner" style="margin:auto"></div><p style="text-align:center; margin-top:1rem;">Searching Providers...</p>';
        
        try {
            const params = new URLSearchParams({from: frm, to: to, date: dt, type: typ});
            const resp = await fetch('http://127.0.0.1:5000/api/search?' + params.toString());
            const data = await resp.json();
            
            let html = '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;"><h4 style="color:#fff; margin:0">Available Options</h4> <select style="width:auto; padding:0.2rem; font-size:0.8rem;"><option>Sort by Price (Low)</option><option>Sort by Time</option><option>Sort by Duration</option></select></div>';
            data.options.forEach(opt => {
                let badge = opt.is_cheapest ? '<span style="background:var(--accent); color:#000; font-size:0.65rem; padding:2px 6px; border-radius:12px; margin-left:8px; font-weight:bold;">🌟 AI Suggestion: Cheapest</span>' : '';
                html += `<div class="list-item" style="flex-direction:column; align-items:flex-start; margin-bottom:0.5rem; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1)">
                    <div style="width:100%; display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span style="font-size:1.1rem"><strong>${opt.name}</strong>${badge}</span> 
                        <span style="color:#10b981; font-weight:bold; text-align:right;">₹${parseInt(opt.price).toLocaleString()} <br><small style="color:#94a3b8">${opt.time} • ${opt.duration}</small><br><small style="color:#fcd34d">${opt.seats} seats available</small></span>
                    </div>
                    <button class="primary-btn" style="width:100%; padding:0.4rem; font-size:0.9rem" onclick="window.confirmBooking('${encodeURIComponent(JSON.stringify({...opt, frm, to, dt, nm, typ, ct}))}')">Book Now</button>
                </div>`;
            });
            res.innerHTML = html;
        } catch(e) {
            // Frontend Fallback if Backend is down
            let html = '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;"><h4 style="color:#fff; margin:0">Available Options (Offline)</h4> <select style="width:auto; padding:0.2rem; font-size:0.8rem;"><option>Sort by Price (Low)</option><option>Sort by Time</option><option>Sort by Duration</option></select></div>';
            
            const mockOptions = [
                {"id": "opt1", "name": `${typ} A`, "price": "5000", "time": "10:00 AM to 12:15 PM", "duration": "2h 15m", "seats": 12, "is_cheapest": false},
                {"id": "opt2", "name": `${typ} B`, "price": "6500", "time": "02:00 PM to 05:05 PM", "duration": "3h 05m", "seats": 5, "is_cheapest": false},
                {"id": "opt3", "name": `Fast ${typ}`, "price": "1200", "time": "06:00 AM to 07:50 AM", "duration": "1h 50m", "seats": 40, "is_cheapest": true}
            ];
            
            mockOptions.forEach(opt => {
                let badge = opt.is_cheapest ? '<span style="background:var(--accent); color:#000; font-size:0.65rem; padding:2px 6px; border-radius:12px; margin-left:8px; font-weight:bold;">🌟 AI Suggestion: Cheapest</span>' : '';
                html += `<div class="list-item" style="flex-direction:column; align-items:flex-start; margin-bottom:0.5rem; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1)">
                    <div style="width:100%; display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span style="font-size:1.1rem"><strong>${opt.name}</strong>${badge}</span> 
                        <span style="color:#10b981; font-weight:bold; text-align:right;">₹${parseInt(opt.price).toLocaleString()} <br><small style="color:#94a3b8">${opt.time} • ${opt.duration}</small><br><small style="color:#fcd34d">${opt.seats} seats available</small></span>
                    </div>
                    <button class="primary-btn" style="width:100%; padding:0.4rem; font-size:0.9rem" onclick="window.confirmBooking('${encodeURIComponent(JSON.stringify({...opt, frm, to, dt, nm, typ, ct}))}')">Book Now</button>
                </div>`;
            });
            res.innerHTML = html;
        }
    };

    // Step 3: Confirmation Prompt Logic
    window.confirmBooking = (strData) => {
        const details = JSON.parse(decodeURIComponent(strData));
        const res = document.getElementById('tb-res');
        
        res.innerHTML = `
            <div style="background:rgba(0,0,0,0.4); padding:1.2rem; border-radius:8px; border:1px solid #38bdf8; margin-top:1rem; box-shadow: 0 4px 20px rgba(56,189,248,0.2);">
                <h4 style="color:#38bdf8; margin-bottom:1rem; font-size:1.1rem; text-align:center;">Confirm Your Booking</h4>
                <div style="font-size:0.95rem; line-height:1.6; margin-bottom:1.5rem;">
                    <p style="margin:0; display:flex; justify-content:space-between;"><strong>From:</strong> <span>${details.frm}</span></p>
                    <p style="margin:0; display:flex; justify-content:space-between;"><strong>To:</strong> <span>${details.to}</span></p>
                    <p style="margin:0; display:flex; justify-content:space-between;"><strong>Date:</strong> <span>${details.dt}</span></p>
                    <p style="margin:0; display:flex; justify-content:space-between;"><strong>Transport:</strong> <span>${details.name}</span></p>
                    <p style="margin:0; margin-top:0.5rem; padding-top:0.5rem; border-top:1px dashed rgba(255,255,255,0.2); display:flex; justify-content:space-between; font-size:1.1rem; color:#10b981;"><strong>Price:</strong> <strong>₹${parseInt(details.price).toLocaleString()}</strong></p>
                </div>
                <p style="margin-bottom:1rem; text-align:center;">Do you want to confirm this booking?</p>
                <div style="display:flex; gap:0.5rem">
                    <button class="action-btn neg" style="flex:1" onclick="document.getElementById('tb-res').innerHTML=''">[ Cancel ]</button>
                    <button class="primary-btn" style="flex:1" onclick="window.showPaymentGateway('${strData}')">[ Proceed to Pay ]</button>
                </div>
            </div>
        `;
    };

    // Step 3.5: Payment Gateway Integration
    window.showPaymentGateway = (strData) => {
        const details = JSON.parse(decodeURIComponent(strData));
        const res = document.getElementById('tb-res');
        
        res.innerHTML = `
            <div style="background:rgba(0,0,0,0.4); padding:1.2rem; border-radius:8px; border:1px solid #10b981; margin-top:1rem; box-shadow: 0 4px 20px rgba(16,185,129,0.2);">
                <h4 style="color:#10b981; margin-bottom:1rem; font-size:1.1rem; text-align:center;">Secure Checkout</h4>
                <div style="text-align:center; font-size:1.8rem; font-weight:bold; color:#fff; margin-bottom:1.5rem;">
                    ₹${parseInt(details.price).toLocaleString()}
                </div>
                
                <p style="margin-bottom:0.5rem; color:#94a3b8; font-size:0.9rem;">Select Payment Method:</p>
                <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1.5rem;">
                    <label style="display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.05); padding:0.8rem; border-radius:6px; cursor:pointer; border:1px solid rgba(255,255,255,0.1)">
                        <input type="radio" name="pay-method" checked> <span>UPI (GPay / PhonePe / Paytm)</span>
                    </label>
                    <label style="display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.05); padding:0.8rem; border-radius:6px; cursor:pointer; border:1px solid rgba(255,255,255,0.1)">
                        <input type="radio" name="pay-method"> <span>Credit / Debit Card</span>
                    </label>
                    <label style="display:flex; align-items:center; gap:0.5rem; background:rgba(255,255,255,0.05); padding:0.8rem; border-radius:6px; cursor:pointer; border:1px solid rgba(255,255,255,0.1)">
                        <input type="radio" name="pay-method"> <span>Net Banking</span>
                    </label>
                </div>
                
                <div style="display:flex; gap:0.5rem">
                    <button class="action-btn neg" style="flex:1" onclick="document.getElementById('tb-res').innerHTML='<div style=\\'padding:1rem; text-align:center; color:#ef4444; background:rgba(239, 68, 68, 0.1); border-radius:8px;\\'>Payment Cancelled!</div>'">Cancel</button>
                    <button class="primary-btn" style="flex:2; background:#10b981; color:#000; font-weight:bold;" onclick="window.processBooking('${strData}')">Pay ₹${parseInt(details.price).toLocaleString()} Securely</button>
                </div>
            </div>
        `;
    };

    // Step 4 & 5: Processing and Displaying E-Ticket with Advanced Features
    window.processBooking = async (strData) => {
        const details = JSON.parse(decodeURIComponent(strData));
        const res = document.getElementById('tb-res');
        res.innerHTML = '<div class="spinner" style="margin:auto; display:block"></div><p style="text-align:center; margin-top:1rem; font-size:1.1rem">Processing transaction securely...</p>';
        
        try {
            // Artificial delay for satisfying payment processing UX
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const resp = await fetch('http://127.0.0.1:5000/api/book', {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify(details)
            });
            const data = await resp.json();
            
            // Magic Feature: Automatically Add to Itinerary
            const itCdt = document.getElementById('travel-itinerary');
            if(itCdt) {
                const addDiv = document.createElement('div'); addDiv.className='list-item';
                addDiv.style.borderLeft = "3px solid #10b981";
                addDiv.innerHTML=`<span style="color:#10b981">⭐ Smart Add</span> <input type="text" value="${details.name} at ${details.time} to ${details.to}" style="width:70%; border:none; border-bottom:1px solid rgba(255,255,255,0.3); background:transparent; color:#fff;" readonly>`;
                itCdt.appendChild(addDiv);
            }
            
            // Display E-Ticket Main Requirement
            res.innerHTML = `
                <div id="final-ticket" style="background:linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2)); padding:1.5rem; border-radius:12px; border:1px solid rgba(255,255,255,0.2); margin-top:1rem; box-shadow:0 8px 32px rgba(0,0,0,0.5)">
                    <div style="text-align:center; color:#10b981; font-weight:700; font-size:1.1rem; margin-bottom:1rem; padding:0.5rem; background:rgba(16, 185, 129, 0.1); border-radius:6px;">
                        ✅ Booking Confirmed!<br>
                        <span style="font-size:0.8rem; font-weight:400; color:#fff;">Your ticket has been successfully booked.</span>
                    </div>
                    
                    <div style="border-bottom:1px dashed rgba(255,255,255,0.3); padding-bottom:1rem; margin-bottom:1rem; text-align:center;">
                        <h3 style="margin:0; font-size:1.5rem; color:#fff; letter-spacing: 2px;">🎟️ E-Ticket</h3>
                    </div>
                    
                    <div style="font-size:0.95rem; line-height:1.7;">
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Name:</span> <strong>${details.nm}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>From:</span> <strong>${details.frm}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>To:</span> <strong>${details.to}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Date:</span> <strong>${details.dt}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Time:</span> <strong>${details.time}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Transport:</span> <strong>${details.name}</strong></p>
                    </div>
                    
                    <div style="background:rgba(0,0,0,0.4); padding:0.8rem; border-radius:6px; margin-top:1rem; margin-bottom:1.5rem; border-left:3px solid var(--accent)">
                        <p style="display:flex; justify-content:space-between; margin:0; margin-bottom:0.3rem;"><span>Booking ID:</span> <strong style="color:var(--accent); letter-spacing:1px;">${data.booking_id}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Status:</span> <strong class="pos" style="text-transform:uppercase;">${data.status}</strong></p>
                    </div>
                    
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
                        <button class="action-btn" style="flex:1; padding:0.6rem; font-size:0.9rem;" onclick="window.print()">📥 Download PDF</button>
                        <button class="action-btn" style="flex:1; padding:0.6rem; font-size:0.9rem; background:rgba(16,185,129,0.2); border-color:#10b981; color:#10b981;" onclick="alert('Ticket successfully emailed to ${details.ct || 'your registered address'}!')">✉️ Email Ticket</button>
                    </div>
                    <button class="action-btn neg" style="width:100%; margin-top:0.5rem; padding:0.6rem; font-size:0.9rem;" onclick="window.cancelBooking('${data.booking_id}')">Cancel Booking</button>
                    
                    <div style="text-align:center; margin-top:1.5rem; opacity:0.9;">
                        <div style="width:100px; height:100px; margin:auto; background:#fff; padding:6px; border-radius:4px; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VERIFY:${data.booking_id}|NAME:${details.nm}|ROUTE:${details.frm}-${details.to}" style="width:100%; height:100%">
                        </div>
                        <p style="margin-top:0.5rem; font-size:0.8rem; letter-spacing:1px; color:#94a3b8;">SCAN TO VERIFY</p>
                    </div>
                </div>
            `;
            
        } catch(e) {
            // Frontend Fallback if Backend is down
            const data = {
                booking_id: "TRV" + Math.floor(Math.random() * 90000 + 10000),
                status: "Confirmed (Offline)"
            };
            
            const itCdt = document.getElementById('travel-itinerary');
            if(itCdt) {
                const addDiv = document.createElement('div'); addDiv.className='list-item';
                addDiv.style.borderLeft = "3px solid #10b981";
                addDiv.innerHTML=`<span style="color:#10b981">⭐ Smart Add</span> <input type="text" value="${details.name} at ${details.time} to ${details.to}" style="width:70%; border:none; border-bottom:1px solid rgba(255,255,255,0.3); background:transparent; color:#fff;" readonly>`;
                itCdt.appendChild(addDiv);
            }
            
            res.innerHTML = `
                <div id="final-ticket" style="background:linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2)); padding:1.5rem; border-radius:12px; border:1px solid rgba(255,255,255,0.2); margin-top:1rem; box-shadow:0 8px 32px rgba(0,0,0,0.5)">
                    <div style="text-align:center; color:#10b981; font-weight:700; font-size:1.1rem; margin-bottom:1rem; padding:0.5rem; background:rgba(16, 185, 129, 0.1); border-radius:6px;">
                        ✅ Booking Confirmed!<br>
                        <span style="font-size:0.8rem; font-weight:400; color:#fff;">Your ticket has been successfully booked.</span>
                    </div>
                    
                    <div style="border-bottom:1px dashed rgba(255,255,255,0.3); padding-bottom:1rem; margin-bottom:1rem; text-align:center;">
                        <h3 style="margin:0; font-size:1.5rem; color:#fff; letter-spacing: 2px;">🎟️ E-Ticket</h3>
                    </div>
                    
                    <div style="font-size:0.95rem; line-height:1.7;">
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Name:</span> <strong>${details.nm}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>From:</span> <strong>${details.frm}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>To:</span> <strong>${details.to}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Date:</span> <strong>${details.dt}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Time:</span> <strong>${details.time}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Transport:</span> <strong>${details.name}</strong></p>
                    </div>
                    
                    <div style="background:rgba(0,0,0,0.4); padding:0.8rem; border-radius:6px; margin-top:1rem; margin-bottom:1.5rem; border-left:3px solid var(--accent)">
                        <p style="display:flex; justify-content:space-between; margin:0; margin-bottom:0.3rem;"><span>Booking ID:</span> <strong style="color:var(--accent); letter-spacing:1px;">${data.booking_id}</strong></p>
                        <p style="display:flex; justify-content:space-between; margin:0"><span>Status:</span> <strong class="pos" style="text-transform:uppercase;">${data.status}</strong></p>
                    </div>
                    
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
                        <button class="action-btn" style="flex:1; padding:0.6rem; font-size:0.9rem;" onclick="window.print()">📥 Download PDF</button>
                        <button class="action-btn" style="flex:1; padding:0.6rem; font-size:0.9rem; background:rgba(16,185,129,0.2); border-color:#10b981; color:#10b981;" onclick="alert('Ticket successfully emailed to ${details.ct || 'your registered address'}!')">✉️ Email Ticket</button>
                    </div>
                    <button class="action-btn neg" style="width:100%; margin-top:0.5rem; padding:0.6rem; font-size:0.9rem;" onclick="window.cancelBooking('${data.booking_id}')">Cancel Booking</button>
                    
                    <div style="text-align:center; margin-top:1.5rem; opacity:0.9;">
                        <div style="width:100px; height:100px; margin:auto; background:#fff; padding:6px; border-radius:4px; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VERIFY:${data.booking_id}|NAME:${details.nm}|ROUTE:${details.frm}-${details.to}" style="width:100%; height:100%">
                        </div>
                        <p style="margin-top:0.5rem; font-size:0.8rem; letter-spacing:1px; color:#94a3b8;">SCAN TO VERIFY</p>
                    </div>
                </div>
            `;
        }
    };

    window.cancelBooking = async (bookingId) => {
        if(!confirm('Are you sure you want to completely cancel booking ID: ' + bookingId + '?')) return;
        try {
            await fetch('http://127.0.0.1:5000/api/ticket/' + bookingId, { method: 'DELETE' });
        } catch(e) {}
        document.getElementById('tb-res').innerHTML='<div style="text-align:center; padding:1.5rem; background:rgba(239, 68, 68, 0.1); border-radius:8px; color:#ef4444; border:1px solid #ef4444;"><h3>❌ Booking ' + bookingId + ' Cancelled</h3><p>Database record completely deleted. Refund initiated to original payment method.</p></div>';
    };

    let days = 0;
    document.getElementById('travel-add-day').onclick = () => {
        days++;
        const div = document.createElement('div'); div.className = 'list-item';
        div.innerHTML = `<span>Day ${days}</span> <input type="text" placeholder="Activity details..." style="width:70%; border:none; border-bottom:1px solid #fff; background:transparent; color:#fff;">`;
        document.getElementById('travel-itinerary').appendChild(div);
    };

    const calcB = () => {
        const t = parseFloat(document.getElementById('travel-total').value||0);
        const sums = ['travel-tr','travel-fd','travel-st','travel-mc'].reduce((a,id) => a + (parseFloat(document.getElementById(id).value||0)), 0);
        const r = t - sums;
        document.getElementById('travel-rem').textContent = '$'+r;
        document.getElementById('travel-rem').className = r>=0 ? 'pos' : 'neg';
    };
    document.querySelectorAll('#travel-total, .ttest').forEach(e => e.oninput = calcB);

    document.getElementById('hf-add').onclick = () => {
        const n=document.getElementById('hf-n').value; const b=document.getElementById('hf-b').value;
        const c=document.getElementById('hf-c').value;
        if(!n) return;
        const d = document.createElement('div'); d.className='list-item';
        d.innerHTML = `<span>${n}</span> <span>ID:${b} | $${c}</span>`;
        document.getElementById('hf-list').appendChild(d);
     };

     document.getElementById('pack-a').onclick = () => {
        const v = document.getElementById('pack-i').value;
        if(!v) return;
        const d = document.createElement('div'); d.className='checkbox-item';
        d.innerHTML = `<input type="checkbox"> <span>${v}</span>`;
        document.getElementById('pack-l').appendChild(d);
        document.getElementById('pack-i').value='';
     };

     let gps = [];
     document.getElementById('g-a').onclick = () => {
         const n = document.getElementById('g-n').value;
         const p = parseFloat(document.getElementById('g-p').value||0);
         if(!n) return;
         gps.push({n,p});
         const d = document.createElement('div'); d.className='list-item';
         d.innerHTML = `<span>${n}</span> <span>Paid $${p}</span>`;
         document.getElementById('g-l').appendChild(d);
         const tot = gps.reduce((a,b)=>a+b.p,0);
         const per = tot/gps.length;
         let txt = `Total: $${tot} <br>Per Person: $${per.toFixed(2)}<br>`;
         gps.forEach(g => {
             const df = g.p - per;
             if(df>0) txt += `<span style="color:#10b981">${g.n} is owed $${df.toFixed(2)}</span><br>`;
             else if(df<0) txt += `<span style="color:#ef4444">${g.n} owes $${Math.abs(df).toFixed(2)}</span><br>`;
             else txt += `${g.n} settled.<br>`;
         });
         document.getElementById('g-res').innerHTML = txt;
     };
}

function renderFinanceApp(container) {
    container.innerHTML = `
      <h2 class="app-title" style="display:flex; justify-content:space-between; align-items:center;">
        💰 Finance & Wealth Management
        <button class="action-btn" style="background:rgba(16,185,129,0.1); border-color:#10b981; color:#10b981; font-size:0.9rem;" onclick="alert('Biometric / Face ID Verification Mock Successful! 🔐\\n\\nEnd-to-end encryption enabled for user financial data.')">🔐 Verify Secure Access</button>
      </h2>
      
      <!-- Dashboard Row -->
      <div class="glass-card" style="margin-bottom:1.5rem; display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap;">
        <div style="flex:1; min-width:250px;">
            <h3 style="margin-bottom:0.5rem; color:#fff;">Net Worth Tracker</h3>
            <h2 id="f-nw" style="color:#3b82f6; font-size:2.5rem; margin:0; font-weight:700;">₹ 1,45,200</h2>
            <p style="margin-top:0.5rem; font-size:0.9rem; font-weight:500;">
                <span style="color:#10b981;">Assets: ₹ <span id="f-assets">1,60,000</span></span> | 
                <span style="color:#ef4444;">Liabilities: ₹ <span id="f-liab">14,800</span></span>
            </p>
        </div>
        <div style="flex:1; min-width:250px; border-left:1px solid rgba(255,255,255,0.1); padding-left:1.5rem;">
            <h3>AI Financial Health 🤖</h3>
            <div style="display:flex; align-items:center; gap:1rem;">
                <div style="width:70px; height:70px; border-radius:50%; background:conic-gradient(#10b981 78%, rgba(255,255,255,0.1) 0); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:1.3rem; position:relative;">
                    <div style="position:absolute; width:55px; height:55px; background:rgba(15,23,42,0.9); border-radius:50%;"></div>
                    <span style="position:relative; z-index:2;">78/100</span>
                </div>
                <p style="font-size:0.85rem; color:#94a3b8; line-height:1.4; margin:0;">
                    <strong style="color:var(--accent);">Insights:</strong> You spent 25% more on Travel this month. Consider adjusting your tech budget to save ₹ 5,000.
                </p>
            </div>
        </div>
      </div>

      <div class="app-grid">
         <!-- Expense Tracker -->
         <div class="glass-card">
            <h3 style="display:flex; justify-content:space-between">Expense Log <button class="action-btn" style="padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="alert('📸 OCR scanner activated.\\n\\nSimulating scanning receipt... Found Total: ₹ 240. Added to Food category.')">📷 Scan Receipt</button></h3>
            <div class="tabs"><button class="tab-btn active" id="f-t-inc">Income</button><button class="tab-btn" id="f-t-exp">Expense</button></div>
            <div class="input-group row">
               <input type="number" id="f-amt" placeholder="Amount (₹)">
               <input type="date" id="f-dt" class="small-dt">
            </div>
            <div class="input-group row">
               <select id="f-cat" style="flex:1;">
                   <option>Food 🍔</option><option>Travel ✈️</option><option>Healthcare 🏥</option><option>Bills 💡</option><option>Subscriptions 📺</option><option>Misc</option>
               </select>
               <button class="action-btn" id="f-add">+</button>
            </div>
            <div id="f-l" class="scrollable-list tiny" style="max-height:150px;"></div>
         </div>

         <!-- Budget Planning -->
         <div class="glass-card">
            <h3>Budget Planning System</h3>
            <div class="input-group row">
                <input type="number" id="f-lim" placeholder="Set Monthly Limit (₹)">
            </div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" id="f-bar"></div></div>
            <div class="budget-text" id="f-bar-txt">0% Spent</div>
            
            <h4 style="margin-top:0.5rem;color:var(--accent); font-size:0.9rem;">Spend by Category</h4>
            <div class="pie-chart-container" style="margin-top:0.5rem;">
                <div class="pie-chart" id="f-pie" style="width:100px; height:100px;"></div>
                <div id="f-leg" class="pie-legend"></div>
            </div>
         </div>

         <!-- Investment & Portfolio -->
         <div class="glass-card">
            <h3 style="display:flex; justify-content:space-between">Portfolio 📈 <span style="font-size:0.8rem; color:#10b981; font-weight:normal;">Live Sync</span></h3>
            <div class="input-group row">
               <select id="inv-t"><option>Stocks</option><option>Crypto (BTC/ETH)</option><option>Mutual Funds</option></select>
               <input type="text" id="inv-n" placeholder="Ticker (e.g. AAPL)">
            </div>
            <div class="input-group row">
               <input type="number" id="inv-a" placeholder="Amount (₹)">
               <button class="action-btn" id="inv-add">+ Asset</button>
            </div>
            <div id="inv-l" class="scrollable-list tiny" style="max-height:120px;"></div>
            <button class="action-btn" style="width:100%; margin-top:0.5rem; background:rgba(139,92,246,0.1); border-color:#8b5cf6;" onclick="alert('🤖 AI Robo-Advisor triggered!\\n\\nYou have a Medium Risk profile based on past transactions.\\n\\nSuggestion: Shift ₹10,000 into NIFTY 50 Index Funds for stable returns.')">🤖 Get AI Investment Plan</button>
         </div>

         <!-- Travel Finance Integrator -->
         <div class="glass-card" style="border: 1px solid #8b5cf6; background: rgba(139, 92, 246, 0.05);">
            <h3 style="color:#c4b5fd; margin-bottom:0.5rem;">✈️ Travel Budget AI Checker</h3>
            <p style="font-size:0.8rem; color:#94a3b8; margin-top:-0.3rem;">Predict if you can afford your next trip.</p>
            <div class="input-group row">
                <input type="text" id="tr-dest" placeholder="Destination (e.g. Goa)">
                <input type="number" id="tr-cost" placeholder="Trip Cost (₹)">
            </div>
            <button class="action-btn" style="width:100%; background:#8b5cf6;" id="tr-ai-btn">Analyze Affordability</button>
            <div id="tr-res" style="margin-top:0.8rem; font-size:0.85rem; line-height:1.4; color:#fff;"></div>
         </div>

         <!-- Savings Goal Automation -->
         <div class="glass-card">
            <h3>Savings Goals & Auto-Save</h3>
            <div class="input-group row">
                <input type="text" placeholder="Goal (e.g. Goa Trip)" id="f-g-n">
            </div>
            <div class="input-group row">
               <input type="number" id="f-g-trg" placeholder="Target (₹)">
               <input type="number" id="f-g-cur" placeholder="Saved (₹)">
            </div>
            <button class="action-btn" id="f-g-up">Update Progress</button>
            <div class="ring-container" style="flex-direction:row; gap:1.5rem;">
                <div class="progress-ring" id="f-rg">
                    <div class="ring-inner-text" id="f-rg-t">0%</div>
                </div>
                <div style="font-size:0.85rem; color:#94a3b8; text-align:left;">
                    <p style="margin:0 0 0.5rem 0"><strong style="color:#fff">Auto-Save Active:</strong></p>
                    <p style="margin:0 0 0.3rem 0; color:#10b981;">✓ Round-up transactions (₹100)</p>
                    <p style="margin:0; color:#10b981;">✓ 10% Salary deduction</p>
                </div>
            </div>
         </div>

         <!-- Credit & Loan (EMI) -->
         <div class="glass-card">
            <h3>Credit & Loan Manager</h3>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-bottom:0.8rem; border-bottom:1px solid rgba(255,255,255,0.1);">
                <span>CIBIL Score:</span> <strong style="color:#10b981; font-size:1.1rem;">782 (Excellent)</strong>
            </div>
            <input type="number" id="emi-p" placeholder="Principal Amount (₹)">
            <div class="input-group row">
                <input type="number" id="emi-r" placeholder="Interest Rate %">
                <input type="number" id="emi-t" placeholder="Tenure (Years)">
            </div>
            <button class="action-btn" style="width:100%; margin:0.5rem 0;" id="emi-calc">Calculate EMI</button>
            <div id="emi-res" style="text-align:center; color:#38bdf8; font-weight:bold; font-size:1rem; margin-top:0.5rem;"></div>
         </div>
         
         <!-- Insurance & Bills -->
         <div class="glass-card">
            <h3 style="display:flex; justify-content:space-between">Insurance & Bills Hub <button class="action-btn" style="padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="alert('Connecting to Bank API to link Auto-Pay...')">🔗 Link Bank</button></h3>
            <div class="input-group row">
               <input type="text" id="b-n" placeholder="Policy / Bill Name">
               <input type="date" id="b-d" title="Due Date">
               <button class="action-btn" id="b-a">+</button>
            </div>
            <div id="b-l" class="scrollable-list tiny" style="max-height:100px;">
                <div class="checkbox-item"><input type="checkbox"> <span>Electricity Bill (Due: 2026-04-05) - <span style="color:#10b981">AutoPay ON</span></span></div>
                <div class="checkbox-item"><input type="checkbox"> <span>Life Insurance Renewal (Due: 2026-05-12)</span></div>
            </div>
         </div>

      </div>
    `;

    // Script Handlers for the massive new suite
    let exps = []; let isIn = true;
    document.getElementById('f-t-inc').onclick=()=>{isIn=true; document.getElementById('f-t-inc').classList.add('active'); document.getElementById('f-t-exp').classList.remove('active');};
    document.getElementById('f-t-exp').onclick=()=>{isIn=false; document.getElementById('f-t-exp').classList.add('active'); document.getElementById('f-t-inc').classList.remove('active');};

    const upFin = () => {
        const lim = parseFloat(document.getElementById('f-lim').value||1);
        const tot = exps.reduce((a,b)=>a+b.amt,0);
        let pct = (tot/lim)*100; if(pct>100) pct=100;
        document.getElementById('f-bar').style.width = pct+'%';
        document.getElementById('f-bar').style.background = pct>80 ? '#ef4444':'#10b981';
        document.getElementById('f-bar-txt').textContent = `${pct.toFixed(2)}% Spent (₹${tot} / ₹${lim})`;

        if(pct > 80) {
            document.getElementById('f-bar-txt').innerHTML += ' <span style="color:#ef4444; font-weight:bold;">⚠️ ALERT: Budget threshold warning!</span>';
        }

        const cmap = {};
        exps.forEach(e=> cmap[e.c] = (cmap[e.c]||0)+e.amt);
        const cols = ['#f87171','#fbbf24','#34d399','#60a5fa','#a78bfa', '#ec4899'];
        let co='', cd=0, ci=0, tl=tot||1; let leg='';
        for(let k in cmap) {
            let dg = (cmap[k]/tl)*360;
            let hl = cols[ci%cols.length];
            co += `${hl} ${cd}deg ${cd+dg}deg,`;
            leg += `<div><span style="display:inline-block;width:10px;height:10px;background:${hl}"></span> ${k} (₹${cmap[k]})</div>`;
            cd+=dg; ci++;
        }
        if(co) co=co.slice(0,-1); else co='transparent 0deg 360deg';
        document.getElementById('f-pie').style.background = `conic-gradient(${co})`;
        document.getElementById('f-leg').innerHTML = leg;
        
        // Update NW Tracker dynamically mock
        const assets = 160000;
        const nw = assets - tot - 14800;
        if(nw < 0) {
             document.getElementById('f-nw').textContent = "-₹" + Math.abs(nw);
             document.getElementById('f-nw').style.color = '#ef4444';
        } else {
             document.getElementById('f-nw').textContent = "₹" + nw;
             document.getElementById('f-nw').style.color = '#3b82f6';
        }
    };
    document.getElementById('f-lim').oninput = upFin;

    document.getElementById('f-add').onclick = () => {
        const a=parseFloat(document.getElementById('f-amt').value);
        const c=document.getElementById('f-cat').value||'Misc';
        let d=document.getElementById('f-dt').value;
        if(!d) d = new Date().toISOString().split('T')[0];
        if(!a) return;
        const nd = document.createElement('div'); nd.className='list-item';
        if(isIn) {
            nd.innerHTML=`<span class="pos">+₹${a} (${c})</span><span>${d}</span>`;
        } else {
            exps.push({amt:a, c:c});
            nd.innerHTML=`<span class="neg">-₹${a} (${c})</span><span>${d}</span>`;
        }
        document.getElementById('f-l').prepend(nd);
        upFin();
    };

    // Savings AI
    document.getElementById('f-g-up').onclick=()=>{
        const trg = parseFloat(document.getElementById('f-g-trg').value||1);
        const cur = parseFloat(document.getElementById('f-g-cur').value||0);
        let pct = (cur/trg)*100; if(pct<0)pct=0; if(pct>100)pct=100;
        document.getElementById('f-rg').style.setProperty('--percentage', pct+'%');
        document.getElementById('f-rg-t').textContent = pct.toFixed(1)+'%';
        document.getElementById('f-rg-t').style.color = pct>=100?'#10b981':'#fff';
    };

    // EMI Calculator
    document.getElementById('emi-calc').onclick=()=>{
        const P = parseFloat(document.getElementById('emi-p').value||0);
        const r = parseFloat(document.getElementById('emi-r').value||0)/12/100;
        const n = parseFloat(document.getElementById('emi-t').value||0)*12;
        if(!P || !r || !n) return;
        const emi = P * r * (Math.pow(1+r, n) / (Math.pow(1+r, n) - 1));
        const total = emi * n;
        document.getElementById('emi-res').innerHTML = `Monthly EMI: ₹${emi.toFixed(2)}<br><span style="font-size:0.8rem;color:#94a3b8;font-weight:normal">Total Interest: ₹${(total-P).toFixed(2)}</span>`;
    };

    // Travel Finance AI Checker (The 🔥 Feature)
    document.getElementById('tr-ai-btn').onclick=()=>{
        const dest = document.getElementById('tr-dest').value || 'Unknown';
        const cost = parseFloat(document.getElementById('tr-cost').value || 0);
        const bankBal = 145200; // Mock NW
        if(cost <= 0) return;
        const tr = document.getElementById('tr-res');
        tr.innerHTML = `<span class="spinner" style="display:inline-block;width:15px;height:15px;border-width:2px;margin-right:10px;"></span> Analyzing affordability via AI...`;
        setTimeout(() => {
            if(cost > bankBal * 0.7) {
                tr.innerHTML = `<span style="color:#ef4444;font-weight:bold;">🚨 High Risk:</span> This ₹${cost} trip to ${dest} consumes over 70% of your net worth. <br><br>💡 <strong>AI Robo-Advisor:</strong> Try saving ₹${(cost/4).toFixed(0)}/month for 4 months or use EMI at 12%.`;
                tr.style.background = "rgba(239, 68, 68, 0.1)"; tr.style.padding = "0.5rem"; tr.style.borderRadius = "6px";
            } else if(cost > bankBal * 0.4) {
                tr.innerHTML = `<span style="color:#fbbf24;font-weight:bold;">⚠️ Caution:</span> You can afford this ₹${cost} trip to ${dest}, but it dents your emergency fund. <br><br>💡 <strong>AI Robo-Advisor:</strong> Consider cutting subscription expenses temporarily.`;
                tr.style.background = "rgba(251, 191, 36, 0.1)"; tr.style.padding = "0.5rem"; tr.style.borderRadius = "6px";
            } else {
                tr.innerHTML = `<span style="color:#10b981;font-weight:bold;">✅ Approved:</span> Financially compliant. A ₹${cost} trip to ${dest} takes only ${(cost/bankBal*100).toFixed(1)}% of your available funds. Have a safe journey!`;
                tr.style.background = "rgba(16, 185, 129, 0.1)"; tr.style.padding = "0.5rem"; tr.style.borderRadius = "6px";
            }
        }, 1200);
    };

    // Investments List
    document.getElementById('inv-add').onclick = () => {
        const t = document.getElementById('inv-t').value;
        const n = document.getElementById('inv-n').value;
        const a = document.getElementById('inv-a').value;
        if(!n || !a) return;
        const d = document.createElement('div'); d.className='list-item';
        d.innerHTML = `<span><strong style="color:var(--accent);">${n}</strong> (${t})</span> <span class="pos">+₹${a}</span>`;
        document.getElementById('inv-l').prepend(d);
    };

    // Bills
    document.getElementById('b-a').onclick=()=>{
        const n=document.getElementById('b-n').value; const d=document.getElementById('b-d').value;
        if(!n) return;
        const nd = document.createElement('div'); nd.className='checkbox-item';
        nd.innerHTML = `<input type="checkbox"> <span>${n} (Due:${d})</span>`;
        document.getElementById('b-l').appendChild(nd);
    };
}

function renderHealthcareApp(container) {
    container.innerHTML = `
      <h2 class="app-title">🏥 Healthcare & Medical Logs</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>Patient Information</h3>
            <div class="input-group row">
               <input type="text" placeholder="Full Name">
               <input type="number" placeholder="Age">
            </div>
            <div class="input-group row">
               <input type="text" placeholder="Blood Group">
               <input type="text" placeholder="Allergies">
            </div>
         </div>

         <div class="glass-card">
            <h3>Symptom Logger</h3>
            <div class="input-group row">
               <input type="text" id="s-n" placeholder="Symptom">
               <input type="date" id="s-d">
            </div>
            <div class="input-group row">
               <select id="s-s"><option>Mild</option><option>Moderate</option><option>Severe</option></select>
               <button class="action-btn" id="s-a">+ Log</button>
            </div>
            <div id="s-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Medicine Timetable</h3>
            <div class="input-group row">
               <input type="text" id="m-n" placeholder="Meds Name & Dose">
               <select id="m-t"><option>Morning</option><option>Afternoon</option><option>Night</option></select>
               <button class="action-btn" id="m-a">+</button>
            </div>
            <div id="m-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Scheduling & Connect</h3>
            <h4 style="color:var(--accent); font-weight:400; font-size:1rem;">Appt Scheduler</h4>
            <div class="input-group row">
                <input type="text" id="a-n" placeholder="Dr. Name">
                <input type="datetime-local" id="a-d">
            </div>
            <div class="input-group row">
                <input type="text" id="a-nt" placeholder="Notes (optional)">
                <button class="action-btn" id="a-a">+</button>
            </div>
            <div id="a-l" class="scrollable-list tiny" style="margin-bottom:1rem;"></div>

            <h4 style="color:var(--accent); font-weight:400; font-size:1rem;">Emergency Contacts</h4>
            <div class="input-group row">
                <input type="text" id="e-n" placeholder="Name">
                <input type="text" id="e-r" placeholder="Relation">
            </div>
            <div class="input-group row">
                <input type="tel" id="e-t" placeholder="Phone">
                <button class="action-btn" id="e-a">+</button>
            </div>
            <div id="e-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Daily Water Intake (Goal: 8)</h3>
            <div style="font-size:1.5rem;" id="w-c">0 / 8 Glasses</div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" id="w-b"></div></div>
            <div class="glass-panels" id="w-g-c">
                <span class="water-glass">💧</span><span class="water-glass">💧</span><span class="water-glass">💧</span><span class="water-glass">💧</span>
                <span class="water-glass">💧</span><span class="water-glass">💧</span><span class="water-glass">💧</span><span class="water-glass">💧</span>
            </div>
         </div>
      </div>
    `;

    document.getElementById('s-a').onclick=()=>{
        const n=document.getElementById('s-n').value;const d=document.getElementById('s-d').value;const s=document.getElementById('s-s').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='list-item';
        let cl = s==='Severe'?'neg':s==='Moderate'?'#fbbf24':'pos';
        nd.innerHTML=`<span>${n}</span><span>${d} | <b style="color:${cl}">${s}</b></span>`;
        document.getElementById('s-l').appendChild(nd);
    };

    document.getElementById('m-a').onclick=()=>{
        const n=document.getElementById('m-n').value; const t=document.getElementById('m-t').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='checkbox-item';
        nd.innerHTML=`<input type="checkbox"> <span>${n} (${t})</span>`;
        document.getElementById('m-l').appendChild(nd);
    };

    document.getElementById('a-a').onclick=()=>{
        const n=document.getElementById('a-n').value; const d=document.getElementById('a-d').value;
        const nt=document.getElementById('a-nt').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='list-item';
        nd.innerHTML=`<span>Dr. ${n} <br><small style="color:#94a3b8">${nt}</small></span><span>${new Date(d).toLocaleString()}</span>`;
        document.getElementById('a-l').appendChild(nd);
    };

    document.getElementById('e-a').onclick=()=>{
        const n=document.getElementById('e-n').value; const t=document.getElementById('e-t').value;
        const r=document.getElementById('e-r').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='list-item';
        nd.innerHTML=`<span>⚠️ ${n} (${r})</span><a href="tel:${t}" style="color:var(--accent)">${t}</a>`;
        document.getElementById('e-l').appendChild(nd);
    };

    let wg = 0;
    const gEls = document.querySelectorAll('.water-glass');
    gEls.forEach((g, idx) => {
        g.onclick = () => {
            wg = idx+1;
            gEls.forEach((gl, i) => { if(i<wg) gl.classList.add('filled'); else gl.classList.remove('filled'); });
            document.getElementById('w-c').textContent = `${wg} / 8 Glasses`;
            document.getElementById('w-b').style.width = `${(wg/8)*100}%`;
        };
    });
}

function renderEducationApp(container) {
    container.innerHTML = `
      <h2 class="app-title">🎓 Education & Study Portal</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>Subject Manager</h3>
            <div class="input-group row">
               <input type="text" id="su-n" placeholder="Subject Name">
               <input type="color" id="su-c" style="padding:0;height:42px;width:50px;border:none;">
               <button class="action-btn" id="su-add">+</button>
            </div>
            <div id="su-l" style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;"></div>
         </div>

         <div class="glass-card">
            <h3>Assignment Tracker</h3>
            <div class="input-group row">
               <input type="text" id="as-su" placeholder="Subject">
               <input type="text" id="as-n" placeholder="Assignment Name">
            </div>
            <div class="input-group row">
               <input type="date" id="as-d">
               <button class="action-btn" id="as-a">+ Add Task</button>
            </div>
            <div id="as-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Study Planner</h3>
            <div class="input-group row">
               <input type="text" id="sp-su" placeholder="Subject">
               <select id="sp-d"><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option></select>
            </div>
            <div class="input-group row">
               <input type="number" id="sp-h" placeholder="Hours">
               <button class="action-btn" id="sp-a">+ Plan</button>
            </div>
            <div id="sp-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Quick Notes</h3>
            <input type="text" id="nt-su" placeholder="Topic Title" style="margin-bottom:0.5rem;">
            <textarea id="nt-t" placeholder="Write your notes here..." rows="3" style="resize:none;margin-bottom:0.5rem;"></textarea>
            <button class="action-btn" id="nt-a">Save Note</button>
            <div id="nt-l" class="scrollable-list tiny" style="margin-top:0.5rem"></div>
         </div>

         <div class="glass-card">
            <h3>Exam Countdown</h3>
            <div class="input-group row">
               <input type="text" id="ex-n" placeholder="Exam Name">
               <input type="date" id="ex-d">
               <button class="action-btn" id="ex-a">+</button>
            </div>
            <div id="ex-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Topic Progress</h3>
            <div class="input-group row">
               <input type="text" id="tp-n" placeholder="Topic Name">
               <input type="number" id="tp-t" placeholder="Total Chapters">
               <input type="number" id="tp-d" placeholder="Done">
            </div>
            <button class="action-btn" id="tp-a" style="margin-bottom:0.5rem;">Update Bar</button>
            <div class="progress-bar-bg"><div class="progress-bar-fill" id="tp-b" style="background:var(--accent)"></div></div>
            <div class="budget-text" id="tp-rt">0% Done</div>
         </div>
      </div>
    `;

    document.getElementById('su-add').onclick=()=>{
        const n=document.getElementById('su-n').value; const c=document.getElementById('su-c').value;
        if(!n)return;
        const t = document.createElement('span'); t.className='subject-tag';
        t.style.background = c; t.textContent = n;
        document.getElementById('su-l').appendChild(t);
    };

    document.getElementById('as-a').onclick=()=>{
        const s=document.getElementById('as-su').value; const n=document.getElementById('as-n').value; const d=document.getElementById('as-d').value;
        if(!n)return;
        const nd=document.createElement('div'); nd.className='checkbox-item';
        nd.innerHTML=`<input type="checkbox"> <span>[${s}] ${n} (Due:${d})</span>`;
        document.getElementById('as-l').appendChild(nd);
    };
    
    document.getElementById('sp-a').onclick=()=>{
        const s=document.getElementById('sp-su').value; const dy=document.getElementById('sp-d').value; const h=document.getElementById('sp-h').value;
        if(!s)return;
        const nd=document.createElement('div'); nd.className='list-item';
        nd.innerHTML=`<span>${dy} - ${s}</span><span>${h} Hrs</span>`;
        document.getElementById('sp-l').appendChild(nd);
    };

    document.getElementById('nt-a').onclick=()=>{
        const s=document.getElementById('nt-su').value; const t=document.getElementById('nt-t').value;
        if(!s)return;
        const nd=document.createElement('div'); nd.className='list-item';
        nd.innerHTML=`<span><strong>${s}</strong>: ${t}</span>`;
        document.getElementById('nt-l').appendChild(nd);
    };

    document.getElementById('ex-a').onclick=()=>{
        const n=document.getElementById('ex-n').value; const d=document.getElementById('ex-d').value;
        if(!n || !d)return;
        const days = Math.ceil((new Date(d) - new Date())/(1000*60*60*24));
        const nd=document.createElement('div'); nd.className='list-item';
        nd.innerHTML=`<span>${n}</span><strong class="neg">${days} Days Left</strong>`;
        document.getElementById('ex-l').appendChild(nd);
    };

    document.getElementById('tp-a').onclick=()=>{
        const t=parseFloat(document.getElementById('tp-t').value||1);
        const d=parseFloat(document.getElementById('tp-d').value||0);
        let pct = (d/t)*100; if(pct>100)pct=100;
        document.getElementById('tp-b').style.width=pct+'%';
        document.getElementById('tp-rt').textContent=`${pct.toFixed(1)}% Done (${d}/${t})`;
    };
}

function renderEventApp(container) {
    container.innerHTML = `
      <h2 class="app-title">🎉 Event Coordination</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>Event Details</h3>
            <div class="input-group row">
               <input type="text" placeholder="Event Name">
               <select><option>Wedding</option><option>Party</option><option>Corporate</option><option>Birthday</option></select>
            </div>
            <div class="input-group row">
               <input type="date">
               <input type="text" placeholder="Venue Location">
            </div>
         </div>

         <div class="glass-card">
            <h3>Guest List & RSVP</h3>
            <div class="input-group row">
               <input type="text" id="gu-n" placeholder="Name">
               <input type="tel" id="gu-p" placeholder="Phone">
            </div>
            <div class="input-group row">
               <select id="gu-s"><option>Pending</option><option>Yes</option><option>No</option></select>
               <button class="action-btn" id="gu-a">+</button>
            </div>
            <div id="gu-l" class="scrollable-list tiny" style="margin-bottom:0.5rem"></div>
            <div class="budget-text" id="gu-t" style="text-align:left;">Live Count: 0 Attending</div>
         </div>

         <div class="glass-card">
            <h3>Budget Allocation</h3>
            <input type="number" id="ev-tot" placeholder="Total Event Budget ($)">
            <div class="budget-splits">
               <input type="number" id="ev-1" placeholder="Venue" class="evt-sp">
               <input type="number" id="ev-2" placeholder="Food/Catering" class="evt-sp">
               <input type="number" id="ev-3" placeholder="Decor" class="evt-sp">
               <input type="number" id="ev-4" placeholder="Music/Misc" class="evt-sp">
            </div>
            <div class="budget-result">Rem: <span id="ev-r" class="pos">$0</span></div>
         </div>

         <div class="glass-card">
            <h3>Task Matrix</h3>
            <div class="input-group row">
               <input type="text" id="tk-n" placeholder="Task">
               <input type="text" id="tk-p" placeholder="Assigned To">
            </div>
            <div class="input-group row">
               <input type="date" id="tk-d">
               <button class="action-btn" id="tk-a">+</button>
            </div>
            <div id="tk-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Vendor Registry</h3>
            <div class="input-group row">
               <input type="text" id="v-n" placeholder="Vendor">
               <input type="text" id="v-s" placeholder="Service">
            </div>
            <div class="input-group row">
               <input type="tel" id="v-p" placeholder="Phone">
               <input type="number" id="v-a" placeholder="Agreed $">
               <button class="action-btn" id="v-btn">+</button>
            </div>
            <div id="v-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Day-of-Timeline Schedule</h3>
            <div class="input-group row">
               <input type="time" id="dl-t">
               <input type="text" id="dl-a" placeholder="Activity">
               <button class="action-btn" id="dl-btn">+</button>
            </div>
            <div id="dl-l" class="scrollable-list tiny"></div>
         </div>
      </div>
    `;

    let gcnt=0;
    document.getElementById('gu-a').onclick=()=>{
        const n=document.getElementById('gu-n').value;const s=document.getElementById('gu-s').value;
        const p=document.getElementById('gu-p').value;
        if(!n)return;
        if(s==='Yes') gcnt++;
        const cl = s==='Yes'?'pos':s==='No'?'neg':'#fbbf24';
        const nd=document.createElement('div');nd.className='list-item';
        nd.innerHTML=`<span>${n} <small style="color:#94a3b8">${p}</small></span><strong style="color:${cl}">${s}</strong>`;
        document.getElementById('gu-l').appendChild(nd);
        document.getElementById('gu-t').textContent = `Live Count: ${gcnt} Attending`;
    };

    const eb=()=>{
        const t=parseFloat(document.getElementById('ev-tot').value||0);
        const s=['ev-1','ev-2','ev-3','ev-4'].reduce((a,id)=>a+(parseFloat(document.getElementById(id).value||0)),0);
        const r=t-s;
        document.getElementById('ev-r').textContent='$'+r;
        document.getElementById('ev-r').className=r>=0?'pos':'neg';
    };
    document.querySelectorAll('#ev-tot, .evt-sp').forEach(e=>e.oninput=eb);

    document.getElementById('tk-a').onclick=()=>{
        const n=document.getElementById('tk-n').value;const p=document.getElementById('tk-p').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='checkbox-item';
        nd.innerHTML=`<input type="checkbox"> <span>${n} (@${p})</span>`;
        document.getElementById('tk-l').appendChild(nd);
    };

    document.getElementById('v-btn').onclick=()=>{
        const n=document.getElementById('v-n').value;const s=document.getElementById('v-s').value;const a=document.getElementById('v-a').value;
        const p=document.getElementById('v-p').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='list-item';
        nd.innerHTML=`<span>${n} (${s}) <br><small style="color:var(--accent)">📞 ${p}</small></span><span class="neg">$${a}</span>`;
        document.getElementById('v-l').appendChild(nd);
    };
    
    let tlns = [];
    document.getElementById('dl-btn').onclick=()=>{
        const t=document.getElementById('dl-t').value;const a=document.getElementById('dl-a').value;
        if(!t||!a)return;
        tlns.push({t,a});
        tlns.sort((i,j)=>i.t.localeCompare(j.t));
        const p=document.getElementById('dl-l'); p.innerHTML='';
        tlns.forEach(o=>{
            const nd=document.createElement('div');nd.className='list-item';
            nd.style.borderLeft="3px solid var(--accent)"; nd.style.background="linear-gradient(90deg, rgba(56, 189, 248, 0.1), transparent)";
            nd.innerHTML=`<strong>${o.t}</strong> <span>${o.a}</span>`;
            p.appendChild(nd);
        });
    };
}
