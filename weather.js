import { headElements } from './utils/data/Data.js';

/* Pour recupérer la date courante ainsi les cinq prochaines heures à partir de l'heure courante */
function getDate() {
  let date = new Date();
  let current_time = date.getHours();

  let current_times = [current_time + "H00"];
  if (current_time === 23) current_time = -1;

  for (let i = 1; i < 5; i++) current_times.push(current_time + i + "H00");

  return current_times;
}

/* Recherche des données */
async function search() {
  let input = document.querySelector("input");
  let name = (input.value).normalize("NFD").replace(/\p{Diacritic}/gu,""); /* Pour enlever les accents */

  try {
    const response = await fetch(
      "https://prevision-meteo.ch/services/json/" + name
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

/* Fonction permettant de créer une balise html */
function createElement(parent, element, id, content) {
  let e = document.createElement(element);
  e.id = id;
  e.innerHTML = content;
  document.querySelector("#" + parent).appendChild(e);

  return e;
}

/* Fonction permettant de créer une structure arborescente  */
function createStructure(elements) {
  /* Parcours du tableau de base contenant le nombre de structure d'arborescence à créer */
  for(const element in elements) {
    const values = elements[element];
    /* Parcours de chaque structure d'arborescence */
    for (const parent in values) {
      /* Parcours de tous elements de l'arborescence */
      for (const e in values[parent]) {
        /* Parcours de chaque element de l'arborescence */
        for (const el in (values[parent])[e]) {
          const id = (values[parent][e])[el][0];
          const content = (values[parent][e])[el][1];
          createElement(parent, el, id, content);   
        };
      }
    }
  }
}

/* Permet d'afficher la météo par heure */
function hourlyDisplay(element, info, parent) {
  for (const hourly_data in element) {
    /* Affichage des données des cinq prochaines heures à partir de l'heure courante */
    // if(current_date[1].includes(hourly_data)) {

    const ul = createElement(parent + "_" + info, "ul", parent + "_" + info + hourly_data,null);
    ul.style.backgroundColor = ( hourly_data === ((new Date()).getHours()) + 1 +'H00' ? 'white' : 'inherit');

    createElement(parent + "_" + info + hourly_data, "li", "hour" + "_data", hourly_data); /* Affichage de l'heure */

    /* Affichage des autres infos */
    for (const hourly_data_info in element[hourly_data]) {
      if (hourly_data_info === "ICON" || hourly_data_info === "CONDITION" ||
        hourly_data_info === "TMP2m" || hourly_data_info === "RH2m") 
      {
        if (hourly_data_info !== "ICON") {
          let li = createElement(parent + "_" + info + hourly_data, "li", hourly_data_info, element[hourly_data][hourly_data_info]);
          if(hourly_data_info === "RH2m") {
            li.id = parent+'_'+hourly_data_info+'_'+hourly_data;
            let icon = createElement(parent+'_'+hourly_data_info+'_'+hourly_data, "img", 'img_'+hourly_data_info, null);
            icon.src = 'images/humidite.png';
          }
          else if(hourly_data_info === "TMP2m") {
            li.id = parent+'_'+hourly_data_info+'_'+hourly_data;
            let icon = createElement(parent+'_'+hourly_data_info+'_'+hourly_data, "img", 'img_'+hourly_data_info, null);
            icon.src = 'images/celsius.png';
          }
        } else if (hourly_data_info === "ICON") {
          let img = createElement(parent + "_" + info + hourly_data,"img",hourly_data_info, null);
          img.src = element[hourly_data][hourly_data_info];
        }
      }
    }
    // }
  }
}

/* Permet d'afficher la météo globale de des 5jours */
function weatherDayDisplay(infos, parent, h3) {
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
        // const current_date = getDate();
        createElement("data","h3", parent + "_" + info + "_title", "Détail par heure de la météo du : " + infos['date']);

        createElement("data", "div", parent + "_" + info, null);

        /* Pour l'affichage du détail par heure */
        hourlyDisplay(element, info, parent);
      }
    }
  }
}

/* Permet d'afficher la météo de chaque jour en détail */
function weatherDisplay(data) {
  for (const d in data) {
    if ( d !== "city_info" && d !== "forecast_info" && d !== "current_condition" ) {
      let infos = data[d]; /* Recupération de toutes les infos de la météo */

      /* Création d'un élément div qui contiendra un titre ainsi qu'une liste des éléments */
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

      /* Création d'un élément h3 qui sera le titre des éléments : à enlever probablement */
      let h3 = createElement(d, "h3", "day_long", null);

      weatherDayDisplay(infos, d, h3); /* Affichage des infos */
    }
  }
}


/* Pour l'activation du click sur les jours de météo ainsi le changement de couleur de fond selon actif ou non */
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
async function dataDisplay() {
  const data = await search();

  document.querySelector("#data").innerHTML = ""; /* Pour nettoyer le contenu avant l'affichage */

  if (!data || data["errors"]) {
    createElement("data","h2","error","Erreur, aucune donnée pour la ville spécifiée !");
    return;
  }
  
  /* Création de l'entête pour l'affichage du pays, de la ville etc...  */
  createStructure(headElements(data));
  document.querySelector('#icon_big').src = data["current_condition"]["icon_big"]; 

  /* Affichage de la météo de chaque jour */
  weatherDisplay(data);
  
  /* Sert à faire la mise à jour de l'affichage de la météo en heure selon le jour selectionné */
  dayOnClick(); 
}


function mapper() {
  const infos = {
    lat: 51.505,
    lng: -0.09,
    zoomLevel: 13
  }
  
  const map = L.map('map').setView([infos.lat, infos.lng], infos.zoomLevel);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}


/* Gestion du click */
function onClick() {
  const button = document.querySelector("#bouton");
  button.addEventListener("click", () => {
    dataDisplay();
  });

  mapper();
}

onClick(); /* Lancement de la recherche */