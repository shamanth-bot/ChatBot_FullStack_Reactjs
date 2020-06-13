import React from 'react';
import Link from  './Link.js'
const Message = (props) => {
    var link = ''
    var i =0
    var k =1
    var multilink =[]
    var  multiflag=false
    var final_message=''
    var txt = props.text.toString()
          if(txt.includes('/')&&txt.includes('&&!![]')){
            multiflag = true
            var final_message = 'There are mutiple solutions along with documents for this issue'
                                   
            var msg_arr =txt.split('&&!![]')
           for(var j =0;j<msg_arr.length;j++){
               if(msg_arr[j].includes('/')){
                multilink[i] = msg_arr[j]
                i=i+1
               }
               else{
               final_message = final_message+'\n'+(k)+"."+msg_arr[j]
               k=k+1
               }
           }
           i=0;

          }
         var flag= (props.text.toString().includes('/'))?true:false
         if(flag){
             link = "file:///"+props.text
         }
          

    return (


        
        <div className="col s12 m8 offset-m2 l6 offset-l3">

            <div className="card-panel grey lighten-5 z-depth-1">
                <div className="row valign-wrapper">
                    {props.speaks==='bot' &&
                    <div className="col s2">
                        <a href="/" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
                    </div>
                    }
                    <div className="col s10">
                    {props.speaks==='bot'&&flag===true&&multiflag===false&&
                        <a href={link}  type="application/octet-stream" download>Download</a> 
                      }

{
                          props.speaks==='bot'&& flag===true&&multiflag===true&&<span className="black-text" >
                          <p style={{ whiteSpace: 'pre-wrap' }}>{final_message}</p><Link items={multilink}></Link> 
</span>
                      }
                    

                      {
                          props.speaks==='me'&& flag===true&&multiflag===false&&<span className="black-text" >
                          <p style={{ whiteSpace: 'pre-wrap' }}>{props.text}</p></span>
                      }

                    {flag===false&& multiflag===false&& <span className="black-text" >
                      <p style={{ whiteSpace: 'pre-wrap' }}>{props.text}</p></span>
                    }
                    </div>
                    {props.speaks==='me' &&
                    <div className="col s2">
                        <a href="/" className="btn-floating btn-large waves-effect waves-light red">{props.speaks}</a>
                    </div>
                    }
                </div>
            </div>
        </div>
                
    );
                }

export default Message;
