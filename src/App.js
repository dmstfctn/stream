import {useState, useEffect} from 'react';

import Stream from './modules/Stream.js';
import Data from './modules/Data.js';

import getTime from './helpers/getTime.js';
import humanTimeRemaining from './helpers/humanTimeRemaining.js';

const sortStreams = ( streams, _now ) => {
  const now = _now || (new Date()).getTime();
  return streams.filter((stream) => {
      return stream.start > now - Data.config.timing.streamLength;
    }).sort( (a,b) => {
      return (a.start - now) - (b.start - now);
    });
}

function App() {
  const [isStreaming, setIsStreaming] = useState( false );
  const [now, setNow] = useState();
  const [currentStreamStart, setCurrentStreamStart] = useState( false );
  const [streams, setStreams] = useState( sortStreams( Data.streams, now ) );

 

  useEffect(() => {
    streams.forEach(({start}, i ) =>{ 
      if(
        now >= start
        && now < start + Data.config.timing.streamLength 
      ){        
        setCurrentStreamStart( start );
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
      if( now - currentStreamStart > 7000 ){
        document.body.classList.add('cancel-fade');
      }
    } else {
      document.body.classList.remove('streaming');
      document.body.classList.add('not-streaming');
    }
  }, [isStreaming, now, currentStreamStart] );

  useEffect( () => {
    let timeUpdate;
    getTime().then( (t) => { 
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

  const wrapperClasses = `stream-wrapper ${(isStreaming) ? 'streaming' : 'not-streaming' }`

  return (
    <div
      className={wrapperClasses}
    >
    {/* <aside className="time">
        {`${new Date(now).getHours()}:${new Date(now).getMinutes()}:${new Date(now).getSeconds()}`}
    </aside> */}
    <nav className="upcoming-streams">
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
                <span className="remaining serif italic red"> 
                  ({ (remaining) ? remaining : 'now' })
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
    <Stream 
      progress={now - currentStreamStart}
      isStreaming={isStreaming}
      placeholderSrc={process.env.PUBLIC_URL + '/media/face1.jpg'}
      placeholder1000Src={process.env.PUBLIC_URL + '/media/face1-1000px.jpg'}
      src={Data.config.src} 
    />       
    </div>
  );
}

export default App;
