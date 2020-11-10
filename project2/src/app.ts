import axios from "axios";
import {Loader, LoaderOptions} from 'google-maps';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const options: LoaderOptions = {};
const loader = new Loader(GOOGLE_API_KEY, options);

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;


type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then(async (response) => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      const google = await loader.load();
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 16,
      });

      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);