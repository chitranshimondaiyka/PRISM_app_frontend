document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mock Student Data (Replace with real data from a backend) ---
    const studentData = {
        name: "Alex Doe",
        enrolmentNo: "A23B5678",
        section: "CS-Alpha",
        batch: "2023-2027",
        email: "alex.doe@university.edu",
        attendance: 68, // Example percentage
        progress: {
            labels: ["Calculus", "Data Structures", "Web Dev", "Physics", "Linear Algebra"],
            scores: [85, 95, 78, 70, 91]
        },
        tasks: {
            completed: 15,
            pending: 5
        }
    };

    // --- Populate Dashboard with Student Data ---
    document.getElementById('student-name').textContent = studentData.name;
    document.getElementById('student-enrolment').textContent = studentData.enrolmentNo;
    document.getElementById('student-section').textContent = studentData.section;
    document.getElementById('student-batch').textContent = studentData.batch;
    document.getElementById('student-email').textContent = studentData.email;
    document.getElementById('attendance-percentage-text').textContent = `${studentData.attendance}%`;


    // --- Page Navigation Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Update active link
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            // Show target page
            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });

    // --- Theme Switcher Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

    // --- Chart.js Implementations ---
    
    // 1. Attendance Chart (Bar)
    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    let attendanceColor;
    if (studentData.attendance >= 75) {
        attendanceColor = '#2ecc71'; // Green
    } else if (studentData.attendance >= 60) {
        attendanceColor = '#f1c40f'; // Yellow
    } else {
        attendanceColor = '#e74c3c'; // Red
    }
    
    new Chart(attendanceCtx, {
        type: 'bar',
        data: {
            labels: ['Overall Attendance'],
            datasets: [{
                label: 'Percentage',
                data: [studentData.attendance],
                backgroundColor: [attendanceColor],
                borderColor: [attendanceColor],
                borderWidth: 1,
                borderRadius: 5,
                barThickness: 60,
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, max: 100 } },
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 2. Progress Report Chart (Line)
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: studentData.progress.labels,
            datasets: [{
                label: 'Marks Obtained',
                data: studentData.progress.scores,
                fill: true,
                backgroundColor: 'rgba(106, 17, 203, 0.1)',
                borderColor: 'rgba(106, 17, 203, 1)',
                tension: 0.3
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, max: 100 } },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 3. Activities Chart (Pie)
    const tasksCtx = document.getElementById('tasksPieChart').getContext('2d');
    new Chart(tasksCtx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                label: 'Tasks',
                data: [studentData.tasks.completed, studentData.tasks.pending],
                backgroundColor: ['#2575fc', '#ff6b6b'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // --- QR Code Scanner Simulation ---
    const qrBtn = document.getElementById('scan-qr-btn');
    qrBtn.addEventListener('click', () => {
        alert(`QR Scanner Activated!\nSimulating scan...\n\nAttendance marked for ${studentData.enrolmentNo}.`);
        // In a real app, you would integrate a library like html5-qrcode-scanner here
    });

    // --- PDF Generation Logic ---
    const pdfButtons = document.querySelectorAll('.pdf-btn');
    pdfButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const elementToPrint = document.getElementById(targetId);
            
            if (elementToPrint) {
                alert("Preparing PDF... this may take a moment.");
                html2canvas(elementToPrint).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`${targetId}_${studentData.enrolmentNo}.pdf`);
                });
            }
        });
    });

    // --- Activities Page Interactivity ---
    const goalBoxes = document.querySelectorAll('.goal-box');
    const gridContainer = document.querySelector('.activities-grid');
    goalBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            // Prevent child icon clicks from triggering this
            if(e.target.tagName === 'I') return; 

            if (box.classList.contains('enlarged')) {
                box.classList.remove('enlarged');
                gridContainer.classList.remove('zoomed');
            } else {
                goalBoxes.forEach(b => b.classList.remove('enlarged'));
                box.classList.add('enlarged');
                gridContainer.classList.add('zoomed');
            }
        });
    });
});