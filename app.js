// ڈیٹا سٹور
let appData = {
    projects: [],
    daily: [],
    team: [],
    materials: []
};

// صفحہ لوڈ ہونے پر
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    renderAll();
    setupEventListeners();
});

// سٹوریج سے ڈیٹا لوڈ کریں
function loadDataFromStorage() {
    const savedData = localStorage.getItem('peacock-blue-app-data');
    if (savedData) {
        appData = JSON.parse(savedData);
    }
}

// سٹوریج میں ڈیٹا محفوظ کریں
function saveDataToStorage() {
    localStorage.setItem('peacock-blue-app-data', JSON.stringify(appData));
}

// تمام رینڈر کریں
function renderAll() {
    renderProjects();
    renderDaily();
    renderTeam();
    renderMaterials();
    updateDashboard();
    updateProjectDropdown();
}

// ڈیش بورڈ اپڈیٹ کریں
function updateDashboard() {
    let totalValue = 0;
    let amountReceived = 0;
    let totalExpenses = 0;

    // پروجیکٹس سے ڈیٹا
    appData.projects.forEach(project => {
        totalValue += parseFloat(project.totalValue) || 0;
        amountReceived += parseFloat(project.amountReceived) || 0;
    });

    // روزانہ کی تفصیل سے اخراجات
    appData.daily.forEach(entry => {
        totalExpenses += parseFloat(entry.expenses) || 0;
    });

    const pendingAmount = totalValue - amountReceived;
    const totalProfit = amountReceived - totalExpenses;

    document.getElementById('totalValue').textContent = totalValue.toLocaleString() + ' روپے';
    document.getElementById('amountReceived').textContent = amountReceived.toLocaleString() + ' روپے';
    document.getElementById('pendingAmount').textContent = pendingAmount.toLocaleString() + ' روپے';
    document.getElementById('totalExpenses').textContent = totalExpenses.toLocaleString() + ' روپے';
    document.getElementById('totalProfit').textContent = totalProfit.toLocaleString() + ' روپے';
    document.getElementById('teamCount').textContent = appData.team.length;
}

// پروجیکٹس رینڈر کریں
function renderProjects() {
    const projectsList = document.getElementById('projectsList');
    
    if (appData.projects.length === 0) {
        projectsList.innerHTML = '<div class="empty-state"><p>❌ کوئی پروجیکٹ نہیں ہے</p></div>';
        return;
    }

    projectsList.innerHTML = appData.projects.map((project, index) => {
        const pending = project.totalValue - project.amountReceived;
        return `
            <div class="card">
                <h3>📁 ${project.name}</h3>
                <p><strong>کلائنٹ:</strong> ${project.client}</p>
                <div class="card-info">
                    <div class="info-item">
                        <div class="info-label">کل رقم</div>
                        <div class="info-value">${project.totalValue.toLocaleString()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">وصول شدہ</div>
                        <div class="info-value">${project.amountReceived.toLocaleString()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">زیر التوا</div>
                        <div class="info-value">${pending.toLocaleString()}</div>
                    </div>
                </div>
                <p><strong>تفصیل:</strong> ${project.description || 'کوئی تفصیل نہیں'}</p>
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteProject(${index})">🗑️ حذف کریں</button>
                    <button class="btn-print" onclick="printProject(${index})">🖨️ پرنٹ کریں</button>
                </div>
            </div>
        `;
    }).join('');
}

// روزانہ کی تفصیل رینڈر کریں
function renderDaily() {
    const dailyList = document.getElementById('dailyList');
    
    if (appData.daily.length === 0) {
        dailyList.innerHTML = '<div class="empty-state"><p>❌ کوئی روزانہ کی تفصیل نہیں ہے</p></div>';
        return;
    }

    dailyList.innerHTML = appData.daily.map((entry, index) => {
        return `
            <div class="card">
                <h3>📅 ${entry.date}</h3>
                <div class="card-info">
                    <div class="info-item">
                        <div class="info-label">پروجیکٹ</div>
                        <div class="info-value">${entry.project}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">اخراجات</div>
                        <div class="info-value">${entry.expenses.toLocaleString()} روپے</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">وصول شدہ رقم</div>
                        <div class="info-value">${entry.amountReceived.toLocaleString()} روپے</div>
                    </div>
                </div>
                <p><strong>نوٹس:</strong> ${entry.notes || 'کوئی نوٹ نہیں'}</p>
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteDaily(${index})">🗑️ حذف کریں</button>
                    <button class="btn-print" onclick="printDaily(${index})">🖨️ پرنٹ کریں</button>
                </div>
            </div>
        `;
    }).join('');
}

