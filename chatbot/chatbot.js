'use strict'

const dialogflow = require('dialogflow');
const structjson = require('../chatbot/structjson')
const config = require('../config/keys');
const mongoose = require('mongoose')
const Learnmodel = mongoose.model('learnModel')
const projectID = 'reactbot-tvgqht';
const sessionID = 'reactbot-session1'
const credentials = {
        private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPjcfn70b12h8k\n4bL9XCXnu1tuPqS4hg0SAlXrot6Z/cnFLX/oU+k85611Qg4DoWdSe7qLc0+n6OLW\nYz5NuXJRj9WLT33iypjAOXvVh/eFgwUXq3DWsDZZG+eHNpeAip7/cL37LpnQxQLH\nK7t6tVTROt7WeeoHZ4i6+Ah8x9cwO2YrzCyQ/ZjLCugMt1CuddXGfSwH1gGpZion\n7w/7zHbBboXXzn6vXAZAMjiFZmN0Ed9DOWp2S+kbVXrPnlPQ3ZrFaCxFEW8xRwPj\nmahfbCJzkJ72e8tq9kOZ2OubXex+HcTvSbLOREam7YE4JZ61aEgtlnIctGqPbUqC\nUuZ/6TsLAgMBAAECggEABEi2ZXA3+ZMDfv+OR2e3H3ekfFEcXLrlYg65D9eq8D3D\nSyCpy7WQIJrdmIhIHeGfYCwxusyUrgyC7TmUaAag1NQJQdiz6m6FjEqf5qsGEYJA\nMtMmzXwR942rSMw/ZDBxLu+U99kEj6Sl0hZHYvyDStWghN0fOnKszN+Z3M18uYcn\nts9F1MYzNmUHpo3HSsJiPsa6nqSCgexfkqRQUqHOTqZ3Ye+p+sFYI+3mseiEfIXY\nPEYRCkfervgmFVYV1u2pBSSuIsnpoj83LIWo4qj9oajGdlczSckei8GZUCMs+d8u\nOOvGFb1KUV0JOY9tuugeH0HjkYhwYMPPQlmYKuDnIQKBgQDn40FLvLbLpBVv+TX9\nwCQWXD6GP/Qpi5LEv4ZzLlSngwM5ubjzc0LPj6BmYaHC11M4o/mWqK17WFOT8S2R\nar4/evJ86UWl4P3mPfraCvyQRqbHadLe9OQINGyQl4CoT1zNuRhXK50bWHuMwJ9Q\nz45nUoyNgm8nFYS+tf0ceR48IQKBgQDlIsTbKfU87WGwd35+TbrqizXV7+pKNtQ8\n6pnoZXvA0ROd4W6PGRxFmVub/N5yuPbRtMbmzIgtiC7b+r5BM/jH4f+7C5Z28zRA\nG7NV+y0fDX6xsD0/q3+rl1t6ctmTV6d+dnbaWE1ZgaSy4n6K8ML8ATutWLHYgIHP\nt/HvvpzxqwKBgQDZM0oT8N2ffT//NATYe8LRlvGRuhGvYGbHF0aOWJU+mj7JMScG\nEa5A0J1DiKuF3z66TQ0Zi0GDyUXvyvYNwVgWCclcKvvr1gS8Rs3SsnvDgAnzuzGj\nWOrGrKQMA3ylKkEZCQi9jcKIvKZtPnd7sA4IxY+VdNk8WLGQGNLOerxRQQKBgFJY\nLGaWrYs3w+OnDc5WINYpMS+xCIGjMqKxrJ3X2qFwgZw7Z4AFhiN8+W8VcNvJnOnA\nDbrjxgyW5EAp3DWSd9VdYonVoD0fKafgTJKZsZ13PBCfRWOcPkVsH3Ph0k8hMRBB\ngnT1RtbjwEyJGPDVlTz7NHcXaNJlXEFJ2ahO2BgBAoGALIAR7nUsbey8va2n5cZF\nYwS/GrlnN+900zkwlPX5JKUsjHUg+nNl11fyVhab+lkwSMFy6az1/VCMqanu8mqa\nRlScGljEzdeA8QamIjP5s5RHia9n12i+oUFEkIZd+4GTF3HYcwsj1w3e7SYek7HP\n3EuQk3Kt7v8TrajzGWZOEtU=\n-----END PRIVATE KEY-----\n',

        client_email: 'dialog-flow-botclient@reactbot-tvgqht.iam.gserviceaccount.com',

}



