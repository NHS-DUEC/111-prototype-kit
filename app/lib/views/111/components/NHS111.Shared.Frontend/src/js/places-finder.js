/* eslint-disable no-undef */
import accessibleAutocomplete from "accessible-autocomplete";

import { logClick, logEvent } from "./modules/utils/event-logging";

let locationInfoWindow;
let placeInfoWindow;
let placeWindowContent;
let geocoder;
let marker;
let mapContainer;
let map;
const geoInfo = {};
let markers = [];
let bindMapEvents;
let sessionToken;

const autoCompleteElem = document.querySelector("#places-lookup-results");
const locationContainer = document.querySelector("[data-module-places]");
const currentPostCodeInput = document.getElementById("CurrentPostcode");
const searchInputId = "places-lookup";

const setShortAddressName = (place) => {
  const shortAddress = place.address_components
    .slice(0, 3)
    .map((component) => (component && component.short_name) || "")
    .join(", ");

  return shortAddress;
};

const setMapOnAll = (gmarkers, gmap) => {
  gmarkers.forEach((gmarker) => {
    gmarker.setMap(gmap);
  });
};

const removeMapPlaces = () => {
  setMapOnAll(markers, null);
  markers = [];
  markers.push(marker);
  locationInfoWindow.close();
  placeInfoWindow.close();
  marker.setVisible(false);
};

const displayMapPlace = () => {
  map.fitBounds(geoInfo.place.geometry.viewport);
  marker.setPosition(geoInfo.place.geometry.location);
  marker.setVisible(true);
  map.setCenter(geoInfo.latlng);

  // Update the custom card content with place information
  placeWindowContent.children.placeName.textContent = geoInfo.placeName
    ? geoInfo.placeName
    : "Location found:";

  placeWindowContent.children.placeAddress.textContent = setShortAddressName(
    geoInfo.place
  );

  placeInfoWindow.open({
    anchor: marker,
    map,
    shouldFocus: false,
  });
};

const setPlaceOnMap = () => {
  placeInfoWindow.setContent(placeWindowContent);
  mapContainer.removeAttribute("hidden");
  map.setZoom(14);
  marker = new google.maps.Marker({
    position: geoInfo.latlng,
    map,
  });

  removeMapPlaces();
  displayMapPlace();
  bindMapEvents();
};

const getAddressWithPostcode = (places) => {
  return places.find(
    (e) => e.types.find((x) => x === "postal_code") && e.types.length === 1
  );
};

const setGeoInformation = () => {
  geoInfo.addresses = geoInfo.place.address_components;
  geoInfo.latlng = {
    lat: geoInfo.place.geometry.location.lat(),
    lng: geoInfo.place.geometry.location.lng(),
  };
};

const setNearestPostCode = () => {
  const nearestPostCodeElem = document.getElementById("postalCode");
  const postalCode = geoInfo.addresses.find((address) =>
    address.types.some((type) => type === "postal_code")
  );
  if (postalCode) {
    nearestPostCodeElem.innerHTML = `Nearest postcode is ${postalCode.long_name}`;
    nearestPostCodeElem.removeAttribute("hidden");
    currentPostCodeInput.value = postalCode.long_name;
  } else {
    nearestPostCodeElem.innerHTML = `No postcode found, please choose another location`;
    currentPostCodeInput.value = "";
  }
  delete geoInfo.placeName;
};

const noPostcodeReturned = () => {
  geoInfo.addresses = [];
  removeMapPlaces();
  setNearestPostCode();
};

const geoLocateHandler = (response) => {
  if (response.results) {
    geoInfo.place = getAddressWithPostcode(response.results);
    if (geoInfo.place) {
      setGeoInformation();
      setPlaceOnMap();
      setNearestPostCode();
    } else {
      noPostcodeReturned();
    }
  }
};

const getGeoLocation = (params) => {
  geocoder
    .geocode(params)
    .then((response) => geoLocateHandler(response))
    .catch((e) => logEvent(`Geocoder failed due to: ${  e}`));
};

const currentPositionHandler = (position) => {
  geoInfo.locationEnabled = true;
  const locationErrorElem =
    locationContainer.querySelector(".js-location-error");
  if (locationErrorElem) {
    locationErrorElem.remove();
  }
  geoInfo.latlng = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
  getGeoLocation({ location: geoInfo.latlng });
};

const clearErrorsOnClick = () => {
  const locationError = document.querySelector(".js-location-error");
  if (locationError) locationError.remove();
};

const handlePositionError = (error) => {
  geoInfo.locationEnabled = false;

  // Only show the error output if user has clicked use my location link - not onload
  if (geoInfo.isLocationClick) {
    const positionError = document.createElement("template");
    positionError.innerHTML = `
      <span class="nhsuk-error-message js-location-error" role="alert">
        Check your browser or device settings to share your location.
      </span>
    `;

    logEvent("Error", error.message);
    if (!locationContainer.querySelector(".js-location-error")) {
      mapContainer.before(positionError.content);
    }
  }
};

