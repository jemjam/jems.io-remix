import PicoSanity from "picosanity";

import { config } from "./config";

// Standard client for fetching data
export const sanityClient = new PicoSanity(config);

// Authenticated client for fetching draft documents