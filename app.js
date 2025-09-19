// DOM Elements
const userInput = document.getElementById("date");
const result = document.getElementById("result");
const errorMessage = document.getElementById("error-message");

// Set maximum date to today
userInput.max = new Date().toISOString().split("T")[0];

// Real-time age calculation
let updateInterval;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Add input event listener for real-time updates
    userInput.addEventListener('input', function() {
        clearTimeout(updateInterval);
        updateInterval = setTimeout(() => {
            if (userInput.value) {
                calculateAge();
            } else {
                hideResult();
            }
        }, 500); // Debounce for 500ms
    });
    
    // Add Enter key support
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && userInput.value) {
            calculateAge();
        }
    });
});

function calculateAge() {
    // Clear previous error messages
    hideError();
    
    const birthDateValue = userInput.value;
    
    // Validate input
    if (!birthDateValue) {
        showError("Please select your birth date");
        return;
    }
    
    const birthDate = new Date(birthDateValue);
    const today = new Date();
    
    // Validate date
    if (birthDate > today) {
        showError("Birth date cannot be in the future");
        return;
    }
    
    if (birthDate.getFullYear() < 1900) {
        showError("Please enter a valid birth date");
        return;
    }
    
    try {
        // Calculate age in different units
        const ageData = calculateAgeDetailed(birthDate, today);
        
        // Display results
        displayResults(ageData);
        
    } catch (error) {
        showError("An error occurred while calculating your age");
        console.error('Age calculation error:', error);
    }
}

