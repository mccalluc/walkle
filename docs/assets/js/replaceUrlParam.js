export default function(key, value) {
  const oldParamsObj = Object.fromEntries(
    new URLSearchParams(location.hash.slice(1))
  );
  const newParamsObj = {...oldParamsObj, [key]: value};
  const newParamsStr = new URLSearchParams(newParamsObj).toString();
  history.replaceState(null, '', `#${newParamsStr}`)
}