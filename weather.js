/* Pour recupérer la date courante ainsi les cinq prochaines heures à partir de l'heure courante */
function getDate() {
  let date = new Date();
  let current_date =
    date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
  let current_time = date.getHours();

  let current_times = [current_time + "H00"];
  if (current_time === 23) current_time = -1;

  for (let i = 1; i < 5; i++) current_times.push(current_time + i + "H00");

  return [current_date, current_times];
}

/* Recherche des données */
async function search() {
  const input = document.querySelector("input");
  const name = input.value;

  try {
    const response = await fetch(
      "https://prevision-meteo.ch/services/json/" + name
    );

    if (!response.ok) {
      throw new Error(`HTTP error : ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
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

/* Affichage des données */
async function display() {
  const data = await search();

  document.querySelector("#data").innerHTML =
    ""; /* Pour nettoyer le contenu avant l'affichage */

  if (!data || data["errors"]) {
    console.log("Erreur, aucune donnée");

    createElement(
      "data",
      "h2",
      "error",
      "Erreur, aucune donnée pour la ville spécifiée !"
    );
    return;
  }

  /* Pour l'affichage du pays */
  createElement("data", "h2", "", data["city_info"]["country"]);

  /* Pour l'affichage de la ville et la date : titre en h2 */
  createElement(
    "data",
    "h3",
    "",
    "Météo " +
      (data["city_info"]["name"] + " : " + data["current_condition"]["date"])
  );

  /* Pour l'affichage d'un sous-titre: lever du soleil, heure et jour, coucher du soleil */
  createElement("data", "div", "data_subtitle", null);

  createElement("data_subtitle", "section", "data_subtitle_head", null);
  createElement(
    "data_subtitle_head",
    "h5",
    "sunrise",
    "Lever du soleil -> " + data["city_info"]["sunrise"]
  );
  createElement(
    "data_subtitle_head",
    "h5",
    "hour",
    data["current_condition"]["hour"] + " " + data["fcst_day_0"]["day_long"]
  );
  createElement(
    "data_subtitle_head",
    "h5",
    "sunset",
    "Coucher du soleil -> " + data["city_info"]["sunset"]
  );

  createElement("data_subtitle", "section", "data_subtitle_content", null);

  createElement("data_subtitle_content", "div", "data_subtitle_content1", null);
  let icon_big = createElement(
    "data_subtitle_content1",
    "img",
    "icon_big",
    null
  );
  icon_big.src = data["current_condition"]["icon_big"];
  createElement(
    "data_subtitle_content1",
    "h6",
    "condition",
    data["current_condition"]["condition"]
  );

  createElement("data_subtitle_content", "div", "data_subtitle_content2", null);
  createElement(
    "data_subtitle_content2",
    "h1",
    "tmp",
    data["current_condition"]["tmp"] + "&deg"
  );
  createElement("data_subtitle_content2", "div", "water", null);
  createElement("data_subtitle_content2", "div", "himidity", null);
  createElement("himidity", "p", "himidity_title", "Humidité");
  createElement(
    "himidity",
    "p",
    "himidity_content",
    data["current_condition"]["humidity"] + "%"
  );
  createElement("data_subtitle_content2", "div", "pressure", null);
  createElement("pressure", "p", "pressure_title", "Pression");
  createElement(
    "pressure",
    "p",
    "pressure_content",
    data["current_condition"]["pressure"] + " hPa"
  );

  createElement("data", "div", "data_content", null);

  for (const d in data) {
    // console.log(d);
    if (
      d !== "city_info" &&
      d !== "forecast_info" &&
      d !== "current_condition"
    ) {
      let infos = data[d]; /* Recupération de toutes les infos de la météo */

      /* Création d'un élément div qui contiendra un titre ainsi qu'une liste des éléments */
      let div = createElement("data_content", "div", d, null);

      div.addEventListener("mouseover", function () {
        this.style.backgroundColor = "white";
      });

      div.addEventListener(
        "mouseout",
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

      /* Affichage des infos */
      for (const info in infos) {
        let element = infos[info];

        if (
          info !== "name" &&
          info !== "sunrise" &&
          info !== "sunset" &&
          info !== "country" &&
          element !== null &&
          info !== "day_short" &&
          info !== "condition_key"
        ) {
          if (info != "hourly_data") {
            if (info !== "icon" && info !== "icon_big") {
              if (info === "day_long") h3.innerHTML = element;
              else {
                let content = element;
                content +=
                  info === "tmin" ? "&deg" : info === "tmax" ? "&deg  /" : "";
                createElement(d, "li", info, content);
              }
            } else if (info === "icon") {
              let img = createElement(d, "img", info, null);
              img.src = element;
            }
          } else {
            const current_date = getDate();
            createElement(
              "data",
              "h3",
              d + "_" + info + "_title",
              "Détail par heure de la météo du : " + current_date[0]
            );

            createElement("data", "div", d + "_" + info, null);
            // console.log(element);

            /* Pour l'affichage du détail par heure */
            for (const hourly_data in element) {
              /* Affichage des données des cinq prochaines heures à partir de l'heure courante */
              // if(current_date[1].includes(hourly_data)) {
              console.log(hourly_data);

              createElement(
                d + "_" + info,
                "ul",
                d + "_" + info + hourly_data,
                null
              );

              createElement(
                d + "_" + info + hourly_data,
                "li",
                "hour" + "_data",
                hourly_data
              ); /* Affichage de l'heure */

              /* Affichage des autres infos */
              for (const hourly_data_info in element[hourly_data]) {
                if (
                  hourly_data_info === "ICON" ||
                  hourly_data_info === "CONDITION" ||
                  hourly_data_info === "TMP2m" ||
                  hourly_data_info === "HUMIDEX"
                ) {
                  // console.log(hourly_data_info);
                  if (hourly_data_info !== "ICON")
                    createElement(
                      d + "_" + info + hourly_data,
                      "li",
                      hourly_data_info,
                      element[hourly_data][hourly_data_info]
                    );
                  else if (hourly_data_info === "ICON") {
                    let img = createElement(
                      d + "_" + info + hourly_data,
                      "img",
                      hourly_data_info,
                      null
                    );
                    img.src = element[hourly_data][hourly_data_info];
                  }
                }
              }
              // }
            }
          }
        }
      }
    }
  }
  test(); /* Verification */
}

/* Pour l'activation du click sur les jours de météo ainsi le changement de couleur de fond selon actif ou non */
function test() {
  for (let i = 0; i < 5; i++) {
    const element = "#fcst_day_" + i;
    const div = document.querySelector(element);
    div.addEventListener("click", () => {
      {
        div.style.backgroundColor = "white";
        for (let j = 0; j < 5; j++) {
          const e = "#fcst_day_" + j;
          const div1 = document.querySelector(e);
          if (e !== element) div1.style.backgroundColor = "#6c91c5";
          else div1.style.backgroundColor = "white";

          div1.addEventListener(
            "mouseout",
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


/* Gestion du click */
function onClick() {
  const button = document.querySelector("#bouton");
  button.addEventListener("click", () => {
    display();
  });
}

onClick(); /* Lancement de la recherche */