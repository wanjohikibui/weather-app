# weather-app
This is a web portal developed using GeoExt, ExtJS and OpenLayers to manage data from different weather stations in the country. This is a sample application to show the aspects in which one can implement a web-mapping application using ExtJS and GeoExt and having the OpenLayers API.

#Installation on local machine

Clone or download this repo on your local machine

Download the ExtJS library files from the Sencha Website, Version 4.2.1, http://cdn.sencha.com/ext/gpl/ext-4.2.1-gpl.zip .<br>
Uncompress and Rename the folder to extjs and move it to the weather-app directory.
Get the GeoExt library files from https://github.com/geoext/geoext2/releases/tag/v2.1.0 and unzip it. Rename to Geoext and move directory to weather-app directory.<br>
Download the OpenLayers library from http://openlayers.org/two/ , uncompress it and rename to OpenLayers. Move the directory to weather-app.<br>
Download the Silk Icons from http://famfamfam.com/lab/icons/silk/ and unzip to icons folder in the apps directory.<br>
Run the index.html file on browser

#Using Online Sources for libraries
To use online resources for the different libraries, ensure the index files has links just like in this file <br>

```
<!DOCTYPE html>
<html>
    <head>
        <title>Weather Map</title>
        <!-- Load the ExtJS stylesheet -->
        <link rel="stylesheet" type="text/css"href="http://cdn.sencha.com/ext/gpl/4.2.1/resources/css/ext-all.css">
        <!-- Load ExtJS from their CDN, local versions work also -->
        <script type="text/javascript"src="http://cdn.sencha.com/ext/gpl/4.2.1/ext-debug.js"></script>
        <!-- Load OpenLayers, custom builds may even be better -->
        <script src="http://openlayers.org/api/2.13.1/OpenLayers.js"></script>
    </head>
    <body></body>
</html>
```
Change the respective lines of code.

Also, edit the loaders.js file to feature the following:<br>
```
<script type="text/javascript">
Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        GeoExt: "path/to/src/GeoExt",
        Ext: "http://cdn.sencha.com/ext/gpl/5.1.0/src"
    }
});

</script>
```
Run the index.html on browser

#Working Demo
The demo can be accessed through this url http://apps.lifeingis.com/weather-app