// ٹیم رینڈر کریں
function renderTeam() {
    const teamList = document.getElementById('teamList');
    
    if (appData.team.length === 0) {
        teamList.innerHTML = '<div class="empty-state"><p>❌ کوئی ٹیم ممبر نہیں ہے</p></div>';
        return;
    }

    teamList.innerHTML = appData.team.map((member, index) => {
        return `
            <div class="card">
                <h3>👤 ${member.name}</h3>
                <div class="card-info">
                    <div class="info-item">
                        <div class="info-label">عہدہ</div>
                        <div class="info-value">${member.position}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">فون</div>
                        <div class="info-value">${member.phone || 'موجود نہیں'}</div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteTeam(${index})">🗑️ حذف کریں</button>
                </div>
            </div>
        `;
    }).join('');
}

// سامان رینڈر کریں
function renderMaterials() {
    const materialsList = document.getElementById('materialsList');
    
    if (appData.materials.length === 0) {
        materialsList.innerHTML = '<div class="empty-state"><p>❌ کوئی سامان نہیں ہے</p></div>';
        return;
    }

    materialsList.innerHTML = appData.materials.map((material, index) => {
        const totalCost = material.quantity * material.price;
        return `
            <div class="card">
                <h3>🛠️ ${material.name}</h3>
                <div class="card-info">
                    <div class="info-item">
                        <div class="info-label">مقدار</div>
                        <div class="info-value">${material.quantity} ${material.unit}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">قیمت فی یونٹ</div>
                        <div class="info-value">${material.price.toLocaleString()} روپے</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">کل قیمت</div>
                        <div class="info-value">${totalCost.toLocaleString()} روپے</div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteMaterial(${index})">🗑️ حذف کریں</button>
                </div>
            </div>
        `;
    }).join('');
}

// پروجیکٹ ڈراپ ڈاؤن اپڈیٹ کریں
function updateProjectDropdown() {
    const select = document.getElementById('dailyProject');
    select.innerHTML = '<option value="">پروجیکٹ منتخب کریں</option>';
    appData.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        select.appendChild(option);
    });
}

