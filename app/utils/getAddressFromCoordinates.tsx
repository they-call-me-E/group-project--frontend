export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
) => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error fetching address");
    }

    const data = await response.json();
    if (data.features.length > 0) {
      return data.features[0].place_name;
    } else {
      return "No address found";
    }
  } catch (error) {
    console.error("Error:", error);
    return "Error fetching address";
  }
};
