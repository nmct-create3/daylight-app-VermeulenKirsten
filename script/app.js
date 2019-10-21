const apiKey = 'ea156de444f2be588e9f71454df6c104';

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie

const updateSun = function(percVoorbij) {
  console.log(percVoorbij);

  document.querySelector('.js-sun').setAttribute('style', `bottom: 100%; left: ${percVoorbij}%;`);
};

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.

  domSun = document.querySelector('.js-sun');
  domResterendeMinuten = document.querySelector('.js-time-left');

  // Bepaal het aantal minuten dat de zon al op is.

  aantalMinutenOpgang = (Date.now() / 1000 - sunrise) / 60;

  aantalResterendeMinuten = totalMinutes / 60 - aantalMinutenOpgang;

  // Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.

  let percVoorbij = (aantalMinutenOpgang / (totalMinutes / 60)) * 100;

  updateSun(percVoorbij);

  // We voegen ook de 'is-loaded' class toe aan de body-tag.

  document.querySelector('body').classList.add('is-loaded');

  // Vergeet niet om het resterende aantal minuten in te vullen.

  domResterendeMinuten.innerHTML = Math.round(aantalResterendeMinuten);

  // Nu maken we een functie die de zon elke minuut zal updaten

  setInterval(function() {
    getAPI(50.8027841, 3.2097454);
  }, 60000);

  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
  // We gaan eerst een paar onderdelen opvullen
  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.

  console.log(queryResponse);

  document.querySelector('.js-location').innerHTML = `${queryResponse.city['name']}, ${queryResponse.city['country']}`;

  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.

  document.querySelector('.js-sunrise').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city['sunrise']);

  document.querySelector('.js-sunset').innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city['sunset']);

  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.

  let periodBetween = queryResponse.city['sunset'] - queryResponse.city['sunrise'];

  placeSunAndStartMoving(periodBetween, queryResponse.city['sunrise']);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
  let customheaders = new Headers();
  customheaders.append('accept', 'application/json');
  let serverEndPoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=nl&cnt=1`;
  const response = await fetch(serverEndPoint, { headers: customheaders });
  const data = await response.json();
  showResult(data);
};

document.addEventListener('DOMContentLoaded', function() {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
});