// ٹیبز دکھائیں
function showTab(tabName) {
    // تمام ٹیبز کو چھپائیں
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // تمام بٹنز کو غیر فعال کریں
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // منتخب ٹیب اور بٹن کو فعال کریں
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// پروجیکٹ موڈل
function openProjectModal() {
    document.getElementById('projectModal').classList.add('show');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('show');
    document.getElementById('projectModal').style.display = 'none';
}

function saveProject(e) {
    e.preventDefault();
    
    const project = {
        name: document.getElementById('projectName').value,
        client: document.getElementById('projectClient').value,
        totalValue: parseFloat(document.getElementById('projectTotalValue').value),
        amountReceived: parseFloat(document.getElementById('projectAmountReceived').value),
        description: document.getElementById('projectDescription').value
    };
    
    appData.projects.push(project);
    saveDataToStorage();
    renderAll();
    closeProjectModal();
    
    // فارم صاف کریں
    document.querySelector('#projectModal form').reset();
    
    // پیغام دکھائیں
    showNotification('✅ پروجیکٹ محفوظ ہو گیا!');
}

function deleteProject(index) {
    if (confirm('کیا آپ یقینی ہیں کہ یہ پروجیکٹ حذف کرنا چاہتے ہیں؟')) {
        appData.projects.splice(index, 1);
        saveDataToStorage();
        renderAll();
        showNotification('✅ پروجیکٹ حذف ہو گیا!');
    }
}

// روزانہ کی تفصیل موڈل
function openDailyModal() {
    document.getElementById('dailyModal').classList.add('show');
}

function closeDailyModal() {
    document.getElementById('dailyModal').classList.remove('show');
    document.getElementById('dailyModal').style.display = 'none';
}

function saveDailyEntry(e) {
    e.preventDefault();
    
    const entry = {
        date: document.getElementById('dailyDate').value,
        project: document.getElementById('dailyProject').value,
        expenses: parseFloat(document.getElementById('dailyExpenses').value) || 0,
        amountReceived: parseFloat(document.getElementById('dailyAmountReceived').value) || 0,
        notes: document.getElementById('dailyNotes').value
    };
    
    appData.daily.push(entry);
    saveDataToStorage();
    renderAll();
    closeDailyModal();
    
    // فارم صاف کریں
    document.querySelector('#dailyModal form').reset();
    
    showNotification('✅ روزانہ کی تفصیل محفوظ ہو گی!');
}

function deleteDaily(index) {
    if (confirm('کیا آپ یقینی ہیں؟')) {
        appData.daily.splice(index, 1);
        saveDataToStorage();
        renderAll();
        showNotification('✅ تفصیل حذف ہو گی!');
    }
}

// ٹیم موڈل
function openTeamModal() {
    document.getElementById('teamModal').classList.add('show');
}

function closeTeamModal() {
    document.getElementById('teamModal').classList.remove('show');
    document.getElementById('teamModal').style.display = 'none';
}

function saveTeamMember(e) {
    e.preventDefault();
    
    const member = {
        name: document.getElementById('teamName').value,
        position: document.getElementById('teamPosition').value,
        phone: document.getElementById('teamPhone').value
    };
    
    appData.team.push(member);
    saveDataToStorage();
    renderAll();
    closeTeamModal();
    
    // فارم صاف کریں
    document.querySelector('#teamModal form').reset();
    
    showNotification('✅ ممبر شامل ہو گیا!');
}

function deleteTeam(index) {
    if (confirm('کیا آپ یقینی ہیں؟')) {
        appData.team.splice(index, 1);
        saveDataToStorage();
        renderAll();
        showNotification('✅ ممبر حذف ہو گیا!');
    }
}

// سامان موڈل
function openMaterialModal() {
    document.getElementById('materialModal').classList.add('show');
}

function closeMaterialModal() {
    document.getElementById('materialModal').classList.remove('show');
    document.getElementById('materialModal').style.display = 'none';
}

function saveMaterial(e) {
    e.preventDefault();
    
    const material = {
        name: document.getElementById('materialName').value,
        quantity: parseFloat(document.getElementById('materialQuantity').value),
        unit: document.getElementById('materialUnit').value,
        price: parseFloat(document.getElementById('materialPrice').value)
    };
    
    appData.materials.push(material);
    saveDataToStorage();
    renderAll();
    closeMaterialModal();
    
    // فارم صاف کریں
    document.querySelector('#materialModal form').reset();
    
    showNotification('✅ سامان شامل ہو گیا!');
}

function deleteMaterial(index) {
    if (confirm('کیا آپ یقینی ہیں؟')) {
        appData.materials.splice(index, 1);
        saveDataToStorage();
        renderAll();
        showNotification('✅ سامان حذف ہو گیا!');
    }
}

// سرچ فنکشنلٹی
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        
        // پروجیکٹس فلٹر کریں
        const projectsList = document.getElementById('projectsList');
        const projectCards = projectsList.querySelectorAll('.card');
        
        projectCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// پرنٹ فنکشن
function printDashboard() {
    window.print();
}

function printProject(index) {
    const project = appData.projects[index];
    const printWindow = window.open('', '', 'height=600,width=800');
    
    const pending = project.totalValue - project.amountReceived;
    
    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>پروجیکٹ کی تفصیل</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #1e3a8a; text-align: center; }
                .info { margin: 20px 0; }
                .info p { margin: 10px 0; font-size: 16px; }
                .label { font-weight: bold; color: #1e3a8a; }
            </style>
        </head>
        <body>
            <h1>📁 ${project.name}</h1>
            <div class="info">
                <p><span class="label">کلائنٹ:</span> ${project.client}</p>
                <p><span class="label">کل رقم:</span> ${project.totalValue.toLocaleString()} روپے</p>
                <p><span class="label">وصول شدہ:</span> ${project.amountReceived.toLocaleString()} روپے</p>
                <p><span class="label">زیر التوا:</span> ${pending.toLocaleString()} روپے</p>
                <p><span class="label">تفصیل:</span> ${project.description || 'کوئی تفصیل نہیں'}</p>
            </div>
            <script>
                window.print();
                window.close();
            </script>
        </body>
        </html>
    `);
}

function printDaily(index) {
    const entry = appData.daily[index];
    const printWindow = window.open('', '', 'height=600,width=800');
    
    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>روزانہ کی تفصیل</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #1e3a8a; text-align: center; }
                .info { margin: 20px 0; }
                .info p { margin: 10px 0; font-size: 16px; }
                .label { font-weight: bold; color: #1e3a8a; }
            </style>
        </head>
        <body>
            <h1>📅 روزانہ کی تفصیل - ${entry.date}</h1>
            <div class="info">
                <p><span class="label">پروجیکٹ:</span> ${entry.project}</p>
                <p><span class="label">اخراجات:</span> ${entry.expenses.toLocaleString()} روپے</p>
                <p><span class="label">وصول شدہ:</span> ${entry.amountReceived.toLocaleString()} روپے</p>
                <p><span class="label">نوٹس:</span> ${entry.notes || 'کوئی نوٹ نہیں'}</p>
            </div>
            <script>
                window.print();
                window.close();
            </script>
        </body>
        </html>
    `);
}

// نوٹیفکیشن دکھائیں
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// موڈل بند کرنے کے لیے باہر کلک
window.onclick = function(event) {
    const projectModal = document.getElementById('projectModal');
    const dailyModal = document.getElementById('dailyModal');
    const teamModal = document.getElementById('teamModal');
    const materialModal = document.getElementById('materialModal');
    
    if (event.target === projectModal) {
        closeProjectModal();
    }
    if (event.target === dailyModal) {
        closeDailyModal();
    }
    if (event.target === teamModal) {
        closeTeamModal();
    }
    if (event.target === materialModal) {
        closeMaterialModal();
    }
}