function calculateAgeDetailed(birthDate, today) {
    // Basic age calculation
    let d1 = birthDate.getDate();
    let m1 = birthDate.getMonth() + 1;
    let y1 = birthDate.getFullYear();
    
    let d2 = today.getDate();
    let m2 = today.getMonth() + 1;
    let y2 = today.getFullYear();
    
    let d3, m3, y3;
    
    y3 = y2 - y1;
    
    if (m2 >= m1) {
        m3 = m2 - m1;
    } else {
        y3--;
        m3 = 12 + m2 - m1;
    }
    
    if (d2 >= d1) {
        d3 = d2 - d1;
    } else {
        m3--;
        d3 = getDaysInMonth(y1, m1) + d2 - d1;
    }
    
    if (m3 < 0) {
        m3 = 11;
        y3--;
    }
    
    // Calculate additional time units
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor((today - birthDate) / (1000 * 60 * 60));
    const totalMinutes = Math.floor((today - birthDate) / (1000 * 60));
    const totalSeconds = Math.floor((today - birthDate) / 1000);
    
    // Calculate weeks
    const totalWeeks = Math.floor(totalDays / 7);
    
    // Calculate leap years
    const leapYears = countLeapYears(y1, y2);
    
    // Calculate next birthday
    const nextBirthday = getNextBirthday(birthDate, today);
    
    return {
        years: y3,
        months: m3,
        days: d3,
        totalDays: totalDays,
        totalWeeks: totalWeeks,
        totalHours: totalHours,
        totalMinutes: totalMinutes,
        totalSeconds: totalSeconds,
        leapYears: leapYears,
        nextBirthday: nextBirthday
    };
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

function countLeapYears(startYear, endYear) {
    let leapYears = 0;
    for (let year = startYear; year < endYear; year++) {
        if (isLeapYear(year)) {
            leapYears++;
        }
    }
    return leapYears;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getNextBirthday(birthDate, today) {
    const currentYear = today.getFullYear();
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    // If birthday has already passed this year, set it for next year
    if (nextBirthday <= today) {
        nextBirthday.setFullYear(currentYear + 1);
    }
    
    const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    return {
        date: nextBirthday,
        daysUntil: daysUntilBirthday
    };
}

function displayResults(ageData) {
    const { years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, totalSeconds, leapYears, nextBirthday } = ageData;
    
    // Format numbers with commas
    const formatNumber = (num) => num.toLocaleString();
    
    // Get day of week for birth date
    const birthDayOfWeek = new Date(userInput.value).toLocaleDateString('en-US', { weekday: 'long' });
    
    // Get zodiac sign (simplified)
    const zodiacSign = getZodiacSign(new Date(userInput.value));
    
    result.innerHTML = `
        <div class="age-display">
            <div class="age-main">
                You are <span class="highlight">${years}</span> years, 
                <span class="highlight">${months}</span> months, and 
                <span class="highlight">${days}</span> days old
            </div>
            
            <div class="age-details">
                <div class="age-item">
                    <span class="number">${formatNumber(totalDays)}</span>
                    <span class="label">Total Days</span>
                </div>
                <div class="age-item">
                    <span class="number">${formatNumber(totalWeeks)}</span>
                    <span class="label">Weeks</span>
                </div>
                <div class="age-item">
                    <span class="number">${formatNumber(totalHours)}</span>
                    <span class="label">Hours</span>
                </div>
                <div class="age-item">
                    <span class="number">${formatNumber(totalMinutes)}</span>
                    <span class="label">Minutes</span>
                </div>
                <div class="age-item">
                    <span class="number">${formatNumber(totalSeconds)}</span>
                    <span class="label">Seconds</span>
                </div>
                <div class="age-item">
                    <span class="number">${leapYears}</span>
                    <span class="label">Leap Years</span>
                </div>
            </div>
            
            <div class="additional-info">
                <p><strong>Born on:</strong> ${birthDayOfWeek}</p>
                <p><strong>Zodiac Sign:</strong> ${zodiacSign}</p>
                <p><strong>Next Birthday:</strong> ${nextBirthday.daysUntil} days away</p>
            </div>
        </div>
    `;
    
    // Show result with animation
    result.classList.add('show');
    
    // Update age in real-time
    startRealTimeUpdates();
}

function getZodiacSign(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const signs = [
        { name: "Capricorn", start: [12, 22], end: [1, 19] },
        { name: "Aquarius", start: [1, 20], end: [2, 18] },
        { name: "Pisces", start: [2, 19], end: [3, 20] },
        { name: "Aries", start: [3, 21], end: [4, 19] },
        { name: "Taurus", start: [4, 20], end: [5, 20] },
        { name: "Gemini", start: [5, 21], end: [6, 20] },
        { name: "Cancer", start: [6, 21], end: [7, 22] },
        { name: "Leo", start: [7, 23], end: [8, 22] },
        { name: "Virgo", start: [8, 23], end: [9, 22] },
        { name: "Libra", start: [9, 23], end: [10, 22] },
        { name: "Scorpio", start: [10, 23], end: [11, 21] },
        { name: "Sagittarius", start: [11, 22], end: [12, 21] }
    ];
    
    for (const sign of signs) {
        const [startMonth, startDay] = sign.start;
        const [endMonth, endDay] = sign.end;
        
        if ((month === startMonth && day >= startDay) || 
            (month === endMonth && day <= endDay)) {
            return sign.name;
        }
    }
    
    return "Unknown";
}

function startRealTimeUpdates() {
    // Update seconds every second
    setInterval(() => {
        if (userInput.value && result.classList.contains('show')) {
            const birthDate = new Date(userInput.value);
            const today = new Date();
            const totalSeconds = Math.floor((today - birthDate) / 1000);
            
            // Update the seconds display
            const secondsElement = result.querySelector('.age-item:last-child .number');
            if (secondsElement) {
                secondsElement.textContent = totalSeconds.toLocaleString();
            }
        }
    }, 1000);
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    hideResult();
}

function hideError() {
    errorMessage.style.display = 'none';
}

function hideResult() {
    result.classList.remove('show');
    result.style.display = 'none';
}

// Add some fun animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add click animation to calculate button
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
    
    // Add floating animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease-out forwards';
    });
});

// CSS for animations (injected via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .additional-info {
        margin-top: 24px;
        padding: 20px;
        background: rgba(102, 126, 234, 0.1);
        border-radius: 12px;
        border-left: 4px solid #667eea;
    }
    
    .additional-info p {
        margin-bottom: 8px;
        color: #4a5568;
        font-size: 1rem;
    }
    
    .additional-info p:last-child {
        margin-bottom: 0;
    }
`;
document.head.appendChild(style);