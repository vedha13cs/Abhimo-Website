const sections = document.querySelectorAll(".form-section");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const steps = document.querySelectorAll(".step");

let currentSection = 0;

/* TELEGRAM CONFIG */
const TELEGRAM_CONFIG = {
    TOKEN: "8979519791:AAHtCKOyTK__PvRccodLV7OmfWH-JC6ANS8",
    IDS: ["1925799237", "883605194"]
};

/* TOAST NOTIFICATION */
function showToast(message, type = "error") {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="bi ${type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);

    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 24px',
        borderRadius: '12px',
        color: 'white',
        zIndex: '1000001',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
        transition: 'all 0.5s ease',
        transform: 'translateX(100%)',
        opacity: '0'
    });

    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

/* FILE HANDLING & PREVIEWS */
function formatSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleFilePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);

    input.addEventListener('change', function () {
        preview.innerHTML = '';
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const isImage = file.type.startsWith('image/');
            const icon = isImage ? 'bi-image' : 'bi-file-earmark-pdf';

            const card = document.createElement('div');
            card.className = 'preview-card';
            card.innerHTML = `
                <div class="preview-icon"><i class="bi ${icon}"></i></div>
                <div class="preview-info">
                    <span class="preview-name">${file.name}</span>
                    <span class="preview-size">Size: ${formatSize(file.size)}</span>
                </div>
                <div class="preview-status"><i class="bi bi-patch-check-fill"></i> Ready</div>
            `;
            preview.appendChild(card);
        }
    });
}

handleFilePreview('resume', 'resume-preview');
handleFilePreview('photo', 'photo-preview');
handleFilePreview('markscard', 'markscard-preview');

