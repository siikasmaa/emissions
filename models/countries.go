package models

import (
	"encoding/xml"
	"log"
)

// Root and Countries structs are needed for parsing Worldbank XML
type Root struct {
	XMLName xml.Name  `xml:"Root"`
	Root    Countries `xml:"data"`
}

type Countries struct {
	XMLName   xml.Name  `xml:"data"`
	Countries []Country `xml:"record"`
}

type Country struct {
	XMLName xml.Name `xml:"record" json:"-"`
	Fields  []struct {
		XMLName xml.Name `xml:"field" json:"-"`
		Name    string   `xml:"name,attr" json:"-"`
		Key     string   `xml:"key,attr" json:"-"`
		Value   string   `xml:",chardata" json:"-"`
	} `xml:"field" json:"-"`
	Name       string  `json:"name"`
	Key        string  `json:"country_key" gorm:"primary_key"`
	Year       int     `json:"year" gorm:"primary_key"`
	Population int     `json:"population" gorm:"type:bigint"`
	Emissions  float64 `json:"emissions"`
	PerCapita  float64 `json:"emissions_per_capita" gorm:"type:float"`
}

type CountryResult struct {
	Name string `json:"name"`
	Key  string `json:"country_key"`
}

func GetCountries() (result []*CountryResult) {
	err := GetDb().Table("countries").Select("name, key").Group("name, key").Scan(&result).Error
	if err != nil {
		log.Fatalln("Database: ", err)
		return nil
	}
	return result
}

func GetAllCountries() (countries []*Country) {
	err := GetDb().Find(&countries).Error
	if err != nil {
		log.Fatalln("Database: ", err)
		return nil
	}
	return countries
}

func GetCountry(key string) (countries []*Country) {
	err := GetDb().Where("key = ?", key).Order("year asc").Find(&countries).Error
	if err != nil {
		log.Fatalln("Database: ", err)
		return nil
	}
	return countries
}
