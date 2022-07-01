function getGeolocationPromise() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {console.error(error)},
      {
        maximumAge: 0,
        enableHighAccuracy: true,
      }
    );
  })
}

export default async function getLatLong() {
  const {coords} = await getGeolocationPromise();
  return [coords.latitude, coords.longitude]
}