/* SHOW SECTION */
function showSection(index) {
    sections.forEach((section) => section.classList.remove("active"));
    steps.forEach((step) => step.classList.remove("active"));

    sections[index].classList.add("active");
    steps[index].classList.add("active");

    steps.forEach((step, i) => {
        if (i < index) step.classList.add("completed");
        else step.classList.remove("completed");
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* VALIDATE SECTION */
function validateSection(section) {
    const requiredFields = section.querySelectorAll("[required]");
    for (let field of requiredFields) {
        if (field.type === "radio") {
            const radioGroup = section.querySelectorAll(`input[name="${field.name}"]`);
            if (![...radioGroup].some(r => r.checked)) {
                showToast("Please select one option");
                return false;
            }
        }
        else if (field.type === "checkbox") {
            if (!field.checked) {
                showToast("Please agree to the terms");
                return false;
            }
        }
        else {
            if (field.value.trim() === "") {
                showToast("Please fill all required fields");
                field.focus();
                return false;
            }
        }
    }
    return true;
}

/* GENERATE REVIEW - COMPREHENSIVE */
function generateReview() {
    const reviewData = document.getElementById("review-data");
    const getVal = (selector) => {
        const el = document.querySelector(selector);
        return el ? (el.value || "N/A") : "N/A";
    };

    const getRadioVal = (name) => {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.parentElement.innerText.trim() : "N/A";
    };

    const selects = document.querySelectorAll("select");
    const textareas = document.querySelectorAll("textarea");

    reviewData.innerHTML = `
        <!-- JOB DETAILS -->
        <div class="review-section-card">
            <div class="review-section-header">
                <h3>1. Job Details</h3>
                <button type="button" class="edit-section-btn" onclick="currentSection=0; showSection(0)">Edit</button>
            </div>
            <div class="review-grid">
                <div class="review-item"><label>Application Type</label><span>${selects[0].value}</span></div>
                <div class="review-item"><label>Qualification</label><span>${selects[1].value}</span></div>
                <div class="review-item"><label>Qual Status</label><span>${getRadioVal('status')}</span></div>
                <div class="review-item"><label>Duration</label><span>${selects[2].value}</span></div>
            </div>
        </div>

        <!-- PERSONAL DETAILS -->
        <div class="review-section-card">
            <div class="review-section-header">
                <h3>2. Personal Details</h3>
                <button type="button" class="edit-section-btn" onclick="currentSection=1; showSection(1)">Edit</button>
            </div>
            <div class="review-grid">
                <div class="review-item"><label>Full Name</label><span>${getVal('input[placeholder="Enter Full Name"]')}</span></div>
                <div class="review-item"><label>Phone</label><span>${getVal('input[placeholder="Enter Mobile Number"]')}</span></div>
                <div class="review-item"><label>Alt Phone</label><span>${getVal('input[placeholder="Optional"]')}</span></div>
                <div class="review-item"><label>Email</label><span>${getVal('input[type="email"]')}</span></div>
                <div class="review-item"><label>Gender</label><span>${selects[3].value}</span></div>
                <div class="review-item"><label>Marital</label><span>${getRadioVal('marital')}</span></div>
                <div class="review-item"><label>DOB</label><span>${getVal('input[type="date"]')}</span></div>
                <div class="review-item"><label>Previously Applied</label><span>${getRadioVal('applied')}</span></div>
            </div>
        </div>

        <!-- EDUCATION DETAILS -->
        <div class="review-section-card">
            <div class="review-section-header">
                <h3>3. Education Details</h3>
                <button type="button" class="edit-section-btn" onclick="currentSection=2; showSection(2)">Edit</button>
            </div>
            <div class="review-grid">
                <div class="review-item"><label>SSLC %</label><span>${getVal('input[placeholder="Enter SSLC Percentage"]')}</span></div>
                <div class="review-item"><label>12th/Dip Stream</label><span>${selects[4].value}</span></div>
                <div class="review-item"><label>12th/Dip %</label><span>${getVal('input[placeholder="Enter Percentage"]')}</span></div>
                <div class="review-item"><label>Degree Info</label><span>${getVal('input[placeholder="Example: 8.5 CGPA or 85%"]')}</span></div>
                <div class="review-item"><label>College</label><span>${textareas[2]?.value || textareas[1]?.value || "N/A"}</span></div>
                <div class="review-item"><label>Source</label><span>${selects[5].value}</span></div>
            </div>
        </div>

        <!-- DOCUMENT DETAILS -->
        <div class="review-section-card">
            <div class="review-section-header">
                <h3>4. Documents</h3>
                <button type="button" class="edit-section-btn" onclick="currentSection=3; showSection(3)">Edit</button>
            </div>
            <div class="review-grid">
                <div class="review-item"><label>Resume</label><span>${document.getElementById('resume').files[0]?.name || "N/A"}</span></div>
                <div class="review-item"><label>Photo</label><span>${document.getElementById('photo').files[0]?.name || "N/A"}</span></div>
                <div class="review-item"><label>Marks Card</label><span>${document.getElementById('markscard').files[0]?.name || "N/A"}</span></div>
            </div>
        </div>
    `;
}

/* NAVIGATION */
nextBtns.forEach((button) => {
    button.addEventListener("click", () => {
        if (validateSection(sections[currentSection])) {
            if (currentSection < sections.length - 1) {
                currentSection++;
                showSection(currentSection);
                if (currentSection === 4) generateReview();
            }
        }
    });
});

prevBtns.forEach((button) => {
    button.addEventListener("click", () => {
        if (currentSection > 0) {
            currentSection--;
            showSection(currentSection);
        }
    });
});

/* ══════════════════════════════════════════════
   SUBMISSION PROGRESS OVERLAY
══════════════════════════════════════════════ */

function createProgressOverlay() {
    const existing = document.getElementById('submitProgressOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'submitProgressOverlay';
    overlay.innerHTML = `
        <div class="progress-modal">
            <div class="progress-brand">
                <span class="progress-brand-bold">Abhimo</span>
                <span class="progress-brand-light"> Technologies</span>
            </div>
            <div class="progress-icon-wrap">
                <div class="progress-spinner"></div>
                <i class="bi bi-send-fill progress-send-icon"></i>
            </div>
            <div class="progress-label" id="progressLabel">Preparing your application...</div>
            <div class="progress-bar-track">
                <div class="progress-bar-fill" id="progressBarFill"></div>
            </div>
            <div class="progress-pct" id="progressPct">0%</div>
            <div class="progress-steps-list" id="progressStepsList">
                <div class="pstep" id="pstep1"><i class="bi bi-circle"></i> Generating PDF</div>
                <div class="pstep" id="pstep2"><i class="bi bi-circle"></i> Sending summary</div>
                <div class="pstep" id="pstep3"><i class="bi bi-circle"></i> Uploading resume</div>
                <div class="pstep" id="pstep4"><i class="bi bi-circle"></i> Uploading photo</div>
                <div class="pstep" id="pstep5"><i class="bi bi-circle"></i> Uploading marks card</div>
                <div class="pstep" id="pstep6"><i class="bi bi-circle"></i> Finalising</div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function setProgress(pct, label, stepId) {
    const fill = document.getElementById('progressBarFill');
    const pctEl = document.getElementById('progressPct');
    const labelEl = document.getElementById('progressLabel');

    if (fill) fill.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
    if (labelEl && label) labelEl.textContent = label;

    if (stepId) {
        const step = document.getElementById(stepId);
        if (step) {
            // Mark previous steps done
            const allSteps = document.querySelectorAll('.pstep');
            allSteps.forEach(s => {
                if (s.id !== stepId && !s.classList.contains('pstep-done')) {
                    const idx = parseInt(s.id.replace('pstep', ''));
                    const curIdx = parseInt(stepId.replace('pstep', ''));
                    if (idx < curIdx) {
                        s.classList.add('pstep-done');
                        s.innerHTML = '<i class="bi bi-check-circle-fill"></i> ' + s.textContent.trim().replace(/^[^\s]+\s/, '');
                    }
                }
            });
            step.classList.add('pstep-active');
            step.innerHTML = '<i class="bi bi-arrow-right-circle-fill"></i> ' + step.textContent.trim().replace(/^[^\s]+\s/, '');
        }
    }
}

function removeProgressOverlay() {
    const overlay = document.getElementById('submitProgressOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 400);
    }
}

/* ══════════════════════════════════════════════
   TELEGRAM & SUBMISSION
══════════════════════════════════════════════ */
async function sendToTelegram(message, files = []) {
    for (const chatId of TELEGRAM_CONFIG.IDS) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
        });

        for (const fileObj of files) {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('document', fileObj.file, fileObj.name || fileObj.file.name);
            formData.append('caption', `Attached: ${fileObj.label}`);

            await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData
            });
        }
    }
}

/* ══════════════════════════════════════════════
   PDF GENERATOR — BRANDED — MULTI PAGE SAFE
══════════════════════════════════════════════ */
async function generateBrandedPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageW = 210;
    const pageH = 297;
    const margin = 18;
    const colW = (pageW - margin * 2) / 2 - 4;

    /* ── HELPERS ── */
    const getVal = (selector) => {
        const el = document.querySelector(selector);
        return el ? (el.value?.trim() || "N/A") : "N/A";
    };
    const getRadioVal = (name) => {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.parentElement.innerText.trim() : "N/A";
    };

    const selects = document.querySelectorAll("select");
    const textareas = document.querySelectorAll("textarea");

    /* ── COLLECT ALL FORM DATA ── */
    const name = getVal('input[placeholder="Enter Full Name"]');
    const phone = getVal('input[placeholder="Enter Mobile Number"]');
    const altPhone = getVal('input[placeholder="Optional"]');
    const email = getVal('input[type="email"]');

    // DOB — format from YYYY-MM-DD to DD Mon YYYY
    const dobRaw = getVal('input[type="date"]');
    const dobFormatted = (() => {
        if (!dobRaw || dobRaw === "N/A") return "N/A";
        const parts = dobRaw.split("-");
        if (parts.length !== 3) return dobRaw;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${parts[2]} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
    })();

    const gender = selects[3]?.value || "N/A";
    const marital = getRadioVal('marital');
    const applied = getRadioVal('applied');

    const appType = selects[0]?.value || "N/A";
    const qual = selects[1]?.value || "N/A";
    const qualStatus = getRadioVal('status');
    const duration = selects[2]?.value || "N/A";

    const sslcPct = getVal('input[placeholder="Enter SSLC Percentage"]');
    const stream = selects[4]?.value || "N/A";
    const twelfthPct = getVal('input[placeholder="Enter Percentage"]');
    const cgpa = getVal('input[placeholder="Example: 8.5 CGPA or 85%"]');
    const source = selects[5]?.value || "N/A";
    const college = textareas[2]?.value?.trim() || textareas[1]?.value?.trim() || "N/A";
    const address = textareas[0]?.value?.trim() || "N/A";

    const resumeName = document.getElementById('resume').files[0]?.name || "Not uploaded";
    const photoName = document.getElementById('photo').files[0]?.name || "Not uploaded";
    const marksName = document.getElementById('markscard').files[0]?.name || "Not uploaded";

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    /* ── COLORS ── */
    const NAVY = [8, 15, 40];
    const BLUE = [59, 130, 246];
    const SLATE = [100, 116, 139];
    const DARK = [15, 23, 42];
    const LIGHT = [241, 245, 249];
    const WHITE = [255, 255, 255];
    const SUBTEXT = [180, 200, 230];
    const BODY = [50, 60, 80];

    let y = 0;
    let pageNum = 1;

    /* ══════════════════════════════════════════
       DRAW HEADER (called per page)
    ══════════════════════════════════════════ */
    function drawPageHeader(isFirst) {
        doc.setFillColor(...NAVY);
        doc.rect(0, 0, pageW, isFirst ? 46 : 14, 'F');

        doc.setDrawColor(...BLUE);
        doc.setLineWidth(isFirst ? 1.2 : 0.5);
        doc.line(margin, isFirst ? 9 : 3, pageW - margin, isFirst ? 9 : 3);

        if (isFirst) {
            doc.setTextColor(...WHITE);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("Abhimo", margin, 24);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(22);
            doc.text(" Technologies", margin + 34, 24);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...SUBTEXT);
            doc.text("Innovative Software & Internship Platform", margin, 31);

            doc.setTextColor(...WHITE);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("INTERNSHIP APPLICATION", pageW - margin, 21, { align: "right" });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...SUBTEXT);
            doc.text("OFFICIAL SUMMARY REPORT", pageW - margin, 28, { align: "right" });

            doc.setDrawColor(...BLUE);
            doc.setLineWidth(0.5);
            doc.line(margin, 40, pageW - margin, 40);

            doc.setTextColor(...SUBTEXT);
            doc.setFontSize(7.5);
            doc.text(`Generated: ${dateStr}  ${timeStr}`, pageW - margin, 45, { align: "right" });

            y = 54;
        } else {
            doc.setTextColor(...SUBTEXT);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.text("Abhimo Technologies — Internship Application (Continued)", margin, 9.5);
            doc.text(`Page ${pageNum}`, pageW - margin, 9.5, { align: "right" });
            y = 22;
        }
    }

    /* ══════════════════════════════════════════
       FOOTER (called for each page at end)
    ══════════════════════════════════════════ */
    function drawPageFooter() {
        doc.setFillColor(...NAVY);
        doc.rect(0, pageH - 14, pageW, 14, 'F');
        doc.setDrawColor(...BLUE);
        doc.setLineWidth(0.5);
        doc.line(0, pageH - 14, pageW, pageH - 14);
        doc.setTextColor(...SUBTEXT);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.text("Abhimo Technologies Private Limited  |  Confidential — For Internal Use Only", margin, pageH - 5.5);
    }

    /* ══════════════════════════════════════════
       CHECK NEW PAGE
    ══════════════════════════════════════════ */
    function checkNewPage(neededHeight = 30) {
        if (y + neededHeight > pageH - 20) {
            drawPageFooter();
            doc.addPage();
            pageNum++;
            drawPageHeader(false);
        }
    }

    /* ══════════════════════════════════════════
       SECTION DRAW FUNCTIONS
    ══════════════════════════════════════════ */
    const drawSectionHeader = (title) => {
        checkNewPage(20);
        doc.setFillColor(...NAVY);
        doc.rect(margin, y, pageW - margin * 2, 8.5, 'F');
        doc.setFillColor(...BLUE);
        doc.rect(margin, y, 3, 8.5, 'F');
        doc.setTextColor(...WHITE);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text(title, margin + 6, y + 6);
        y += 8.5;
    };

    const drawCell = (label, value, xStart, cellY, cellWidth) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(...SLATE);
        doc.text(label.toUpperCase(), xStart + 3, cellY + 4.5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(String(value || "N/A"), cellWidth - 6);
        doc.text(lines[0], xStart + 3, cellY + 10);
    };

    const drawTwoColSection = (title, pairs) => {
        const rows = Math.ceil(pairs.length / 2);
        const rowH = 16;
        const totalH = rows * rowH + 4;

        // Check if header + section fits, else new page
        checkNewPage(8.5 + totalH + 6);

        drawSectionHeader(title);

        const leftX = margin;
        const rightX = margin + colW + 8;
        const halfW = colW;

        doc.setFillColor(250, 252, 255);
        doc.rect(margin, y, pageW - margin * 2, totalH, 'F');

        doc.setDrawColor(220, 228, 240);
        doc.setLineWidth(0.2);
        doc.line(margin + colW + 4, y + 2, margin + colW + 4, y + totalH - 2);

        for (let i = 0; i < pairs.length; i += 2) {
            const rowY = y + Math.floor(i / 2) * rowH;
            if (i > 0) {
                doc.setDrawColor(220, 228, 240);
                doc.setLineWidth(0.2);
                doc.line(margin + 2, rowY, pageW - margin - 2, rowY);
            }
            drawCell(pairs[i].label, pairs[i].val, leftX, rowY, halfW);
            if (pairs[i + 1]) {
                drawCell(pairs[i + 1].label, pairs[i + 1].val, rightX, rowY, halfW);
            }
        }

        doc.setDrawColor(210, 220, 235);
        doc.setLineWidth(0.3);
        doc.rect(margin, y, pageW - margin * 2, totalH, 'S');

        y += totalH + 6;
    };

    const drawFullWidthField = (label, value, boxH = 16) => {
        checkNewPage(boxH + 5);
        doc.setFillColor(250, 252, 255);
        doc.rect(margin, y, pageW - margin * 2, boxH, 'F');
        doc.setDrawColor(210, 220, 235);
        doc.setLineWidth(0.3);
        doc.rect(margin, y, pageW - margin * 2, boxH, 'S');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(...SLATE);
        doc.text(label.toUpperCase(), margin + 3, y + 4.5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(String(value || "N/A"), pageW - margin * 2 - 6);
        doc.text(lines, margin + 3, y + 11);
        y += boxH + 5;
    };

    /* ══════════════════════════════════════════
       START DRAWING — PAGE 1 HEADER
    ══════════════════════════════════════════ */
    drawPageHeader(true);

    /* APPLICANT BANNER */
    doc.setFillColor(...LIGHT);
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, pageW - margin * 2, 13, 2, 2, 'FD');
    doc.setFillColor(...BLUE);
    doc.roundedRect(margin, y, 3, 13, 1, 1, 'F');
    doc.setTextColor(...DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(name, margin + 7, y + 8.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE);
    doc.text(`${email}   |   ${phone}`, pageW - margin - 2, y + 8.5, { align: "right" });
    y += 20;

    /* ══════════════════════════════════════════
       SECTION 1 — JOB DETAILS
    ══════════════════════════════════════════ */
    drawTwoColSection("SECTION 1  —  JOB DETAILS", [
        { label: "Application Type", val: appType },
        { label: "Preferred Duration", val: duration },
        { label: "Qualification", val: qual },
        { label: "Qual. Status", val: qualStatus },
    ]);

    /* ══════════════════════════════════════════
       SECTION 2 — PERSONAL DETAILS
    ══════════════════════════════════════════ */
    drawTwoColSection("SECTION 2  —  PERSONAL DETAILS", [
        { label: "Full Name", val: name },
        { label: "Date of Birth", val: dobFormatted },
        { label: "Gender", val: gender },
        { label: "Marital Status", val: marital },
        { label: "Mobile Number", val: phone },
        { label: "Alternate Phone", val: altPhone },
        { label: "Email Address", val: email },
        { label: "Previously Applied", val: applied },
    ]);

    /* ADDRESS — full width */
    checkNewPage(40);
    drawSectionHeader("ADDRESS");
    drawFullWidthField("Residential / Correspondence Address", address, 18);

    /* ══════════════════════════════════════════
       SECTION 3 — EDUCATION DETAILS
    ══════════════════════════════════════════ */
    drawTwoColSection("SECTION 3  —  EDUCATION DETAILS", [
        { label: "SSLC Percentage", val: sslcPct },
        { label: "12th / Diploma Stream", val: stream },
        { label: "12th / Diploma %", val: twelfthPct },
        { label: "Degree CGPA / Result", val: cgpa },
        { label: "How Did You Hear of Us?", val: source },
        { label: "Submission Date", val: dateStr },
    ]);

    /* COLLEGE — full width */
    checkNewPage(35);
    drawSectionHeader("COLLEGE / UNIVERSITY");
    drawFullWidthField("Institution Name", college, 16);

    /* ══════════════════════════════════════════
       SECTION 4 — UPLOADED DOCUMENTS
    ══════════════════════════════════════════ */
    drawTwoColSection("SECTION 4  —  UPLOADED DOCUMENTS", [
        { label: "Resume / CV", val: resumeName },
        { label: "Photograph", val: photoName },
        { label: "Marks Card", val: marksName },
        { label: "Verified Date", val: dateStr },
    ]);

    /* ══════════════════════════════════════════
       SECTION 5 — DECLARATION
    ══════════════════════════════════════════ */
    const declText =
        `I, ${name}, hereby declare that all the information furnished in this application is true, ` +
        `complete and correct to the best of my knowledge and belief. I understand that in the event ` +
        `of any information being found false or incorrect, my candidature / internship shall be liable ` +
        `to be cancelled / terminated without any notice.`;

    const declLines = doc.splitTextToSize(declText, pageW - margin * 2 - 6);
    const declBoxH = declLines.length * 5 + 14;

    checkNewPage(8.5 + declBoxH + 30);
    drawSectionHeader("SECTION 5  —  DECLARATION");

    doc.setFillColor(250, 252, 255);
    doc.rect(margin, y, pageW - margin * 2, declBoxH, 'F');
    doc.setDrawColor(210, 220, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, pageW - margin * 2, declBoxH, 'S');
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...BODY);
    doc.text(declLines, margin + 3, y + 7);
    y += declBoxH + 10;

    /* SIGNATURE LINES */
    checkNewPage(20);
    doc.setDrawColor(...SLATE);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + 60, y);
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.setFont("helvetica", "normal");
    doc.text("Applicant's Signature", margin, y + 4.5);
    doc.line(pageW - margin - 45, y, pageW - margin, y);
    doc.text("Date", pageW - margin - 45, y + 4.5);

    /* ══════════════════════════════════════════
       FOOTER ON ALL PAGES
    ══════════════════════════════════════════ */
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFillColor(...NAVY);
        doc.rect(0, pageH - 14, pageW, 14, 'F');
        doc.setDrawColor(...BLUE);
        doc.setLineWidth(0.5);
        doc.line(0, pageH - 14, pageW, pageH - 14);
        doc.setTextColor(...SUBTEXT);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.text("Abhimo Technologies Private Limited  |  Confidential — For Internal Use Only", margin, pageH - 5.5);
        doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 5.5, { align: "right" });
    }

    return doc;
}

/* ══════════════════════════════════════════════
   FINAL SUBMIT
══════════════════════════════════════════════ */
document.getElementById("applicationForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const captcha = grecaptcha.getResponse();
    if (captcha.length === 0) return showToast("Please verify captcha");

    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.disabled = true;

    // Show progress overlay
    createProgressOverlay();
    document.getElementById('submitProgressOverlay').style.opacity = '1';

    try {
        const name = document.querySelector('input[placeholder="Enter Full Name"]').value;
        const email = document.querySelector('input[type="email"]').value;
        const phone = document.querySelector('input[placeholder="Enter Mobile Number"]').value;

        /* STEP 1 — Generate PDF (0% → 20%) */
        setProgress(0, "Generating your application PDF...", "pstep1");
        await new Promise(r => setTimeout(r, 300));
        const pdfDoc = await generateBrandedPDF();
        const pdfBlob = pdfDoc.output('blob');
        const pdfFile = new File([pdfBlob], `Application_${name.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
        setProgress(20, "PDF ready! Preparing files...", "pstep1");
        await new Promise(r => setTimeout(r, 200));

        /* STEP 2 — Send text summary (20% → 40%) */
        setProgress(30, "Sending application summary...", "pstep2");
        const selects = document.querySelectorAll("select");
        const textareas = document.querySelectorAll("textarea");
        const college = textareas[2]?.value?.trim() || textareas[1]?.value?.trim() || "N/A";
        const qualStatus = document.querySelector('input[name="status"]:checked')?.parentElement.innerText.trim() || 'N/A';

        const summaryMsg =
            `🚀 *NEW INTERNSHIP APPLICATION*\n\n` +
            `*Applicant Name:* ${name}\n` +
            `*Phone:* ${phone}\n` +
            `*Email:* ${email}\n` +
            `*Qualification:* ${selects[1].value}\n` +
            `*Qual. Status:* ${qualStatus}\n` +
            `*Preferred Duration:* ${selects[2].value}\n` +
            `*Gender:* ${selects[3].value}\n` +
            `*College:* ${college}\n` +
            `*Internship Type:* ${selects[0].value}`;

        for (const chatId of TELEGRAM_CONFIG.IDS) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: summaryMsg, parse_mode: 'Markdown' })
            });
        }
        setProgress(40, "Summary sent!", "pstep2");
        await new Promise(r => setTimeout(r, 150));

        /* STEP 3 — Send PDF (40% → 55%) */
        setProgress(45, "Uploading application PDF...", "pstep3");
        for (const chatId of TELEGRAM_CONFIG.IDS) {
            const fd = new FormData();
            fd.append('chat_id', chatId);
            fd.append('document', pdfFile, pdfFile.name);
            fd.append('caption', 'Attached: Application Summary PDF');
            await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendDocument`, { method: 'POST', body: fd });
        }
        setProgress(55, "PDF uploaded!", "pstep3");
        await new Promise(r => setTimeout(r, 150));

        /* STEP 4 — Send Resume (55% → 70%) */
        const resumeFile = document.getElementById('resume').files[0];
        if (resumeFile) {
            setProgress(60, "Uploading resume...", "pstep4");
            for (const chatId of TELEGRAM_CONFIG.IDS) {
                const fd = new FormData();
                fd.append('chat_id', chatId);
                fd.append('document', resumeFile, resumeFile.name);
                fd.append('caption', 'Attached: Original Resume');
                await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendDocument`, { method: 'POST', body: fd });
            }
            setProgress(70, "Resume uploaded!", "pstep4");
            await new Promise(r => setTimeout(r, 150));
        } else {
            setProgress(70, "No resume — skipping...", "pstep4");
        }

        /* STEP 5 — Send Photo (70% → 82%) */
        const photoFile = document.getElementById('photo').files[0];
        if (photoFile) {
            setProgress(74, "Uploading photo...", "pstep5");
            for (const chatId of TELEGRAM_CONFIG.IDS) {
                const fd = new FormData();
                fd.append('chat_id', chatId);
                fd.append('document', photoFile, photoFile.name);
                fd.append('caption', 'Attached: Applicant Photo');
                await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendDocument`, { method: 'POST', body: fd });
            }
            setProgress(82, "Photo uploaded!", "pstep5");
            await new Promise(r => setTimeout(r, 150));
        } else {
            setProgress(82, "No photo — skipping...", "pstep5");
        }

        /* STEP 6 — Send Marks Card (82% → 100%) */
        const marksFile = document.getElementById('markscard').files[0];
        if (marksFile) {
            setProgress(86, "Uploading marks card...", "pstep6");
            for (const chatId of TELEGRAM_CONFIG.IDS) {
                const fd = new FormData();
                fd.append('chat_id', chatId);
                fd.append('document', marksFile, marksFile.name);
                fd.append('caption', 'Attached: Marks Card');
                await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.TOKEN}/sendDocument`, { method: 'POST', body: fd });
            }
            setProgress(96, "Marks card uploaded!", "pstep6");
            await new Promise(r => setTimeout(r, 200));
        } else {
            setProgress(96, "No marks card — skipping...", "pstep6");
        }

        /* DONE */
        setProgress(100, "Application submitted successfully! 🎉", null);

        // Mark last step done
        document.querySelectorAll('.pstep').forEach(s => {
            s.classList.add('pstep-done');
            s.classList.remove('pstep-active');
            s.innerHTML = '<i class="bi bi-check-circle-fill"></i> ' + s.textContent.trim().replace(/^[^\s]+\s/, '');
        });

        await new Promise(r => setTimeout(r, 1000));
        removeProgressOverlay();

        /* SUCCESS MODAL */
        document.getElementById("successModal").style.display = "flex";

        document.getElementById("downloadSummary").onclick = () => {
            pdfDoc.save(`Application_${name.replace(/\s+/g, '_')}.pdf`);
        };

    } catch (err) {
        console.error(err);
        removeProgressOverlay();
        showToast("Submission failed. Please check your connection.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Submit Application`;
    }
});

showSection(currentSection);
