# API <br> <span style="color:#888888">Единый реестр субъектов малого и среднего предпринимательства</span>

## Данные о субъекте <span style="color:#888888">(Старый формат)</span>

**Запрос**

    https://www.yourapp.ru/documents/inn

**Параметры запроса**  
inn — номер ИНН (12 или 10 цифр)

<br>

<details>
<summary><b>Ответ</b></summary>

```json
[
  {
    "fileId": "VO_RRMSPSV_0000_9965_20200711_3c59db72-ee38-478b-b11e-5d40d5f13dee",
    "id": "25dce203-146d-4531-9762-bd4b9e74311f",
    "createdAt": "2020-07-10T00:00:00.000Z",
    "publishedAt": "2019-04-10T00:00:00.000Z",
    "type": "2",
    "category": "1",
    "new": "1",
    "subjectType": "individual",
    "subjectName": "",
    "subjectShortName": "",
    "subjectInn": "123553122323",
    "subjectNameSurname": "ОТВЕТОВ",
    "subjectNameName": "ДЖЕЙСОН",
    "subjectNamePatronymic": "АПИШЕВИЧ",
    "addressRegionCode": "50",
    "addressRegionAddressType": "ОБЛАСТЬ",
    "addressRegionAddressName": "МОСКОВСКАЯ",
    "addressAreaAddressType": "",
    "addressAreaAddressName": "",
    "addressCityAddressType": "ГОРОД",
    "addressCityAddressName": "ДАТАБЕЙЗОВО",
    "addressLocalityAddressType": "",
    "addressLocalityAddressName": ""
  }
]
```

</details>

<details>
<summary><b>Ответ — пояснение</b></summary>

| Переменная                   | Тип    | Пояснение                                                                   |
| ---------------------------- | ------ | --------------------------------------------------------------------------- |
| `fileId`                     | string | файл в котором был элемент                                                  |
| `id`                         | string | поле "ИдДок" элемента                                                       |
| `createdAt`                  | Date   | поле "ДатаСост" элемента                                                    |
| `fileId`                     | string | файл в котором был элемент                                                  |
| `publishedAt`                | Date   | поле "ДатаВклМСП" элемента                                                  |
| `type`                       | string | поле "ВидСубМСП" элемента                                                   |
| `category`                   | string | поле "ВидСубМСП" элемента                                                   |
| `new`                        | string | поле "ПризНовМСП" элемента                                                  |
| `subjectType`                | string | organization или individual                                                 |
| `subjectName`                | string | поле "НаимОрг" элемента "ОргВклМСП"                                         |
| `subjectShortName`           | string | поле "НаимОргСокр" элемента "ОргВклМСП"                                     |
| `subjectInn`                 | string | поле "ИННЮЛ" или "ИННФЛ" элемента "ОргВклМСП" или "ИПВклМСП" соответственно |
| `subjectNameSurname`         | string | поле "Фамилия" элемента "ИПВклМСП"                                          |
| `subjectNameName`            | string | поле "Имя" элемента "ИПВклМСП"                                              |
| `subjectNamePatronymic`      | string | поле "Отчество" элемента "ИПВклМСП"                                         |
| `addressRegionCode`          | string | поле "КодРегион" элемента "СведМН"                                          |
| `addressRegionAddressType`   | string | поле "Тип" элемента "Регион"                                                |
| `addressRegionAddressName`   | string | поле "Наим" элемента "Регион"                                               |
| `addressAreaAddressType`     | string | поле "Тип" элемента "Район"                                                 |
| `addressAreaAddressName`     | string | поле "Наим" элемента "Район"                                                |
| `addressCityAddressType`     | string | поле "Тип" элемента "Город"                                                 |
| `addressCityAddressName`     | string | поле "Наим" элемента "Город"                                                |
| `addressLocalityAddressType` | string | поле "Тип" элемента "НаселПункт"                                            |
| `addressLocalityAddressName` | string | поле "Наим" элемента "НаселПункт"                                           |

</details>

<hr>

## Расширенные данные о субъекте <span style="color:#888888">(Новый формат)</span>

**Запрос**

    https://www.yourapp.ru/documents/inn,inn,inn

**Параметры запроса**  
inn — номер ИНН / номера ИНН через запятую (12 или 10 цифр)

<br>

<details>
<summary><b>Ответ</b></summary>

