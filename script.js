const hourEl = document.getElementById("hour");
const minuteEl = document.getElementById("minutes");
const secondEl = document.getElementById("seconds");
const ampmEl = document.getElementById("ampm");
const countdownDisplayEl = document.getElementById("countdownDisplay");
const timezoneSelect = document.getElementById("timezone");
const weatherDisplayEl = document.getElementById("weatherDisplay");
const timeFactDisplayEl = document.getElementById("timeFactDisplay");
const greetingDisplayEl = document.getElementById("greetingDisplay");

let countdownInterval;
let clockInterval;
let currentTimezone = "local";
let localClockInterval;

showDigitalClock();
getWeather();

function updateClock() {
    const date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let ampm = "AM";

    if (h >= 12) {
        ampm = "PM";
        if (h > 12) h -= 12;
    }

    hourEl.innerText = h < 10 ? "0" + h : h;
    minuteEl.innerText = m < 10 ? "0" + m : m;
    secondEl.innerText = s < 10 ? "0" + s : s;
    ampmEl.innerText = ampm;

    document.getElementById("futuristicTime").innerText = `${h}:${m}:${s} ${ampm}`;

    updateGreeting(h);
}

function updateGreeting(hour) {
    let greeting;
    if (hour < 12) {
        greeting = "Good Morning!";
    } else if (hour < 18) {
        greeting = "Good Afternoon!";
    } else {
        greeting = "Good Evening!";
    }
    greetingDisplayEl.innerText = greeting;
}

function updateTimezone() {
    const selectedTimezone = timezoneSelect.value;
    const offsetMap = {
        "local": 0,
        "UTC": 0,
        "GMT": 0,
        "EST": -5,
        "CST": -6,
        "MST": -7,
        "PST": -8
    };

    clearInterval(clockInterval);
    clearInterval(localClockInterval);
    
    if (selectedTimezone !== "local") {
        currentTimezone = selectedTimezone;
        const offset = offsetMap[currentTimezone] * 60 * 60 * 1000;

        clockInterval = setInterval(() => {
            const currentDate = new Date();
            const adjustedDate = new Date(currentDate.getTime() + offset);
            updateClockDisplay(adjustedDate);
        }, 1000);
    } else {
        currentTimezone = "local";
        localClockInterval = setInterval(updateClock, 1000);
    }
}

function updateClockDisplay(date) {
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let ampm = "AM";

    if (h >= 12) {
        ampm = "PM";
        if (h > 12) h -= 12;
    }

    hourEl.innerText = h < 10 ? "0" + h : h;
    minuteEl.innerText = m < 10 ? "0" + m : m;
    secondEl.innerText = s < 10 ? "0" + s : s;
    ampmEl.innerText = ampm;
}

function startCountdown() {
    const countdownInput = document.getElementById("countdownInput").value;
    const targetDate = new Date(countdownInput).getTime();

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownDisplayEl.innerHTML = "Countdown finished!";
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownDisplayEl.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

function showDigitalClock() {
    document.getElementById("digitalClock").style.display = "block";
    document.getElementById("analogClock").style.display = "none";
    document.getElementById("futuristicClock").style.display = "none";
    localClockInterval = setInterval(updateClock, 1000);
}

function showAnalogClock() {
    document.getElementById("digitalClock").style.display = "none";
    document.getElementById("analogClock").style.display = "block";
    document.getElementById("futuristicClock").style.display = "none";
    clearInterval(localClockInterval);
    startAnalogClock();
}

function startAnalogClock() {
    const update = () => {
        const now = new Date();
        const secondsRatio = now.getSeconds() / 60;
        const minutesRatio = (secondsRatio + now.getMinutes()) / 60;
        const hoursRatio = (minutesRatio + now.getHours()) / 12;

        document.querySelector('.second-hand').style.transform = `translateX(-50%) rotate(${secondsRatio * 360}deg)`;
        document.querySelector('.minute-hand').style.transform = `translateX(-50%) rotate(${minutesRatio * 360}deg)`;
        document.querySelector('.hour-hand').style.transform = `translateX(-50%) rotate(${hoursRatio * 360}deg)`;
    };

    update();
    clockInterval = setInterval(update, 1000);
}

function showFuturisticClock() {
    document.getElementById("digitalClock").style.display = "none";
    document.getElementById("analogClock").style.display = "none";
    document.getElementById("futuristicClock").style.display = "block";
    localClockInterval = setInterval(updateClock, 1000);
}

async function getWeather() {
    const response = await fetch("https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=New York&aqi=no");
    const data = await response.json();
    weatherDisplayEl.innerText = `Weather: ${data.current.temp_c}°C, ${data.current.condition.text}`;
}

const greetings = {
    morning: "Good Morning!",
    afternoon: "Good Afternoon!",
    evening: "Good Evening!",
    night: "Good Night!",
};

const timeFacts = [
    "A day is defined as the time it takes for the Earth to rotate once on its axis.",
    "The second is the base unit of time in the International System of Units (SI).",
    "The longest time unit is a millennium, which is 1,000 years.",
    "The word 'minute' comes from the Latin phrase 'pars minuta prima,' meaning 'first small part.'",
    "In 1967, the definition of the second was redefined based on atomic time.",
];

function getCurrentGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
        return greetings.morning;
    } else if (hour < 18) {
        return greetings.afternoon;
    } else if (hour < 21) {
        return greetings.evening;
    } else {
        return greetings.night;
    }
}

function getRandomFact() {
    const randomIndex = Math.floor(Math.random() * timeFacts.length);
    return timeFacts[randomIndex];
}

function displayRandomFact() {
    document.getElementById("timeFactDisplay").textContent = getRandomFact();
}

// Set the greeting on page load
document.getElementById("greetingDisplay").textContent = getCurrentGreeting();

// Call displayRandomFact() if you want to show a fact immediately when the page loads
// displayRandomFact();


async function getWeather() {
    const apiKey = "eff921ff677584f647bfb9535b664246"; // Replace with your OpenWeather API key
    const city = "New York"; // Change to your desired city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const temperature = data.main.temp;
        const weatherDescription = data.weather[0].description;

        weatherDisplayEl.innerHTML = `Weather in ${city}: ${temperature}°C, ${weatherDescription}`;
    } catch (error) {
        weatherDisplayEl.innerHTML = "Error fetching weather data.";
    }
}