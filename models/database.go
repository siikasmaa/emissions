package models

import (
	"fmt"
	"github.com/jinzhu/gorm"
	"log"
	"os"
)

var db *gorm.DB

const (
	dbhost  = "DBHOST"
	dbport  = "DBPORT"
	dbuser  = "DBUSER"
	dbpass  = "POSTGRES_PASSWORD"
	dbname  = "DBNAME"
	sslmode = "SSLMODE"
	dburl   = "DATABASE_URL"
)

func InitDb() {
	config := dbConfig()
	var err error
	var psqlInfo string

	if config[dburl] != "" {
		psqlInfo = config[dburl]
	} else {
		psqlInfo = fmt.Sprintf("host=%s port=%s user=%s "+
			"password=%s dbname=%s sslmode=disable",
			config[dbhost], config[dbport],
			config[dbuser], config[dbpass], config[dbname])
	}
	db, err = gorm.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	db.Debug().AutoMigrate(&Country{})
}

func dbConfig() map[string]string {
	conf := make(map[string]string)
	db, ok := os.LookupEnv(dburl)
	if !ok {
		host, ok := os.LookupEnv(dbhost)
		if !ok {
			panic("DBHOST environment variable required but not set")
		}
		port, ok := os.LookupEnv(dbport)
		if !ok {
			panic("DBPORT environment variable required but not set")
		}
		user, ok := os.LookupEnv(dbuser)
		if !ok {
			panic("DBUSER environment variable required but not set")
		}
		password, ok := os.LookupEnv(dbpass)
		if !ok {
			panic("POSTGRES_PASSWORD environment variable required but not set")
		}
		name, ok := os.LookupEnv(dbname)
		if !ok {
			panic("DBNAME environment variable required but not set")
		}
		ssl, ok := os.LookupEnv(sslmode)
		if !ok {
			log.Fatal("Environment variable SSLMODE not set, defaulting to disable")
			ssl = "disable"
		}
		conf[dbhost] = host
		conf[dbport] = port
		conf[dbuser] = user
		conf[dbpass] = password
		conf[dbname] = name
		conf[sslmode] = ssl
	}
	conf[dburl] = db
	return conf
}

func GetDb() *gorm.DB {
	return db
}
