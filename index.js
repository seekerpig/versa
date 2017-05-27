'use strict';

const express = require('express');
const bodyParser = require('body-parser');


var XMLHttpRequest= require('xmlhttprequest').XMLHttpRequest;
var languageCodes = [{longname:"Japanese",shortname:"ja"},{longname:"English",shortname:"en"},{longname:"Chinese",shortname:"zh-CHS"},{longname:"Korean",shortname:"ko"},{longname:"French",shortname:"fr"},{longname:"German",shortname:"de"},{longname:"Spanish",shortname:"es"}];
const restService = express();
restService.use(bodyParser.json());

// git add .
// git commit -m 'update my app'
// git push heroku master

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';
				var language1 = "";
				
				for (var i = 0; i < languageCodes.length; i++)
				{
					if (requestBody.result.parameters["lang-to"] == languageCodes[i].longname)
					{
						language1 = languageCodes[i].shortname;
						console.log("hey");
					}
				}
				
				var url = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate?&appId=68D088969D79A8B23AF8585CC83EBA2A05A97651&from=" + "en" + "&to=" + language1 + "&text=" + requestBody.result.parameters["text"];
				var translatedText = httpGet(url);
				
					
				speech += translatedText;
					
				
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});
function httpGet(theUrl)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	return xmlHttp.responseText;
}	

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});