//const sessionClient = new dialogflow.v2.SessionsClient({  keyFilename: '/config/reactbot-tvgqht-16818815b337.json'});

const sessionClient = new dialogflow.v2.SessionsClient({projectID,credentials});


const sessionPath = sessionClient.sessionPath(projectID, sessionID);

module.exports={

    textQuery: async function(text, parameters = {}) {
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'en-US',
                },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
        };

        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;



    },

    eventQuery: async function(event, parameters = {}) {
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters), //Dialogflow's v2 API uses gRPC. You'll need a jsonToStructProto method to convert your JavaScript object to a proto struct.
                    languageCode: 'en-US',
                },
            }
        };

        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;

    },

       learnmod:async function(fields){
        let learn = null;
        var stringSimilarity=require('string-similarity');
        var multi_value=[];
        var appname = fields.AppName.stringValue;
        var issuename= fields.IssueName.stringValue;
        let  multi_learn = await Learnmodel.find({'ApplicationName':appname.toLowerCase() });
        if(multi_learn.length>0){
        for(var i =0;i<multi_learn.length;i++ ){
            multi_value[i]= multi_learn[i].Issuename;
           }

           var matched_val = stringSimilarity.findBestMatch(issuename,multi_value);
           console.log(matched_val.bestMatch.rating)

           if(matched_val.bestMatch.rating>0.3){
               learn = multi_learn[matched_val.bestMatchIndex].IssueSolution
           }
        }
        else{
            learn =null
        }
       

        if (learn !== null ) {
            let responses = [{
                queryResult: {
                    fulfillmentMessages: [
                        {
                          text: {
                            text: [
                                learn
                            ]
                          }
                        }
                      ]
                      

                    }  
            }]
          return responses;     
        }
else{
    let msg = [{
        
        queryResult: {
            fulfillmentMessages: [
                {
                  text: {
                    text: [
                      'Unable to find the solution for the issue '+fields.IssueName.stringValue+'. im yet to be taught for this. '
                    ]
                  }
                }
              ],
            }
                          
    }]
  return msg
}

       },


        teachmod: async function(fields){
            var stringSimilarity=require('string-similarity');

             var appname =  fields.Application.stringValue;
             var issuename = fields.Issuename.stringValue;
             var solution =''
             let learn = null;
             var multi_value=[];

             let  multi_learn = await Learnmodel.find({'ApplicationName':appname.toLowerCase() });
             if(multi_learn.length>0){
      
             
              for(var i =0;i<multi_learn.length;i++ ){
                  multi_value[i]= multi_learn[i].Issuename;
                 }
      
                 var matched_val = stringSimilarity.findBestMatch(issuename,multi_value);
                   console.log("the matched val is "+matched_val.bestMatch.rating);
                   console.log(matched_val.bestMatch.target)
                   ;
                 if(matched_val.bestMatch.rating>0.4){
                     issuename = matched_val.bestMatch.target
                     learn = multi_learn[matched_val.bestMatchIndex].IssueSolution
                 }
      
             }
             else{
                 learn =null
             }
      
  
             if (learn !== null ) {
                solution =  learn+'&&!![]'+fields.solution.stringValue
                Learnmodel.findOneAndUpdate({$and: [{'ApplicationName':appname.toLowerCase() },{'Issuename':issuename.toLowerCase()} ]}

                , {$set: {IssueSolution: solution}}
                
                ,{new: true}, function (err, doc) {
                
                    if (err) {
                
                        console.log("update document error");
                
                    } else {
                
                        console.log("update document success");
                
                        console.log(doc);
                
                    }
                
                });
             }
             else{

                const registration = new Learnmodel({

                    ApplicationName:appname.toLowerCase(),
                    Issuename:issuename.toLowerCase(),
                    IssueSolution:fields.solution.stringValue     
                });
                try{
                    let reg = await registration.save();
                    console.log(reg);
                } catch (err){
                    console.log(err);
                }

            }

    },
           

    handleAction: function(responses){
        let self = module.exports;

        let queryres = responses[0].queryResult;
        switch(queryres.action){
           case 'TeachFollowup':

                if (queryres.allRequiredParamsPresent) {
                    self.teachmod(queryres.parameters.fields);

                }
                break;
           case 'Learnfollowup':
                if (queryres.allRequiredParamsPresent) {
                    responses= self.learnmod(queryres.parameters.fields);

                }
               break;

        }
        return responses;

    },


    

}

