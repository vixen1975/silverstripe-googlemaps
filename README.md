# Silverstripe Googlemaps
Adds a map module that allows users to integrate with the Google Maps API.

You will need to create an API Key for the Google Maps Javascript API and enter it into the config/config.yml

You can select from one of four predefined map styles, however this can be easily replaced by visiting https://snazzymaps.com/ and selecting/defining a new map style yourself.

When adding a Map Page you need to set the starting Latitude, Longitude and Zoom of the map. (see https://support.google.com/maps/answer/18539?co=GENIE.Platform%3DDesktop&hl=en for how to get the lat/long of a location). You can also upload a marker image for the places on your map.

Markers are added as DataObjects and can contain a title, content, image for the Infobox on the map.

#Requirements
Silverstripe 3.3
