function getGeolocationPromise() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(resolve);
  })
}

export default async function getLatLong() {
  const {coords} = await getGeolocationPromise();
  return [coords.latitude, coords.longitude]
}
