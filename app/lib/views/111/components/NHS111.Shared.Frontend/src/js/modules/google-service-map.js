import { Loader } from "@googlemaps/js-api-loader";

import { addressStringToLatLong } from "./utils/geocoding-utils";

class GoogleServiceMap {
  constructor(el) {
    this.el = el;

    this.mapApiKey = this.el.dataset.googleMap;
    this.currentLocation = this.el.dataset.googleMapCurrentLocation;
    this.destinationName = this.el.dataset.googleMapDestinationName;
    this.destinationAddress = this.el.dataset.googleMapDestinationAddress;
    this.destinationFullAddress =
      `${this.destinationName  },${  this.destinationAddress}`;
    this.mapContainer = null;
  }

  cancelFallbackImage() {
    // Base no-JS fallback image is loading="lazy" and fetchpriority="low"
    // This should cancel the image and prevent it from ever loading, since we obviously have JS
    // Not a guarantee - it may already have loaded on a fast connection.
    this.el.src = "";
  }

  setupContainer() {
    this.mapContainer = document.createElement("div");
    this.mapContainer.classList.add("app-service-details__map__gmap");
    this.el.after(this.mapContainer);
    this.el.remove();
  }

  loadGoogleMaps() {
    const loader = new Loader({
      apiKey: this.mapApiKey,
      version: "weekly",
    });

    return loader.load();
  }

  async getBounds() {
    const bounds = new google.maps.LatLngBounds();

    bounds.extend(
      await addressStringToLatLong(
        google.maps.Geocoder,
        this.destinationFullAddress
      )
    );
    bounds.extend(
      await addressStringToLatLong(google.maps.Geocoder, this.currentLocation)
    );

    return new Promise((resolve, reject) => {
      resolve(bounds);
    });
  }

  async addServiceMarker() {
    const location = await addressStringToLatLong(
      google.maps.Geocoder,
      this.destinationFullAddress
    );

    const marker = new google.maps.Marker({
      position: location,
      label: "",
      map: this.map,
      optimized: false,
    });

    const info = new google.maps.InfoWindow({
      content: `<p class="nhsuk-heading-xs nhsuk-u-margin-bottom-0">${this.destinationName}</p>
      <a class="nhsuk-link" target="_blank" href="https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation}&destination=${this.destinationAddress}">View on google maps</a>`,
    });

    marker.addListener("click", () => {
      info.open({
        anchor: marker,
        map: this.map,
        shouldFocus: false,
      });
    });
  }

  async addCurrentLocationMarker() {
    const location = await addressStringToLatLong(
      google.maps.Geocoder,
      this.currentLocation
    );

    const marker = new google.maps.Marker({
      position: location,
      label: "",
      map: this.map,
      optimized: false,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: "#005eb8",
        fillOpacity: 1,
        strokeWeight: 0,
      },
    });

    const info = new google.maps.InfoWindow({
      content: `<p class="nhsuk-u-font-size-16 nhsuk-u-margin-bottom-0">${this.currentLocation.toUpperCase()}</p>`,
    });

    marker.addListener("click", () => {
      info.open(this.map, marker);
    });

    info.open({
      anchor: marker,
      map: this.map,
      shouldFocus: false,
    });
  }

  async renderMap(center) {
    const { Map } = await google.maps.importLibrary("maps");

    this.map = new Map(this.mapContainer, {
      center,
      zoom: 12,
    });
  }

  zoomMap(bounds) {
    this.map.fitBounds(bounds, 100);
  }

  async init() {
    this.cancelFallbackImage();
    this.setupContainer();

    await this.loadGoogleMaps(); // As soon as you load this library, it magically makes a global google object available

    const bounds = await this.getBounds();

    await this.renderMap(bounds.getCenter());
    this.zoomMap(bounds);

    await this.addServiceMarker();
    await this.addCurrentLocationMarker();
  }
}

export default () => {
  const mapElements = Array.from(
    document.querySelectorAll("[data-google-map]")
  );
  mapElements.forEach((el) => {
    new GoogleServiceMap(el).init();
  });
};
