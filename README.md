# Emissions-api
_Web application for viewing the growth of CO<sub>2</sub>-emissions over the last few years._

## Contents
1. [Main objective](#main-objective)
2. [User stories](#user-stories)
3. [Data sources](#data-sources)
    1. [Population](#population)
    2. [CO<sub>2</sub>-emissions](#cosub2sub-emissions)
4. [Installation and running](#installation)
5. [API v1.0 reference](#api-v10-reference)

## Main objective
1. The application will for the most part be used on a laptop  and phone
2. The application should have an API
3. The data should always be up to date

## User stories
1. The application should be able to show CO<sub>2</sub>-emissions per capita
2. The application should be able to show the data on emissions on a adjustable time period
3. The application should have a feature for viewing side-by-side comparisons of countries in the order of their GDP

## Data sources
_Note:_ World bank offers the API with JSON, but according to the project specification, only CSV or XML should be used. The data is transferred in a ZIP-file which contains the data in a XML-file.

### Population:
[CSV](http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=csv)

[XML](http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=xml)

### CO<sub>2</sub>-emissions
[CSV](http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=csv)

[XML](http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=xml)

## Installation
You can run this project with Docker compose:
`docker-compose up -d --build`

# API v1.0 reference

All endpoints start with `/api/v1`.

## Table of contents

- [Version 1.0](#version-10)
  - [Emissions](#emissions)
    - [`/all` | GET](#all-get)
    - [`/countries` | GET](#countries-get)
    - [`/country/{key}` | GET](#countrykey-get)
    
    
## Emissions

### `/all` | GET
Fetch all data available. This will include emission data for each country and each available year.

The data will be presented in the following format:

```json
{"data":[
{"name":"Serbia","country_key":"SRB","year":1980,"population":0,"emissions":0},
{"name":"Serbia","country_key":"SRB","year":1981,"population":0,"emissions":0},
{"name":"Serbia","country_key":"SRB","year":1982,"population":0,"emissions":0},
...
]}
```

### `/countries` | GET
Fetch only the available countries with the name and key. 

Example:
```json
{"data":[
{"name":"Trinidad and Tobago","country_key":"TTO"},
{"name":"Antigua and Barbuda","country_key":"ATG"},
...
]}
```

### `/country/{key}` | GET
Fetch avilable emission data for a country with a matching key. The key has to be 3 letters long, upper or lower case.

Example:
```json
{"data":[
{"name":"Luxembourg","country_key":"LUX","year":1960,"population":313970,"emissions":11518.047},
{"name":"Luxembourg","country_key":"LUX","year":1961,"population":316845,"emissions":11591.387},
{"name":"Luxembourg","country_key":"LUX","year":1962,"population":320750,"emissions":11551.05},
...
]}
```

