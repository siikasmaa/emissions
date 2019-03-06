package main

import (
	"archive/zip"
	"encoding/xml"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/siikasmaa/emissions-api/models"
	"github.com/siikasmaa/emissions-api/utils"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"time"
)

func update() {
	start := time.Now() //Measuring purposes
	models.InitDb()

	sources := [2]string{"http://api.worldbank.org/v2/en/indicator/EN.ATM.CO2E.KT?downloadformat=xml", "http://api.worldbank.org/v2/en/indicator/SP.POP.TOTL?downloadformat=xml"}
	for _, source := range sources {
		file, err := utils.DownloadFile("data.zip", source)
		if err != nil {
			log.Fatal("Could not fetch World Bank data, ", err)
			break
		}

		r, err := zip.OpenReader(file.Name())
		if err != nil {
			log.Fatal("Could not fetch World Bank data, ", err)
			break
		}
		defer r.Close()

		// Iterate through the files in the archive
		for _, f := range r.File {
			log.Printf("Updating %s\n", f.Name)
			xmlFile, err := f.Open()

			if err != nil {
				log.Fatal(err)
				break
			}

			defer xmlFile.Close()

			byteValue, _ := ioutil.ReadAll(xmlFile)
			var root models.Root

			xml.Unmarshal(byteValue, &root)

			var country models.Country
			var population int
			var emissions float64
			var year int
			var perCapita float64

			for i := 0; i < len(root.Root.Countries); i++ {
				year, _ = strconv.Atoi(root.Root.Countries[i].Fields[2].Value)
				switch root.Root.Countries[i].Fields[1].Key {
				case "SP.POP.TOTL":
					population, _ = strconv.Atoi(root.Root.Countries[i].Fields[3].Value)
				case "EN.ATM.CO2E.KT":
					emissions, _ = strconv.ParseFloat(root.Root.Countries[i].Fields[3].Value, 64)
				}
				if population > 0 && emissions > 0 {
					perCapita = emissions / float64(population)
				}

				country = models.Country{
					Name:       root.Root.Countries[i].Fields[0].Value,
					Key:        root.Root.Countries[i].Fields[0].Key,
					Year:       year,
					Population: population,
					Emissions:  emissions,
					PerCapita:  perCapita,
				}

				models.GetDb().Where(models.Country{Key: country.Key, Year: country.Year}).Assign(models.Country{Population: country.Population, Emissions: country.Emissions, PerCapita: country.PerCapita}).FirstOrCreate(&country)
			}
		}
		defer os.Remove(file.Name())
		elapsed := time.Since(start)         //Measuring purposes
		log.Println("Update took ", elapsed) //Measuring purposes
	}

}
