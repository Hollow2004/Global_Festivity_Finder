k = `9f8l4wMPARfa9VcM8aqbN0N1849HiCRE`;

const userCountry = document.getElementById('country-input');
const userYear = document.getElementById('year-input');
const userMonth = document.getElementById('month-input');
const userDay = document.getElementById('day-input');

let today = new Date();
userYear.value = today.getFullYear();

const $cardContainer = $('#card-container');

let cardCount = 0;
let display = false;
let countryList = [];
let holidayList = [];

handleGetCountries();

$('#today-button').on('click', useToday);
$('#reset-button').on('click', clearHolidays);
$('form').on('submit', handleGetHolidays);

// API call for country list
function handleGetCountries() {
    $.ajax({
        url: `https://calendarific.com/api/v2/countries?&api_key=${k}`
    }).then(
        (data) => {
            countryList = data.response.countries;
            countryDropdown();
        },
        (error) => {
            console.log('bad request', error);
        }
    );
}

function countryDropdown() {
    let fragment = document.createDocumentFragment();
    countryList.forEach(country => {

        let opt = document.createElement('option');
        opt.innerHTML = country.country_name;
        opt.value = country['iso-3166'];
        opt.className = 'none';
        fragment.appendChild(opt);
    });
    userCountry.appendChild(fragment);
}

// API call for holidays
function handleGetHolidays(evt){
    evt.preventDefault();

    let leapYear = false;
    if ((0 == userYear.value % 4) && (0 != userYear.value % 100) || (0 == userYear.value % 400)){
        leapYear = true;
    }

    if (userCountry.value === 'Please Choose a Country') {
        alert('You must choose a country first!')
    }
    else if (!userYear.value) {
        alert('You must choose a year first!')
    } 
    else if (!leapYear && userMonth.value === '2' && userDay.value > 28) {
        alert('February ends on the 28th unless it is a leap year. Please choose a valid date.')
    } 
    else if (leapYear && userMonth.value === '2' && userDay.value>29) {
        alert(`The year ${userYear.value} is a Leap Year! February only gets one extra day though. Please choose a valid date.`)
    }
    else if (userDay.value === '31' && (userMonth.value === '4' || userMonth.value === '6' || userMonth.value === '9' || userMonth.value === '11')){
        alert(`The month in question does not have 31 days. Please choose a valid date.`)
    }
    else {
        $.ajax({
            url: `https://calendarific.com/api/v2/holidays?&api_key=${k}&country=${userCountry.value}&year=${userYear.value}&month=${userMonth.value}&day=${userDay.value}`
        }).then(
            (data) => {
                holidayList = data.response.holidays;
                if (holidayList === undefined) {
                    let countryName = nameFromIso(userCountry.value);
                    alert(`There is no data for ${countryName} during ${userYear.value}.  Please input another year.`)
                } else {
                renderHoliday();
                }
            },
            (error) => {
                console.log('bad request', error);
            }
        );
    }
}

function renderHoliday(){
    if (holidayList.length > 0) {
        holidayList.forEach(holiday => {
            createCard();

            let $cardDate = $(`#card-date-${cardCount}`);
            let $cardType = $(`#card-type-${cardCount}`);
            let $cardName = $(`#card-name-${cardCount}`);
            let $cardDesc = $(`#card-desc-${cardCount}`);

            $cardDate.text(holiday.date.iso.slice(0,10));
            $cardType.text(holiday.primary_type)
            $cardName.text(holiday.name);
            $cardDesc.text(holiday.description);
        });
    } else {
        createCard();

        let $cardDate = $(`#card-date-${cardCount}`);
        let $cardType = $(`#card-type-${cardCount}`);
        let $cardName = $(`#card-name-${cardCount}`);
        let $cardDesc = $(`#card-desc-${cardCount}`);

        let countryName = nameFromIso(userCountry.value);

        $cardDate.text(`${userYear.value}-${userMonth.value}-${userDay.value}`);
        $cardType.text(countryName)
        $cardName.text('None');
        $cardDesc.text(`Sadly, there is no official reason to celebrate in ${countryName} on the date in question :( \n We hope you still find many personal reasons to party!`);
    }
    display = true;
}