```json
[
  {
    "archive": {
      "archiveUrl": "http://file.nalog.ru/opendata/7707329152-rsmp/data-07102020-structure-15052020.zip",
      "archiveDate": "2020-07-10T00:00:00.000Z",
      "structureUrl": "https://data.nalog.ru/opendata/7707329152-rsmp/structure-15052020.xsd",
      "structureDate": "2020-05-15T00:00:00.000Z"
    },
    "file": {
      "fileId": "VO_RRMSPSV_0000_9965_20200711_edce9b82-03a5-45fc-a9ae-b0c625fbf1a5.xml"
    },
    "document": {
      "documentId": "9f2e856e-c4c2-47a0-a4ce-bfc49336370a",
      "createdAt": "2020-07-10T00:00:00.000Z",
      "includedAt": "2016-08-01T00:00:00.000Z",
      "type": 1,
      "category": 1,
      "isNew": true,
      "isSocial": true
    },
    "subject": {
      "isOrganisation": true,
      "organisation": {
        "name": {
          "fullName": "ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ \"Рога и копыта\"",
          "shortName": "ООО \"Рога и копыта\""
        }
      },
      "indivudial": {
        "name": {
          "fullName": null,
          "firstName": null,
          "middleName": null,
          "lastName": null
        }
      },
      "inn": "7716327610",
      "locations": [
        {
          "regionCode": "77",
          "fullAddress": "МОСКВА ГОРОД",
          "splittedAddress": {
            "region": { "type": "ГОРОД", "name": "МОСКВА" },
            "area": { "type": null, "name": null },
            "city": { "type": null, "name": null },
            "town": { "type": null, "name": null }
          }
        }
      ],
      "okved": {
        "main": [
          {
            "okved_code": "73.1",
            "okved_name": "Деятельность рекламная",
            "okved_group_description": null
          }
        ],
        "additional": [
          {
            "okved_code": "46.1",
            "okved_name": "Торговля оптовая за вознаграждение или на договорной основе",
            "okved_group_description": "Эта группировка включает:^- деятельность комиссионных агентов, товарных брокеров и прочих оптовых торговцев, которые торгуют от имени и за счет других лиц;^- деятельность лиц..."
          },
          {
            "okved_code": "60.10",
            "okved_name": "Деятельность в области радиовещания",
            "okved_group_description": "Эта группировка включает:^- производство готовых радиопрограмм (например, выпусков новостей, репортажей с места событий, рекламы на радио, образовательных программ, радиоспектаклей и т. п.) из фрагментов программ (например, звуковых сообщений, материалов, фонограмм и т. д.), права на использование..."
          }
        ]
      },
      "okpd2": [
        {
          "code": "46.39",
          "name": "Услуги по неспециализированной оптовой торговле пищевыми продуктами, напитками и табачными изделиями",
          "description": null
        },
        {
          "code": "47.21",
          "name": "Услуги по розничной торговле фруктами и овощами в специализированных магазинах",
          "description": null
        }
      ],
      "licence": [
        {
          "serial": null,
          "number": "ВХ-02 027260 Переоформ",
          "type": null,
          "releaseDate": "2018-10-03T00:00:00.000Z",
          "dateStart": "2018-10-03T00:00:00.000Z",
          "dateEnd": null,
          "releasedBy": null,
          "dateCancel": null,
          "cancelledBy": null,
          "licenceNames": [
            "Эксплуатация взрывопожароопасных и химически опасных производственных объектов I, II и III классов опасности"
          ]
        }
      ],
      "partnership": [
        {
          "customerName": "Программа партнерства между ООО «Рога и копыта» и субъектами малого и среднего предпринимательства",
          "customerInn": "7725666669",
          "contractNumber": "Уведомление о присоединении к программе РС-1546",
          "contractDate": "2018-03-21T00:00:00.000Z"
        }
      ],
      "contract": [
        {
          "customerName": "Межрегиональное Территориальное Управление Федерального Агенства по Управлению Государственным Имуществом в г. Санкт-Петербурге и Ленинградской области",
          "customerInn": "7838426520",
          "contractSubject": "Выполнение кадастровых работ в отношении земельных участков на территории Ленинградской области",
          "contractRegNumber": "1783842652018000090",
          "contractDate": "2018-08-22T00:00:00.000Z"
        }
      ],
      "agreement": [
        {
          "customerName": "АО \"Распеределительный Перевалочный Комплекс - Высоцк \"Лукойл-II\"",
          "customerInn": "4704056173",
          "agreementRegNumber": "54704056173180000940000",
          "agreementDate": "2018-10-31T00:00:00.000Z"
        }
      ]
    }
  }
]
```

</details>

<details>
<summary>Ответ — пояснение</summary>

| Переменная                   | Тип    | Пояснение                                                                   |
| ---------------------------- | ------ | --------------------------------------------------------------------------- |
| `fileId`                     | string | файл в котором был элемент                                                  |
| `id`                         | string | поле "ИдДок" элемента                                                       |
| `createdAt`                  | Date   | поле "ДатаСост" элемента                                                    |
| `fileId`                     | string | файл в котором был элемент                                                  |
| `publishedAt`                | Date   | поле "ДатаВклМСП" элемента                                                  |
| `type`                       | string | поле "ВидСубМСП" элемента                                                   |

</details>
