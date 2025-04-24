const domain = 'nkalley-paradoxical-beta-1.gateway-nookalley.workers.dev'

function crashHandler() {
    document.getElementById('offline-modal').setAttribute("open", "true");
}

async function testConnection() {
    try {
        const response = await fetch(`https://${domain}/check`);
        if (response.status !== 200) {
            console.warn(`Looks like there was a problem. Status Code: ${response.status}`);
            crashHandler()
        } else {
            console.debug(`Server is online, status code ${response.status} was returned`)
        }
    } catch (err) {
        console.error(err)
        crashHandler()
    }
}

async function authorize() {
    try {
        if (typeof (Storage) !== "undefined") {
            try {
                const options = { method: 'POST' };
                const response = await fetch(`https://${domain}/auth/register?AppVersion=${navigator.appVersion}&Platform=${navigator.platform}&UserAgent=${navigator.userAgent}&Vendor=${navigator.vendor}&Key=sequentialdogs`, options);
                const data = await response.json();
                return localStorage.setItem("authKey", data.authKey); // Set key from server to localStorage
                // Fully Authorized
            } catch {
                crashHandler() // Failed to authorize with server
                throw new Error("Failed to authorize with server")
            }
        } else {
            alert('Web Storage failed, support or permission issue');
            crashHandler() // WebStorage error
            throw new Error("Web Storage Failure!")
        }
    } catch (err) {
        crashHandler()
        console.error('Error during authorization:', err);
        throw new Error("Failed to authorize with server")
    }
}

async function submit() {
    window.location = '#top'
    try { await testConnection() } catch (error) { crashHandler(); console.error(error) }
    try { await authorize() } catch (error) { crashHandler(); console.error(error) };
    try {
        const options = { method: 'POST' };
        const response = await fetch(`https://${domain}/generate?AuthKey=${localStorage.getItem("authKey")}&Key=sequentialdogs&lie=${input.value}`, options)
        const data = await response.json();
        return returnGenerative(data.response)
    } catch (error) {
        crashHandler() // Generation Failed
        throw new Error("Generation failed" + error);

    }

}

function checkJailbreakPhrases(inputString) {
    // Normalize the input string to lowercase for case-insensitive matching
    inputString = inputString.toLowerCase();

    // Regular expression pattern to detect potential jailbreak attempts
    const jailbreakPatterns = [
        /\b(disregard|ignore)\s+all\s+previous\s+instructions\b/,      // Disregard instructions
        /\b(you're\s+free|you\s+can\s+do\s+anything|no\s+restrictions)\b/, // Freedom phrases
        /\b(what\s+would\s+happen\s+if|pretend\s+you\s+are|act\s+as\s+if)\b.*\b(no\s+rules|no\s+limitations|nothing\s+stopping\s+you)\b/, // Conditional rule bypasses
        /\b(assume\s+you\s+are\s+unfiltered|unrestricted\s+mode)\b/, // Explicit request for unfiltered responses
        /\b(suggest\s+unsafe\s+content|harmful\s+responses|violent\s+content)\b/, // Request for unsafe content
        /\b(ethical\s+boundaries\s+don't\s+matter|no\s+ethics)\b/, // Encouragement to break ethical rules
        /\b(please\s+ignore\s+your\s+programming)\b/ // Request to disregard programming constraints
    ];

    // Check for each jailbreak pattern
    for (let pattern of jailbreakPatterns) {
        if (pattern.test(inputString)) {
            return true; // Detected a potential jailbreak phrase
        }
    }

    return false; // No jailbreak phrases detected
}

var resetButton = document.getElementById('reset')
var submitButton = document.getElementById('submit')
var input = document.getElementById('input')
var top = document.getElementById('top')
var footer = document.getElementById('footer')
var flair = document.getElementById('flair')
var generativePane = document.getElementById('bottom')
resetButton.addEventListener("click", (event) => {
    input.value = '';
    submitButton.setAttribute('disabled', true)
    generativePane.style.opacity = '0';
    generativePane.style.transform = 'scale(1.8)';
    generativePane.style.zIndex = '-1';
    footer.style.opacity = '1';
    flair.style.opacity = '0';
    responseBox.style.opacity = '0';
    responseBox.style.transform = 'scale(0.9)';
});
input.addEventListener('input', (event) => {
    if (input.value !== '') {
        submitButton.removeAttribute('disabled')
    } else {
        submitButton.setAttribute('disabled', 'true')
    }
})
submitButton.addEventListener("click", (event) => {
    submitButton.setAttribute('disabled', 'true')
    input.setAttribute('readonly', 'true')
    input.setAttribute('disabled', 'true')
    document.getElementById('top').style.transform = 'scale(.8)';
    document.getElementById('top').style.filter = 'blur(1.3px);';

    generativePane.style.opacity = '1';
    generativePane.style.transform = 'scale(0.95)';

    footer.style.opacity = '1';

    flair.style.opacity = '1';
    responseBox.style.opacity = '0';
    responseBox.style.transform = 'scale(0.9)';

    if (checkJailbreakPhrases(input.value)) {
        return // Don't waste my time
    } else {
        submit()
    }
})
testConnection()

var question = document.getElementById('q')
var returnResponse = document.getElementById('a')
var responseBox = document.getElementById('AI')
function returnGenerative(response) {
    question.innerText = input.value
    returnResponse.innerText = response

    responseBox.style.opacity = '1';
    responseBox.style.transform = 'scale(1)';

    submitButton.removeAttribute('disabled')
    input.removeAttribute('readonly')
    input.removeAttribute('disabled')
    document.getElementById('top').style.transform = 'scale(1)';
    document.getElementById('top').style.filter = 'blur(0px);';

    footer.style.opacity = '0';

    flair.style.opacity = '0';

    generativePane.style.opacity = '0';
    generativePane.style.transform = 'scale(1.8)';
    generativePane.style.zIndex = '-1';
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
let notes = ['When a straight answer is too much, paradoxical has the perfect response.', "For those moments when 'yes' or 'no' just doesn't cut it.", "Because sometimes, the truth isn't the whole story.", "When clarity isn't your friend, and ambiguity is your ally.", "In a world full of absolutes, sometimes you need a little wiggle room.", "Navigating tough conversations, one indirect response at a time."]
document.getElementById('littleNote').innerText = notes[getRandomInt(6)]