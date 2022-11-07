import { headElements } from '../data/index.js';

/* Data search function depending on whether the request comes from an input or a click on the map */
async function search(isInput, value) {
  let input = document.querySelector('input');
  let name = '';
  if(isInput === true)
    name = (input.value).normalize("NFD").replace(/\p{Diacritic}/gu,""); /* To remove accents */
  else
    name = 'lat=' + value.lat + 'lng=' + value.lng;
  
  const url = "https://prevision-meteo.ch/services/json/" + name;
  try {
    const response = await fetch(
      url, {mode: 'cors'}
    );

    if (!response.ok) {
      throw new Error(`HTTP error : ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Could not get data: ${error}`);
  }
}

/* Function to create a tag in the DOM */
function createElement(parent, element, id, content) {
  let e = document.createElement(element);
  e.id = id;
  e.innerHTML = content;
  document.querySelector("#" + parent).appendChild(e);

  return e;
}

/* Function to create the tree structure for data display  */
function createStructure(elements) {
  for(const element in elements) { /* Browse the basic table containing the number of trees to create */
    const values = elements[element];
    for (const parent in values) { /* For each struct */
      for (const e in values[parent]) { /* Browse all elements of the tree structure */
        for (const el in (values[parent])[e]) { /* For each element of the tree structure */
          const id = (values[parent][e])[el][0];
          const content = (values[parent][e])[el][1];
          createElement(parent, el, id, content);   /* Create a tag */
        }
      }
    }
  }
}

/* Weather display function by hour */
function hourlyDisplay(current_hour, element, info, parent) {
  for (const hourly_data in element) {
    const ul = createElement(parent + "_" + info, "ul", parent + "_" + info + hourly_data, null);
    ul.style.backgroundColor = ( hourly_data === current_hour ? 'white' : '#6c91c5');

    createElement(parent + "_" + info + hourly_data, "li", "hour" + "_data", hourly_data); /* Display hour */

    /* Display of other information */
    for (const hourly_data_info in element[hourly_data]) {
      if (hourly_data_info === "ICON" || hourly_data_info === "CONDITION" ||
        hourly_data_info === "TMP2m" || hourly_data_info === "RH2m") 
      {
        if (hourly_data_info !== "ICON") {
          let li = createElement(parent + "_" + info + hourly_data, "li", hourly_data_info, null);

          if(hourly_data_info === "RH2m") {
            li.id = parent+'_'+hourly_data_info+'_'+hourly_data;
            let icon = createElement(parent+'_'+hourly_data_info+'_'+hourly_data, "img", 'img_'+hourly_data_info, null);
            icon.src = './utils/images/humidite.png';

            li.innerHTML +=  element[hourly_data][hourly_data_info] + '%';
          }
          else if(hourly_data_info === "TMP2m") {
            li.id = parent+'_'+hourly_data_info+'_'+hourly_data;
            let icon = createElement(parent+'_'+hourly_data_info+'_'+hourly_data, "img", 'img_'+hourly_data_info, null);
            icon.src = "./utils/images/celsius.png";

            li.innerHTML +=  element[hourly_data][hourly_data_info] + '&deg';
          }
          else {
            li.innerHTML +=  element[hourly_data][hourly_data_info];
          }
        } else if (hourly_data_info === "ICON") {
          let img = createElement(parent + "_" + info + hourly_data,"img",hourly_data_info, null);
          img.src = element[hourly_data][hourly_data_info];
        }
      }
    }
  }
  document.getElementById('data').scrollIntoView();
}

/* Function for displaying the weather by day */
function weatherDayDisplay(current_hour, infos, parent, h3) {
  for (const info in infos) {
    let element = infos[info];

    if (info !== "name" && info !== "sunrise" && info !== "sunset" &&
      info !== "country" && element !== null && info !== "day_short" && info !== "condition_key") 
    {
      if (info != "hourly_data") {
        if (info !== "icon" && info !== "icon_big") {
          if (info === "day_long") 
            h3.innerHTML = element;
          else 
            createElement(parent, "li", info, element + (info === "tmin" ? "&deg" : info === "tmax" ? "&deg  /" : ""));
        } else if (info === "icon") {
          let img = createElement(parent, "img", info, null);
          img.src = element;
        }
      } else {
        createElement("data","h1", parent + "_" + info + "_title", "Détail par heure de la météo du : " + infos['date']);

        createElement("data", "div", parent + "_" + info, null);

        hourlyDisplay(current_hour, element, info, parent); /* Display weather by hour */
      }
    }
  }
}

/* Permet d'afficher la météo de chaque jour en détail */
function weatherDisplay(data) {
  for (const d in data) {
    if ( d !== "city_info" && d !== "forecast_info" && d !== "current_condition" ) {
      let infos = data[d]; /* Recovery of all weather information */

      let div = createElement("data_content", "div", d, null);

      div.addEventListener("mouseover", function () {
        this.style.backgroundColor = "white";
      });

      div.addEventListener("mouseout",
        d !== "fcst_day_0"
          ? function () {
            this.style.backgroundColor = "#6c91c5";
          }
          : function () {
            this.style.backgroundColor = "white";
          }
      );

      let h3 = createElement(d, "h3", "day_long", null);

      let current_hour = (data["current_condition"]["hour"]).replace(':', 'H');
      current_hour = (current_hour.charAt(0) === '0' ? current_hour.substr(1) : current_hour);
      weatherDayDisplay(current_hour, infos, d, h3); /* Displaying the 'd' day news */
    }
  }
}


/* For the activation of the click on the days and the change of the background color according to the active day or not */
function dayOnClick() {
  for (let i = 0; i < 5; i++) {
    const element = "#fcst_day_" + i;
    const div = document.querySelector(element);
    div.addEventListener("click", () => {
      {
        div.style.backgroundColor = "white";
        for (let j = 0; j < 5; j++) {
          const e = "#fcst_day_" + j;
          const div1 = document.querySelector(e);
          if (e !== element) {
            div1.style.backgroundColor = "#6c91c5"
            const h3 = document.querySelector(e + '_hourly_data_title');
            h3.style.display = "none";
            const div2 = document.querySelector(e + '_hourly_data');
            div2.style.display = "none";
          }
          else {
            div1.style.backgroundColor = "white"
            const h3 = document.querySelector(e + '_hourly_data_title');
            h3.style.display = "flex";
            const div2 = document.querySelector(e + '_hourly_data');
            div2.style.display = "flex";
            document.querySelector(e + '_hourly_data').scrollIntoView();
          };

          div1.addEventListener("mouseout",
            e !== element
              ? function () {
                this.style.backgroundColor = "#6c91c5";
              }
              : function () {
                this.style.backgroundColor = "white";
              }
          );
        }
      }
    });
  }
}


/* Affichage des données */
export async function dataDisplay(isInput, val) {
  const data = await search(isInput, val);

  document.querySelector("#data").innerHTML = ""; /* Cleaning the content before displaying */

  if (!data || data["errors"]) {
    createElement("data","h2","error","Erreur, aucune donnée pour la ville spécifiée !");
    return;
  }
  
  if (data["current_condition"]["tmp"]) {
    /* Creation of the header to display the country, the city etc...  */
    createStructure(headElements(data));
    document.querySelector('#icon_big').src = data["current_condition"]["icon_big"]; 
  
    weatherDisplay(data); /* Weather display */
  
    dayOnClick(); /* To update the weather display in time according to the selected day */
  }
  else {
    createElement("data","h2","error","Desolé, données manquantes pour cette ville  !");
    return;
  }
}


/* For the management of click on map */
function onMapClick(element) {
  dataDisplay(false, element.latlng);
}

/* For the map display */
export function mapper() {
  const infos = {
    lat: 44.8378,
    lng: -0.594,
    zoomLevel: 12
  }
  
  const map = L.map('map').setView([infos.lat, infos.lng], infos.zoomLevel);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  map.on('click', onMapClick);
}

export function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}