const getPositionByLatLng = (event) => {
  geoInfo.isLocationClick = typeof event !== "undefined";
  navigator.geolocation.getCurrentPosition(
    currentPositionHandler,
    handlePositionError,
    { timeout: 30000 }
  );
};

const checkCurrentLocation = () => {
  const currentPostcode = currentPostCodeInput.value;
  if (currentPostcode !== "") {
    getGeoLocation({ address: currentPostcode });
  } else {
    getPositionByLatLng();
  }
};

const displayFindLocationLink = () => {
  if (navigator.geolocation) {
    const locationLink = locationContainer.querySelector(".js-find-location");
    locationLink.style.display = "inline-block";
    locationLink.addEventListener("click", getPositionByLatLng);
  }
};

const appendPostcodeFeedback = () => {
  const postcodeFeedback = document.createElement("template");
  postcodeFeedback.innerHTML = `
    <div role="region" id="postcodeFeedback" aria-live="polite">
      <p class="instruction" id="postalCode" hidden></p>
    </div>
  `;
  mapContainer.after(postcodeFeedback.content);
};

const appendAddressResultCard = () => {
  const addressResultCard = document.createElement("template");
  addressResultCard.innerHTML = `
    <div class="pac-card" id="pacCard" hidden>
      <div id="infoWindowContent">
        <strong id="placeName" class="title"></strong><br />
        <span id="placeAddress"></span>
      </div>
    </div>
  `;
  locationContainer.append(addressResultCard.content);
  placeWindowContent = document.getElementById("infoWindowContent");
};

const setupGoogleMap = () => {
  mapContainer = document.getElementById("map");
  map = new google.maps.Map(mapContainer, {
    zoom: 14,
    disableDefaultUI: true,
    zoomControl: true,
    panControl: true,
  });
  locationInfoWindow = new google.maps.InfoWindow();
  placeInfoWindow = new google.maps.InfoWindow();
  geocoder = new google.maps.Geocoder();
  appendPostcodeFeedback();
  appendAddressResultCard();
};

const getPlacePredictions = (serviceOptions, canceller) => {
  const acService = new google.maps.places.AutocompleteService();

  return new Promise((resolve, reject) => {
    canceller.cancel = () => {
      reject(new Error("debounce"));
    };
    acService.getPlacePredictions(serviceOptions).then(resolve);
  });
};

const findPlacesCanceller = {};

const findPlaces = async ({ query, populateResults }) => {
  if (typeof findPlacesCanceller.cancel === "function") {
    findPlacesCanceller.cancel();
  }

  const serviceOptions = {
    input: query,
    sessionToken,
    componentRestrictions: { country: "gb" },
    types: ["geocode", "establishment"],
    strictBounds: false,
  };

  try {
    const placesData = await getPlacePredictions(
      serviceOptions,
      findPlacesCanceller
    );
    populateResults(placesData.predictions);
  } catch (error) {
    if (error.message !== "debounce") {
      console.error(error);
    }
  }
};

const processPlace = (place, status) => {
  if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;
  geoInfo.placeName = place.name;
  geoInfo.latlng = {
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
  };
  getGeoLocation({ location: geoInfo.latlng });
};

const getPlaceInformation = (value) => {
  const placeId = value;
  if (value) {
    const placeService = new google.maps.places.PlacesService(map);
    const request = {
      placeId,
      fields: ["address_components", "geometry", "icon", "name"],
      sessionToken,
    };
    placeService.getDetails(request, processPlace);
  }
};

const setPlaceFromMapClick = (event) => {
  sessionToken = new google.maps.places.AutocompleteSessionToken();
  if (event.placeId) {
    event.stop();
    getPlaceInformation(event.placeId);
  } else {
    geoInfo.latlng = event.latLng;
    getGeoLocation({ location: geoInfo.latlng });
  }
};

bindMapEvents = () => {
  map.addListener("click", setPlaceFromMapClick);
};

const inputTemplate = (value) => {
  return value && value.description;
};

const suggestionTemplate = (value) => {
  return `${value.description}`;
};

const renderTemplate = {
  inputValue: inputTemplate,
  suggestion: suggestionTemplate,
};

const setupAutoComplete = () => {
  if (!autoCompleteElem) return;
  sessionToken = new google.maps.places.AutocompleteSessionToken();

  accessibleAutocomplete({
    element: autoCompleteElem,
    id: searchInputId,
    cssNamespace: "app-autocomplete",
    source: (query, populateResults) => {
      return findPlaces({
        query,
        populateResults,
      });
    },
    templates: renderTemplate,
    onConfirm: (value) => {
      if (value && value.place_id) {
        getPlaceInformation(value.place_id);
      }
      if (value != null) {
        logClick("AutoComplete");
      }
    },
  });
  document
    .getElementById(searchInputId)
    .addEventListener("click", clearErrorsOnClick);
};

const placesFinder = () => {
  if (locationContainer) {
    displayFindLocationLink();
    setupGoogleMap();
    checkCurrentLocation();
    setupAutoComplete();
  }
};

// Callback used once google places libary has loaded
window.placesFinderInit = () => {
  if (typeof window.google.maps === "undefined") return;

  placesFinder();
};