function createCard() {
    if (display) {
        removeCards();
    }

    cardCount++;
    let newCard = document.createElement('section');

    // Set the class to global-card for styling
    newCard.setAttribute('id', `card-${cardCount}`);
    newCard.classList.add('global-card');  // Add this line

    // Adjust the inner HTML structure
    newCard.innerHTML = `
        <span id='card-date-${cardCount}'></span><br><br>
        <span id='card-type-${cardCount}'></span>
        <h3 id='card-name-${cardCount}'>New Card</h3>
        <p id='card-desc-${cardCount}'>New Desc</p>
    `;

    $cardContainer.append(newCard);
}


function removeCards() {
    $cardContainer.empty();
    cardCount = 0;
    display = false;
}

function clearHolidays(evt) {
    evt.preventDefault();

    removeCards();
}

function nameFromIso(iso) {
    let countryName = countryList.find(country => country['iso-3166'] === iso)
    return countryName.country_name
}

function useToday(evt) {
    evt.preventDefault();
    userMonth.value = today.getMonth() + 1
    userDay.value = today.getDate()

    userMonth.classList.remove('first-choice');
}











const stateHolidays = {
    "MH": [
        { date: "2024-05-01", name: "Maharashtra Day", description: "Statehood Day of Maharashtra" },
        { date: "2024-09-10", name: "Ganesh Chaturthi", description: "Festival dedicated to Lord Ganesha" },
        { date: "2024-08-19", name: "Gopal Kala", description: "Celebration of Lord Krishna's childhood" }
    ],
    "KA": [
        { date: "2024-01-15", name: "Makara Sankranti", description: "Harvest festival celebrated in Karnataka" },
        { date: "2024-03-29", name: "Ugadi", description: "Kannada New Year" },
        { date: "2024-10-23", name: "Mysore Dasara", description: "State festival of Karnataka" },
        { date: "2024-11-01", name: "Karnataka Rajyotsava", description: "Formation Day of Karnataka" }
    ],
    "TN": [
        { date: "2024-01-14", name: "Pongal", description: "Harvest festival in Tamil Nadu" },
        { date: "2024-04-14", name: "Tamil New Year", description: "Tamil New Year's Day" },
        { date: "2024-04-18", name: "Puthandu", description: "Tamil New Year celebration" }
    ],
    "GJ": [
        { date: "2024-01-14", name: "Uttarayan", description: "Kite festival and harvest celebration" },
        { date: "2024-10-31", name: "Sardar Vallabhbhai Patel Jayanti", description: "Birthday of Sardar Patel" },
        { date: "2024-09-17", name: "Viswakarma Jayanti", description: "Festival for the god of architecture and engineering" }
    ],
    "WB": [
        { date: "2024-01-23", name: "Netaji Subhas Chandra Bose Jayanti", description: "Birth anniversary of Netaji Subhas Chandra Bose" },
        { date: "2024-04-15", name: "Poila Baisakh", description: "Bengali New Year" },
        { date: "2024-10-19", name: "Durga Puja", description: "Major festival in West Bengal" },
        { date: "2024-11-11", name: "Jagaddhatri Puja", description: "Festival dedicated to Goddess Jagaddhatri" }
    ],
    "RJ": [
        { date: "2024-03-21", name: "Rajasthan Day", description: "Celebration of the formation of Rajasthan" },
        { date: "2024-04-01", name: "Gangaur", description: "Festival dedicated to Goddess Gauri" },
        { date: "2024-11-06", name: "Mewar Festival", description: "Cultural festival celebrated in Udaipur" }
    ],
    "UP": [
        { date: "2024-03-25", name: "Ram Navami", description: "Celebration of Lord Rama's birth" },
        { date: "2024-11-04", name: "Chhath Puja", description: "Festival dedicated to the Sun God, celebrated in eastern UP" }
    ],
    "KL": [
        { date: "2024-04-14", name: "Vishu", description: "Malayalam New Year" },
        { date: "2024-08-28", name: "Onam", description: "Harvest festival of Kerala" },
        { date: "2024-09-08", name: "Thiruvonam", description: "Main festival day of Onam celebrations" }
    ],
    "AP": [
        { date: "2024-03-29", name: "Ugadi", description: "Telugu New Year" },
        { date: "2024-01-14", name: "Makar Sankranti", description: "Harvest festival" },
        { date: "2024-12-06", name: "Kanuma Panduga", description: "Festival celebrated the day after Makar Sankranti" }
    ],
    "MP": [
        { date: "2024-04-14", name: "Ambedkar Jayanti", description: "Dr. B.R. Ambedkar's Birthday" },
        { date: "2024-09-17", name: "Bhadrapada Amavasya", description: "Festival honoring the ancestors" }
    ],
    "PB": [
        { date: "2024-04-13", name: "Baisakhi", description: "Harvest festival in Punjab" },
        { date: "2024-01-13", name: "Lohri", description: "Punjabi winter folk festival" }
    ],
    "HR": [
        { date: "2024-10-12", name: "Haryana Day", description: "Formation Day of Haryana" },
        { date: "2024-11-01", name: "Gurgaddi Divas", description: "Commemoration of Guru Granth Sahib's first prakash" }
    ],
    "OR": [
        { date: "2024-04-01", name: "Utkala Dibasa", description: "Formation Day of Odisha" },
        { date: "2024-03-29", name: "Maha Vishuva Sankranti", description: "Odia New Year" },
        { date: "2024-07-12", name: "Rath Yatra", description: "Festival dedicated to Lord Jagannath" }
    ],
    "AS": [
        { date: "2024-04-14", name: "Bihu", description: "Assamese New Year and harvest festival" },
        { date: "2024-10-05", name: "Kati Bihu", description: "Harvest festival in Assam" }
    ],
    "JK": [
        { date: "2024-03-23", name: "Martyrs' Day", description: "In memory of the Kashmiri Pandit Martyrs" },
        { date: "2024-07-13", name: "Martyrs' Day", description: "Honoring the sacrifice of 1931 martyrs in J&K" }
    ],
    "HP": [
        { date: "2024-04-15", name: "Himachal Day", description: "Formation Day of Himachal Pradesh" },
        { date: "2024-06-21", name: "Shimla Summer Festival", description: "Cultural festival in Shimla" }
    ],
    "UK": [
        { date: "2024-11-09", name: "Uttarakhand Foundation Day", description: "Formation Day of Uttarakhand" },
        { date: "2024-04-14", name: "Phool Dei", description: "Harvest festival in Uttarakhand" }
    ],
    "CT": [
        { date: "2024-11-01", name: "Chhattisgarh Formation Day", description: "Formation Day of Chhattisgarh" },
        { date: "2024-03-29", name: "Hareli", description: "Festival of greenery and crops in Chhattisgarh" }
    ],
    "BR": [
        { date: "OCT-NOV", name: "Chhatt Puja", description: "Chhath Puja is among the beloved and most important festival of Bihar. The festival is held in honor of the sun god, who is regarded as the giver of light, warmth, and life. Chhath Puja is a four-day celebration that occurs in the month of October or November." },
        { date: "2024-01-14", name: "Makar Sankranti", description: "Each year in January, as the sun enters Capricorn, a celebration of Makar Sankranti (referred to as Tila Sankrant in Bihar) is held to honor the occasion. This famous festival of Bihar marks the beginning of the joyous Uttarayan season" },
        { date: "November", name: "Sonepur Cattle Fair", description: "One of the largest and most well-known fairs in the Indian state of Bihar is the Sonepur Cattle Fair, also known as the Harihar Kshetra Mela. During the month of November, the city of Sonepur hosts this mela on the banks of the River Gandak." }
    ],
    "GA": [
        { date: "2024-12-19", name: "Goa Liberation Day", description: "Goa Liberation Day is observed on December 19 every year in India and it marks the day Indian armed forces freed Goa in 1961 following 450 years of Portuguese rule. " },
    ]
    ,
    "JH": [
        { date: "Ashvin Month", name: "Jitiya", description: "Jitiya is a widely celebrated festival in Central-Eastern India and Nepal. However, while Jitiya is usually celebrated for three days in the month of Ashvin from the seventh day to the ninth, it is celebrated for eight days in Jharkhand and is a very important festival." },
        { date: "During Chaitra Purnima", name: "Sarhul", description: "Sarhul is a spring festival celebrated in the village of Sarna in Jharkhand. This festival is believed to be the marriage ceremony of the earth and the sun. Surukh, Khaman and several communities celebrate it in the belief that the Gods would protect them." },
        { date: "kartik maas After Diwali", name: "Sohrai", description: "Sohrai is a regional festival widely celebrated in central India. It is a cattle festival celebrated by many tribes, including the Santals, Sadans, Kudmi and Oroans. It is celebrated on the Amavasya after Diwali in the Kartika masa" }
    ],
    "TR": [
        { date: "Jnauary", name: "Tirthamukh Mela", description: "On the occasion of the Uttarayan Sankranti, both tribal and non-tribal people assemble to take a holy dip in the river Gomati at its origination place, known as Tirthamukh. The devotees take the holy dip on the day which marks the Sun’s northern course’s commencement- the last day of the month of Pousa (middle of the month, January)." },
        { date: "August and December", name: "NeerMhal Water Festival", description: "Neermahal water festival is celebrated at Neermahal, Rudrasagar Lake in Tripura every year. The festival is celebrated for 3 days, and event plays and cultural programmes are organized during the evenings. The boat race in the Rudrasagar lake is a big attraction of the water festival. Apart from the boat race, a swimming competition is also organized at the festival." },
        { date: "7th day of the Month of Baisakh", name: "Garia Puja", description: "Garia Puja is one of the main festivals of Tripura. Lord Garia, the deity of livestock and wealth, is worshipped with flowers and garland in this festival. The Garia Puja is conducted with these ingredients: cotton thread, rice, fowl chick, rice beer, wine, earthen pots, eggs, and wine" }
    ],
    "TL": [
        { date: "Sep-Oct", name: "Bathukamma Festival", description: "Telangana Bathukamma festival is celebrated during half monsoon before the onset of winter. Usually in September/October monsoon rains comes with plenty of water in lakes and rivers in Telangana. This is also a perfect time for flowers to bloom in different exotic colors." },
        { date: "", name: " Sammakka Saralamma Jathara (Medaram)", description: "The main reason to celebrate this Jathara is about honoring the Goddess of Sammakka and Saralamma who were the mother and daughter who died during an epic fight" },
        { date: "2024-07-12", name: "Rath Yatra", description: "Festival dedicated to Lord Jagannath" }
    ],
    "NL": [
        { date: "February Annually", name: "Sekrenyi Festival", description: "Women start weaving handwoven shawls for their men, which they wear during the purification rituals." },
        { date: "First week of April", name: "Aoleng Festival", description: " The Konyak people are tattooed men who are famous for their headhunting practices." },
        { date: " End of July", name: "Naknyulem Festival", description: "People invoke god blessings from their special rituals." }
    ]


};

$('#state-form').on('submit', handleGetStateHolidays);
$('#state-form #reset-button').on('click', clearStateHolidays);

function handleGetStateHolidays(evt) {
    evt.preventDefault();
    const state = $('#state-input').val();

    if (state === "") {
        alert('You must choose a state first!');
    } else {
        const holidays = stateHolidays[state] || [];
        renderStateHolidays(holidays);
    }
}

function renderStateHolidays(holidays) {
    const $stateCardContainer = $('#state-card-container');
    $stateCardContainer.empty();

    if (holidays.length > 0) {
        holidays.forEach((holiday) => {
            const cardHTML = `
                <section class="state-card">
                    <span>${holiday.date}</span><br><br>
                    <h3>${holiday.name}</h3>
                    <h4>${holiday.description}</h4>
                </section>`;
            $stateCardContainer.append(cardHTML);
        });
    } else {
        $stateCardContainer.html('<p>No holidays available for this state.</p>');
    }
}

function clearStateHolidays(evt) {
    evt.preventDefault();
    $('#state-card-container').empty();
}