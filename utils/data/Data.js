export function headElements(data) { 
  return [
    {'data': [
        {'h2': ["", data["city_info"]["country"]]},
        {'h3': ["title2", "Météo " +(data["city_info"]["name"] + " : " + data["current_condition"]["date"])]},
        {'div': ["data_subtitle", null]}, /* Pour l'affichage d'un sous-titre: lever du soleil, heure et jour, coucher du soleil */
        {"div": ["data_content", null]}
      ]
    },
    {'data_subtitle': [
        {'section': ["data_subtitle_head", null]},
        {'section': ["data_subtitle_content", null]}
      ]
    },
    {'data_subtitle_head': [
        {'h5': ["sunrise", "Lever du soleil -> " + data["city_info"]["sunrise"]]},
        {'h5': ["hour", data["current_condition"]["hour"] + " " + data["fcst_day_0"]["day_long"]]},
        {'h5': ["sunset", "Coucher du soleil -> " + data["city_info"]["sunset"]]}
      ]
    },
    {'data_subtitle_content': [
        {'div': ["data_subtitle_content1", null]},
        {'div': ["data_subtitle_content2", null]},
      ]
    },
    {'data_subtitle_content1': [
        {'img': ["icon_big", null]},
        {'h6': ["condition", data["current_condition"]["condition"]]},
      ]
    },
    {'data_subtitle_content2': [
        {'h1': ["tmp", data["current_condition"]["tmp"] + "&deg"]},
        {'div': ["water", null]},
        {'div': ["himidity", null]},
        {'div': ["pressure", null]},
      ]
    },
    {'himidity': [
        {'p': ["himidity_title", "Humidité"]},
        {'p': ["himidity_content", data["current_condition"]["humidity"] + "%"]}
      ]
    },
    {'pressure': [
        {'p': ["pressure_title", "Pression"]},
        {'p': ["pressure_content", data["current_condition"]["pressure"] + " hPa"]}
      ]
    }
  ];
}