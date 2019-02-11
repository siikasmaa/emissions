package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jasonlvhit/gocron"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/siikasmaa/emissions-api/controllers"
	"github.com/siikasmaa/emissions-api/models"
	"log"
	"net/http"
	"os"
)

func main() {
	// Fetch the initial data to the database

	router := mux.NewRouter()

	models.InitDb()
	defer models.GetDb().Close()

	port, ok := os.LookupEnv("PORT")

	if !ok {
		log.Printf("Environment variable PORT has not been defined, defaulting to 8000.\n")
		port = "8000"
	}

	apiRoute := router.PathPrefix("/api/v1").Subrouter()
	apiRoute.HandleFunc("/all", controllers.GetAllCountries).Methods("GET")
	apiRoute.HandleFunc("/countries", controllers.GetCountries).Methods("GET")
	apiRoute.HandleFunc("/country/{key:[A-Za-z]{3}}", controllers.GetCountry).Methods("GET")

	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./build/static/"))))
	router.HandleFunc("/", RootHandler)
	router.NotFoundHandler = http.HandlerFunc(NotFound)

	router.Use(logMiddleware)

	log.Printf("Running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

func RootHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	http.ServeFile(w, r, "./build/index.html")
}

func NotFound(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, "404: Resource not found.")
}

func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.Method, r.RequestURI)
		next.ServeHTTP(w, r)
	})
}
