const addressStringToLatLongCache = {};

export async function addressStringToLatLong(
  GoogleMapsGeocoder,
  addressString
) {
  return new Promise((resolve, reject) => {
    if (addressString in addressStringToLatLongCache) {
      resolve(addressStringToLatLongCache[addressString]);
    } else {
      const geocoder = new GoogleMapsGeocoder();
      geocoder.geocode(
        { address: addressString, componentRestrictions: { country: "GB" } },
        (data) => {
          addressStringToLatLongCache[addressString] =
            data[0].geometry.location;
          resolve(addressStringToLatLongCache[addressString]);
        }
      );
    }
  });
}
