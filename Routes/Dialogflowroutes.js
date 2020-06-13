const chatbot = require('../chatbot/chatbot') 

module.exports = app => {

 


 

    app.post('/api/df_text_query', async(req, res) => {

        try{

        let responses = await chatbot.textQuery(req.body.text,req.body.parameters);

        res.send(responses[0].queryResult)

    }

    catch(err){

        console.error("Error:",err)

    }

    });

 

    app.post('/api/df_Event_query', async(req, res) => {

        try{

            let responses = await chatbot.eventQuery(req.body.event, req.body.parameters);
            res.send(responses[0].queryResult);
    
    }

    catch(err){

        console.error("Error:",err)

    }

    });
}