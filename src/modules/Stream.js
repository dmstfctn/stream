import {useRef, useState, useEffect} from 'react';
import { findDOMNode } from 'react-dom'
import ReactPlayer from 'react-player/vimeo'
import screenfull from 'screenfull'

import './Stream.css';

const Stream = function({ 
  progress, 
  src, 
  placeholderSrc, 
  isLeadIn, 
  isStreaming 
}){
  const acceptableLatency = 1500;
  const [isMuted, setIsMuted] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(isLeadIn || isStreaming);
  const [isSeeking, setIsSeeking] = useState( false );
  const [isFullscreen, setIsFullscreen] = useState( false );
  const [amountPlayed, setAmountPlayed] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const player = useRef();
  const streamWrapper = useRef();

  const liveNotLive = () => {
    if( !isLive ){
      alignVideo();
    }
    setIsLive( !isLive );
  }

  const playPause = () => {
    if( isPlaying ){
      setIsLive( false );
    }
    setIsPlaying( !isPlaying );    
  }

  const muteUnmute = () => {
    setIsMuted( !isMuted );
  }

  const fullscreen = () => {
    if( screenfull.isFullscreen ){
      screenfull.exit();
      setIsFullscreen( false );
    } else {
      screenfull.request(
        findDOMNode(streamWrapper.current),
        {navigationUI: 'hide'}
      ).then( () => {        
        setIsFullscreen(true)
      });      
    }
  }

  const seekMouseDown = () => {
    setIsSeeking( true );
    setIsLive( false );
  }

  const seekMouseUp = ( e ) => {
    setIsSeeking( false );          
    executeVideoSeek( parseFloat( e.target.value ) )
  }

  const seekChange = ( e ) => {
    const target = parseFloat(e.target.value);
    setIsLive( false );
    setAmountPlayed( target );
  }

  const executeVideoSeek = ( target ) => {
    if( videoDuration > 0 ){
      if( target <= progress/videoDuration ){
        player.current.seekTo( target );
      } else {
        player.current.seekTo( progress/videoDuration );
      }
    } else {
      setAmountPlayed( target );
    }
  }

  const updateProgress = ( state ) => {      
    console.log('progressUpdate, state:', state );
    if( !isSeeking ){      
      alignVideo();
      setAmountPlayed( state.played );
    }
  }
  const updateDuration = ( duration ) => {
    setVideoDuration( duration );
  }

  const alignVideo = () => {
    if( !player.current ){ return };
    if( isSeeking ){ return };
    const vimeoApi = player.current.getInternalPlayer();
    vimeoApi.getCurrentTime().then(function(seconds) {
      const videoTime = seconds * 1000;      
      if( videoTime - progress > acceptableLatency ){
        // gone too far somehow. Should still skip back even if not live
        // i.e. should never be able to go ahead 
        if( isPlaying ){
          vimeoApi.setCurrentTime( progress / 1000 );          
        }
      } else if( videoTime - progress < -1 * acceptableLatency ) {          
        if( isPlaying && isLive ){
          //OPTION:
          // here, we could not jump but just signify that it's no longer live
          console.log('behind the time, set to: ', progress/1000);
          vimeoApi.setCurrentTime( progress / 1000 );          
        }
      }     
    });
  }

  useEffect( () => {
    console.log('Stream.js, isLeadIn? ', isLeadIn, ' isStreaming?', isStreaming, ' isPlaying?', isPlaying );
    if( isLeadIn || isPlaying ){
      setIsPlaying( true );
    }
  }, [isLeadIn, isStreaming] );

  if( isLeadIn || isStreaming ){
    return (
      <article 
        className={`stream stream__video${(isStreaming) ? ' stream__live' : ''}`}
        ref={ streamWrapper }
      >
        <div className="stream--controls">
          <button onClick={ playPause }>{isPlaying ? 'Pause' : 'Play' }</button>
          <button onClick={ liveNotLive }>{(isLive) ? 'LIVE' : 'NOT LIVE'}</button>         
          <input
            type='range' min={0} max={0.999999} step='any'
            value={amountPlayed}
            onMouseDown={seekMouseDown}
            onChange={seekChange}
            onMouseUp={seekMouseUp}
          />
          <button onClick={ muteUnmute }>{(isMuted) ? 'Unmute' : 'Mute'}</button>
          <button onClick={ fullscreen }>{(isFullscreen) ? 'Exit Fullscreen' : 'Fullscreen'}</button>
        </div>
        <div className="stream--media">
          <ReactPlayer
            className="stream--player"
            ref={ player }
            url={src}
            width={(window.innerHeight/3) * 4}
            height={window.innerHeight}
            playing={isPlaying}
            volume={1}
            muted={isMuted}
            controls={false}
            //controls={true}
            onProgress={ updateProgress }
            onDuration={ updateDuration }
          />
        </div>
      </article>
    )
  }
  return (
    <article 
      className="stream stream__placeholder"
      ref={ streamWrapper }
    >
      <div className="stream--media">
        <img 
          className="stream--placeholder"
          src={placeholderSrc} 
        />
      </div>
    </article>
  )
}

export default Stream;