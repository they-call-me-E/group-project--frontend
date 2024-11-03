import axios from "axios";
export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${accessToken}`
    );

    if (response.data.features && response.data.features.length > 0) {
      const [longitude, latitude] =
        response.data.features[0].geometry.coordinates;
      return { latitude, longitude };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
