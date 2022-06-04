// List external dependencies here.
// - If we need to move to a different CDN, it's all in one place.
// - Individual files don't need to track the version we're using.
//
// Vue is an exception: We want a different version in development and production,
// and I'm not sure how to get that conditionality in here without breaking mocha,
// so it's still pulled in as global in the HTML.

export {default as md5} from 'https://cdn.skypack.dev/js-md5@0.7.3';
export {getDistance, getCompassDirection} from 'https://cdn.skypack.dev/geolib@3.3.3';

// TODO: Use optimized URLs
// TODO: Just download part of geolib.