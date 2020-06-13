import React,{PropTypes,Component} from 'react';
import axios from 'axios/index';
import Message from './Message'
import Card from './Card';
import QuickReplies from './QuickReplies';

class Botchat extends Component{

    constructor(props){
        super(props);
        this.state={
            messages:[],
            showbot:true,
            selectedFile:null,
            fileName:''
        }
        this.hide = this.hide.bind(this)
        this.show = this.show.bind(this)
        this.handleClick = this.handleClick.bind(this);

        this._handleInputchange= this._handleInputchange.bind(this);
        this._handleQuickReplyPayload= this._handleQuickReplyPayload.bind(this);
        this.selecthandler = this.selecthandler.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
    }

    show(event){
        event.preventDefault()
        event.stopPropagation();
        this.setState({showbot:true})
    }

    hide(event){
        event.preventDefault()
        event.stopPropagation();

        this.setState({showbot:false})
    }

    async df_text_query(qtext){
       let says = {
           speaks:"me",
           msg:{
               text:{
                   text:qtext
               }
           }
       }

       this.setState({messages:[...this.state.messages,says]})
       try{
       const res = await axios.post('/api/df_text_query',  {text: qtext});
       for(let msg of res.data.fulfillmentMessages){
           says={
               speaks:"bot",
               msg:msg
           }
           this.setState({messages:[...this.state.messages,says]})
       }
    }

catch(e){
    says={
        speaks: 'bot',
        msg: {
            text : {
                text: "I'm having troubles when trying to connect for solution,,Will be back shortly"
            }
        }

    }

    this.setState({ messages: [...this.state.messages, says]});
    let that = this;
    setTimeout(function(){
        that.setState({ showBot: false})
    }, 3000);}
   


    }

    async df_event_query(eventName) {   
try{
        const res = await axios.post('/api/df_event_query',  {event: eventName});
            console.log(res.data.fulfillmentMessages)
        for (let msg of res.data.fulfillmentMessages) {
            let says = {
                speaks: 'bot',
                msg: msg
            }

            this.setState({ messages: [...this.state.messages, says]});
        }
    }
        catch(E){
            let says={
                speaks: 'bot',
                msg: {
                    text : {
                        text:'Im having troubles when trying to connect for solution,,Will be back shortly'
                    }
                }
        
            }
        
            this.setState({ messages: [...this.state.messages, says]});
            let that = this;
            setTimeout(function(){
                that.setState({ showBot: false})
          
            }, 3000);
        }
    };

    _handleInputchange(e){
        if(e.key==="Enter"){
            this.df_text_query(e.target.value);
            e.target.value='';
        }
  
    }


