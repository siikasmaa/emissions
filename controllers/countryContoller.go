package controllers

import (
	"github.com/gorilla/mux"
	"github.com/siikasmaa/emissions-api/models"
	"github.com/siikasmaa/emissions-api/utils"
	"net/http"
	"strings"
)

var GetAllCountries = func(w http.ResponseWriter, r *http.Request) {
	data := models.GetAllCountries()
	response := utils.Message(true, "success")
	if data == nil {
		response = utils.Message(false, "failure")
	}
	response["data"] = data
	utils.Respond(w, response)
}

var GetCountries = func(w http.ResponseWriter, r *http.Request) {
	data := models.GetCountries()
	response := utils.Message(true, "success")
	if data == nil {
		response = utils.Message(false, "failure")
	}
	response["data"] = data
	utils.Respond(w, response)
}

var GetCountry = func(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	data := models.GetCountry(strings.ToUpper(vars["key"]))
	response := utils.Message(true, "success")
	response["data"] = data
	utils.Respond(w, response)
}
