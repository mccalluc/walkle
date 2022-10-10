function getGeolocationPromise() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
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