    resolveAfterXSeconds(x) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(x);
            }, x * 500);
        })
    }

     componentDidMount(){
        let says = {
            speaks: 'bot',
            msg: {
                text : {
                    text: "HI , Welcome to IBOT CHAT!!!!,Choose the reason you are here...."
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says]});

        
        this.df_event_query('LEARN_TEACH');            

    }

    handleClick(e) {
        this.refs.fileUploader.click();
    }
    renderCards(cards) {
        return cards.map((card, i) => <Card key={i} payload={card.structValue}/>);
    }


    _handleQuickReplyPayload(event,payload,text){
      event.preventDefault();
      event.stopPropagation();
      switch(payload){
          case 'handling_masterclass':
              this.df_event_query('MASTERCLASS');
              break;
              
          case 'training_TEACH':
                  this.df_event_query('TEACH');
                  break;
          case 'recommend_yes':
                  this.df_event_query('SHOW_RECOMMENDATIONS');
                  break;  

          case 'training_LEARN' :
                  this.df_event_query('LEARN');
                  break;       
              default:
                  this.df_text_query(text)
                  break;
      }
    }
    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });

    }




         renderMessages(returnedmessages){
              if(returnedmessages){
               return  returnedmessages.map((message,i)=>{
                    if(message.msg&&message.msg.text&&message.msg.text.text){

                        var msgs = message.msg.text.text.toString()
                             if(msgs.includes('&&!![]')){
                                 if(msgs.includes('&&!![]')&&msgs.includes('/')){
                                    return  <Message key={i} speaks={message.speaks} text = {message.msg.text.text}/>

                                }
                                 else{
                                 var final_message = 'There are mutiple solutions for this issue'
                                   
                                 var msg_arr =msgs.split('&&!![]')
                                for(var j =0;j<msg_arr.length;j++){
                                    final_message = final_message+'\n'+(j+1)+"."+msg_arr[j]
                                }
                                    return  <Message key={i} speaks={message.speaks} text = {final_message}/>
                            }
                             }
                             else{
                                return <Message key={i} speaks={message.speaks} text = {message.msg.text.text}/>
                                 }
                             
                    }

                    else if(message.msg&&message.msg.payload&&message.msg.payload.fields&&message.msg.payload.fields.cards){
                        return <div key={i}>
                        <div className="card-panel grey lighten-5 z-depth-1">
                            <div style={{overflow: 'hidden'}}>
                                <div className="col s2">
                                    <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                                </div>
                                <div style={{ overflow: 'auto', overflowY: 'scroll'}}>
                                    <div style={{ height: 300, width:message.msg.payload.fields.cards.listValue.values.length * 270}}>
                                        {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    }
                    else if (message.msg &&message.msg.payload &&message.msg.payload.fields &&message.msg.payload.fields.quick_replies) {


                        return<QuickReplies text={message.msg.payload.fields.text?message.msg.payload.fields.text:null} 
                        key={i}
                        replyClick={this._handleQuickReplyPayload}
                        speaks =  {message.speaks}
                        payload = {message.msg.payload.fields.quick_replies.listValue.values}
            
                        />

                        
                    }

                })
              }
              else{
                  return null
              }
         }


        selecthandler(event){
            this.setState(
                {
                    selectedFile:event.target.files[0],
                    fileName:event.target.files[0].name
                }
            )

            
        }
        uploadFile(e){

            this.df_text_query('C|/Users/sbaln/ChatBot/'+this.state.fileName);
            console.log(this.state.fileName)
            //const data = new FormData()
            //data.append('file', this.state.selectedFile)
            //axios.post("http://localhost:5000/upload", data, { 
               // receive two    parameter endpoint url ,form data
           //})
         //.then(res => { // then print response status
             //console.log(res.statusText)
          //})
                 }
    render(){
        if(this.state.showbot){
        return (
            <div style={{height: 435, width: 400, position:'absolute',bottom:0,right:0,border:'1px solid lightgrey'}}>
                <nav>
                 <div className="nav-wrapper purple darken-4">
                     <a className="brand-logo">IBOT</a>
                     <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.hide}>Close</a></li>
                            </ul>
                     
                     </div>          

                </nav>
                

               <div id="chatbot" style={{height: 388, width: '100%', overflow: 'auto'}}>
                    
                      {this.renderMessages(this.state.messages)}
                      <div ref={(el) => { this.messagesEnd = el; }}
                         style={{ float:"left", clear: "both" }}>
                    </div>
                    <div className="col s12">
                    <input  style={{margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} placeholder="Type a Message" type="text" onKeyPress={this._handleInputchange}/>
                    <div>
                    <input ref={inputFile=>this.inputFile=inputFile} type="file" onChange={this.selecthandler} style={{display: 'none'}}/>
                     <button style={{backgroundColor:'#ADD8E6'}} onClick={()=>this.inputFile.click()}>BROWSE</button>
                     <button style={{backgroundColor:'#ADD8E6'}} onClick={this.uploadFile}>UPLOAD</button>
                     
                     </div>     


                    </div>  
        

                </div>

            </div>
        );


        }
        else{
            return (
                <div style={{ minHeight: 40, maxHeight: 500, width:400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray'}}>
                    <nav>
                        <div className="nav-wrapper purple darken-4">
                            <a href="/" className="brand-logo">IBOT</a>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.show}>Show</a></li>
                            </ul>
                        </div>
                    </nav>

                    <div ref={(el) => { this.messagesEnd = el; }}
                         style={{ float:"left", clear: "both" }}>
                    </div>
                    <div className=" col s12" >
                    <input style={{margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} ref={(input) => { this.talkInput = input; }} placeholder="type a message:"  onKeyPress={this._handleInputKeyPress} id="user_says" type="text" />
                </div>

                    </div>
)}


        }

}


export default Botchat; 
