
exports.handler = (event, context, callback) => {
 var field = '';

   var intentName = event.currentIntent.name;
          console.log(intentName);
          

    try {
        if (intentName === 'searchforda') {
            global.value = "PAN-"+event.currentIntent.slots.da;
           field = 'COUNCIL_NAME';
        
           callService(field,function (err,result) {
               
                if(err) callback(null, buildResponse("Coudnt find the application number, please try again."));
                  
               
                  let response = {
    "sessionAttributes": { 
        "key":global.value,
        "council":result
        
    },
    "dialogAction": {
        "type": "Close", 
        "fulfillmentState": "Fulfilled",
        "message": {
            "contentType": "PlainText",
            "content": "We found "+global.value + " and it belongs to " + result
        }
    } 
};
         
         callback(null,response);     
                    
                   
                });
        }
        
                if (intentName ==='address') {
             global.value = event.sessionAttributes.key;
            
                     field = 'SITE_ADDRESS';
        
           callService(field,function (err,result) {
                  let response = {
    "sessionAttributes": { 
       "key":global.value
    },
    "dialogAction": {
        "type": "Close", 
        "fulfillmentState": "Fulfilled",
        "message": {
            "contentType": "PlainText",
            "content": "Based on our records the address is " + result
        }
    } 
};
         
         callback(null,response);     
                    
                   
                }); 
                   
                
             
        }
                        if (intentName ==='applicationtype') {
             global.value = event.sessionAttributes.key;
            
                     field = 'APPLICATION_TYPE';
        
           callService(field,function (err,result) {
                  let response = {
    "sessionAttributes": { 
       "key":global.value
    },
    "dialogAction": {
        "type": "Close", 
        "fulfillmentState": "Fulfilled",
        "message": {
            "contentType": "PlainText",
            "content": "It is a  " + result
        }
    } 
};
         
         callback(null,response);     
                    
                   
                }); 
                   
                
             
        }
		                        if (intentName ==='countcouncil') {
             global.council =  event.currentIntent.slots.council.toUpperCase();
            
                     field = 'COUNCIL_NAME';
        
           callCouncilCountService(field,function (err,result) {
                  let response = {
    "sessionAttributes": { 
       "key":global.value,
	   "council":global.council
    },
    "dialogAction": {
        "type": "Close", 
        "fulfillmentState": "Fulfilled",
        "message": {
            "contentType": "PlainText",
            "content": "There are a total of  " + result+" applications for "+ global.council
        }
    } 
};
         
         callback(null,response);     
                    
                   
                }); 
                   
                
             
        }
        		                        if (intentName ==='countcouncilstatus') {
             global.council =  event.sessionAttributes.council;
             var status = event.currentIntent.slots.status;
            
                    
        
           callCouncilStatusService(status,function (err,result) {
                  let response = {
    "sessionAttributes": { 
       "key":global.value,
	   "council":global.council,
	   "status": status
    },
    "dialogAction": {
        "type": "Close", 
        "fulfillmentState": "Fulfilled",
        "message": {
            "contentType": "PlainText",
            "content": "It looks like there are " + result+" applications in "+ status + " for " + global.council
        }
    } 
};
         
         callback(null,response);     
                    
                   
                }); 
                   
                
             
        }


        if (intentName ==='statusDa') {
             global.value = event.sessionAttributes.key;
            
                     field = 'STATUS';
        
           callService(field,function (err,result) {
                  let response = {
    "sessionAttributes": { 
       "key":global.value
    },
    "dialogAction": {
        "type": "Close", 
        "fulfillmentState": "Fulfilled",
        "message": {
            "contentType": "PlainText",
            "content": "The status is " + result
        }
    } 
};
         
         callback(null,response);     
                    
                   
                }); 
                   
                
             
        }
                
  
    } catch (e) {
        context.fail(`Exception: ${e}`);
    }
};

function callService(field,callback)
{
    var https = require('https');
          var params = {
                    host: "maptest1.environment.nsw.gov.au",
                    path: "/arcgis/rest/services/Planning/DA_Tracking/MapServer/0/query?where=PLANNING_PORTAL_APP_NUMBER='"+global.value+"'&outfields=*&f=pjson"
    
                    };
                    
                    try{
   https.get(params, function(res) {
    let data = '';
   
  
    res.on('data', function(chunk) {
        data += chunk;
    });
    res.on('end', function() {
        var fields = JSON.parse(data).features[0].attributes[field];
       
       callback(null,fields);

    });
  });
                    }
                    catch(e)
                    {
                        callback(null, buildResponse("Coudnt find the application number, please try again."));
                    }
  
  
}
function callCouncilCountService(field,callback)
{
    var uri =  encodeURI(global.council);
    var https = require('https');
          var params = {
                    host: "maptest1.environment.nsw.gov.au",
                    path: "/arcgis/rest/services/Planning/DA_Tracking/MapServer/0/query?where=COUNCIL_NAME='"+uri+"'&returnCountOnly=true&outfields=*&f=pjson"
    
                    };
   https.get(params, function(res) {
    let data = '';
   
  
    res.on('data', function(chunk) {
        data += chunk;
    });
    res.on('end', function() {
        var fields = JSON.parse(data).count;
       
       callback(null,fields);

    });
  });
  
  
}
function callCouncilStatusService(status,callback)
{
   
    var https = require('https');
          var params = {
                    host: "maptest1.environment.nsw.gov.au",
                    path: "/arcgis/rest/services/Planning/DA_Tracking/MapServer/0/query?where=COUNCIL_NAME='"+encodeURI(global.council)+"'and+STATUS='"+encodeURI(status)+"'&returnCountOnly=true&outfields=*&f=pjson"
    
                    };
                    console.log(params);
   https.get(params, function(res) {
    let data = '';
   
  
    res.on('data', function(chunk) {
        data += chunk;
    });
    res.on('end', function() {
        var fields = JSON.parse(data).count;
       
       callback(null,fields);

    });
  });
  
  
}
function buildResponse(response) {
    return {
        version: '1.0',
        response: {
            dialogAction: {
                 fulfillmentState: "Fulfilled",
                contenttype: 'PlainText',
                content: response,
            },
           
        },
        sessionAttributes: {},
    };
}