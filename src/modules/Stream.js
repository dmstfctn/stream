import {useRef, useState, useEffect} from 'react';
import { findDOMNode } from 'react-dom'
import ReactPlayer from 'react-player/vimeo'
import screenfull from 'screenfull'

import { ReactComponent as SvgFullscreen } from '../svg/fullscreen.svg'
import { ReactComponent as SvgFullscreenReduce } from '../svg/fullscreen-reduce.svg'
import { ReactComponent as SvgMute } from '../svg/mute.svg'
import { ReactComponent as SvgUnMute } from '../svg/unmute.svg'

const Stream = function({ 
  progress, 
  src, 
  placeholderSrc, 
  placeholder1000Src,
  isStreaming 
}){
  const acceptableLatency = 1500;
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(isStreaming);  
  const [isFullscreen, setIsFullscreen] = useState( false );  
  const [fullscreenShowControls, setFullscreenShowControls] = useState(true);
  const fullscreenHideControlsTimeout = useRef();
  const player = useRef();
  const streamWrapper = useRef();

  const muteUnmute = () => {
    setIsMuted( !isMuted );
  }

  const fullscreen = () => {
    if( screenfull.isFullscreen ){
      screenfull.exit();               
    } else {
      screenfull.request(
        findDOMNode(streamWrapper.current),
        {navigationUI: 'hide'}
      )    
    }
  }

  const updateProgress = ( state ) => {          
    alignVideo();
  }

  const alignVideo = () => {
    if( !player.current ){ return };
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
        if( isPlaying ){
          //OPTION:
          // here, we could not jump but just signify that it's no longer live
          console.log('behind the time, set to: ', progress/1000);
          vimeoApi.setCurrentTime( progress / 1000 );          
        }
      }     
    });
  }

  const mouseMove = () => {
    setFullscreenShowControls( true );
  }

  useEffect( () => {
    if( !screenfull.isEnabled ){
      return;
    }    
    const handleFullscreenChange = () => {      
      if( screenfull.isFullscreen ){
        setIsFullscreen(true)
      } else {
        setIsFullscreen(false)
      }
    }
    screenfull.on('change', handleFullscreenChange );
    return () => {
      screenfull.off('change', handleFullscreenChange );
    }
  })

  useEffect( () => {
    if( fullscreenShowControls ){
      clearTimeout(fullscreenHideControlsTimeout.current);
      fullscreenHideControlsTimeout.current = setTimeout( () => {
        setFullscreenShowControls( false );
      }, 3000 );
      return () => {
        clearTimeout(fullscreenHideControlsTimeout.current);
      }
    }
  }, [fullscreenShowControls])

  useEffect(() => {
    const handleFullscreenMouseMove = (e) => {
      setFullscreenShowControls(true);
    }
    if( isFullscreen ) {
      window.addEventListener('mousemove', handleFullscreenMouseMove);
    } else {
      window.removeEventListener('mousemove', handleFullscreenMouseMove)
    }
    return () => window.removeEventListener('mousemove', handleFullscreenMouseMove);
  }, [isFullscreen]);

  useEffect( () => {    
    if( isStreaming ){
      setIsPlaying( true );
    }
  }, [isStreaming] );

  if( isStreaming ){
    return (
      <article 
        className={`stream stream__video${(isStreaming) ? ' stream__live' : ''}${(isFullscreen) ? ' stream__fullscreen' : ''}`}
        ref={ streamWrapper }
        onMouseMove={mouseMove}        
      >
        <div 
          className={`stream--controls${(fullscreenShowControls ? ' fullscreen-show' : '')}`}>
          <div className="controls--live is-live">
            LIVE •
          </div>
          <div className="controls--bar"></div>
          <button 
            className="controls--mute"
            onClick={ muteUnmute }
          >
            {(isMuted) ? <SvgUnMute /> : <SvgMute /> }
          </button>
          {(screenfull.isEnabled) ? 
            <button 
              className="controls--fullscreen"
              onClick={ fullscreen }
            >
              {(isFullscreen) ? <SvgFullscreenReduce /> : <SvgFullscreen />}
            </button>
          :
            ''
          }
        </div>
        <div className="stream--media">
          <img 
            width="1600" 
            height="1200"
            alt="Screenshot from ECHO FX containing a twitter avatar of a face in red and black with text that reads @klobo15 Farage told Sky that REMAIN will edge it"
            className="stream--placeholder"
            src={placeholderSrc}
            srcSet={`
              ${placeholderSrc} 1600w,
              ${placeholder1000Src} 1000w
            `}
            sizes="100vw"
          />      
          <ReactPlayer
            className="stream--player"
            ref={ player }
            url={src}
            width={(window.innerWidth > 720 ) ? (window.innerHeight/3) * 4 : window.innerWidth }
            height={(window.innerWidth > 720 ) ? window.innerHeight : (window.innerWidth/4) * 3 }
            playing={isPlaying}
            volume={1}
            muted={isMuted}
            controls={false}
            playsinline={true}
            //controls={true}
            onProgress={ updateProgress }
            config={{
              vimeo: {
                playsinline: true,
                //quality: '2k'
              }
            }}
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
          width="1600" 
          height="1200"
          alt="Screenshot from ECHO FX containing a twitter avatar of a face in red and black with text that reads @klobo15 Farage told Sky that REMAIN will edge it"
          className="stream--placeholder"
          src={placeholderSrc}
          srcSet={`
            ${placeholderSrc} 1600w,
            ${placeholder1000Src} 1000w
          `}
          sizes="100vw"
        />
      </div>
    </article>
  )
}

export default Stream;