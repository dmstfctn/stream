import {useState, useEffect} from 'react';

import Stream from './modules/Stream.js';
import Data from './modules/Data.js';

import getTime from './helpers/getTime.js';
import humanTimeRemaining from './helpers/humanTimeRemaining.js';

import './App.css';

const sortStreams = ( streams, _now ) => {
  const now = _now || (new Date()).getTime();
  return streams.filter((stream) => {
      return stream.leadInStart > now - Data.config.timing.streamLength;
    }).sort( (a,b) => {
      return (a.start - now) - (b.start - now);
    });
}

function App() {
  const [isStreaming, setIsStreaming] = useState( false );
  const [isLeadIn, setIsLeadIn] = useState( false );  
  const [now, setNow] = useState();
  const [currentStreamStart, setCurrentStreamStart] = useState( false );
  const [streams, setStreams] = useState( sortStreams( Data.streams, now ) );

 

  useEffect(() => {
    streams.forEach(({start, leadInStart}, i ) =>{ 
      if(
        now >= leadInStart
        && now < start
      ){        
        console.log('START LEAD IN');
        setCurrentStreamStart( leadInStart );
        setIsStreaming( false );
        setIsLeadIn( true );
      }
      if(
        now >= start
        && now < start + Data.config.timing.streamLength 
      ){        
        console.log('START STREAM');
        setCurrentStreamStart( leadInStart );
        setIsLeadIn( false );
        setIsStreaming( true );
      }     
    })
  }, [now, streams]); 

  useEffect( () => {
    setStreams( sortStreams( Data.streams, now ) );
  }, [now] );
  
  useEffect( () => {
    if( isStreaming ){
      document.body.classList.add('streaming');
      document.body.classList.remove('not-streaming');
    } else {
      document.body.classList.remove('streaming');
      document.body.classList.add('not-streaming');
    }
  }, [isStreaming] );

  useEffect( () => {
    let timeUpdate;
    getTime().then( (t) => { 
      var jst = (new Date()).getTime();
      setNow(t);
    });  
    
    const run = ( inTime ) => {
      clearTimeout( timeUpdate );
      timeUpdate = setTimeout( () => {
        let getStart = (new Date()).getTime();
        getTime().then( (t) => {
          let getComplete = (new Date()).getTime();
          setNow(t);          
          run( 1000 - (getComplete - getStart ) );
        });
      }, inTime );
    }

    run( 1000 );
    return () => {
      clearTimeout( timeUpdate );
    }
  }, []);

  const wrapperClasses = `wrapper ${(isStreaming) ? 'streaming' : 'not-streaming' }`

  return (
    <div
      className={wrapperClasses}
    >
    {/* <aside className="time">
        {`${new Date(now).getHours()}:${new Date(now).getMinutes()}:${new Date(now).getSeconds()}`}
    </aside> */}
    <nav>
      <div>
        Upcoming Streams:
        <ol>
          {streams.map( ( stream, i ) => { 
            const remaining = humanTimeRemaining( stream.start - now );               
            return (
              <li key={stream.start}>
                <time dateTime={(new Date(stream.start)).toISOString()}>
                  {stream.title}
                </time> 
                <wbr></wbr>
                {(remaining) ? <span className="remaining serif italic red"> 
                  ({ remaining })
                </span> : ''}
              </li>
            )
          })}         
        </ol>
      </div>
    </nav>   
    <Stream 
      progress={now - currentStreamStart}
      isStreaming={isStreaming}
      isLeadIn={isLeadIn}
      placeholderSrc={process.env.PUBLIC_URL + '/media/face1.jpg'}
      src={Data.config.src} 
    />       
    </div>
  );
}

export default App;
