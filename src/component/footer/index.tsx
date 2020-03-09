import React, {useState, useEffect} from 'react';
import './style.pcss';
import SvgIcon from '../svg-icon';
import {curSongInfo, songTrack} from '../../types/index';
import { Slider } from 'antd';
import {audioPlayer, parseTime} from '../../plugin/index';

interface Props {
  status: boolean,
  curSongInfo: curSongInfo,
  playTracks: Array<songTrack>,
  stopMusic: Function,
  playMusic: Function,
  setSource: Function,
  setStatus: Function,
  fetchSongUrl: Function
}

function AppHeader ({setStatus, status, stopMusic, playMusic, curSongInfo, playTracks, fetchSongUrl, setSource}: Props) {
  const audio = audioPlayer.getInstance();
  let statusClass = ['play-icon'];
  if (status) {
    statusClass.push('active')
  }
  let [volume, setVolume] = useState(audio.volume * 100);
  let [curPlayTime, setPlayTime] = useState(audio.currentTime);
  let [isMove, setMoveStatus] = useState(false);
  const nextSongIcon: object = {
    width: 32,
    height: 32,
  }
  const volumeIconStyle = {
    width: 20,
    height: 20
  }
  // listen audio time
  audio.ontimeupdate = function (timeupdate: any) {
    if (!isMove) {
      setPlayTime(timeupdate.path[0].currentTime);
    }
  }
  // initial effect
  useEffect(() => {
    // initial volume
    audio.volume = 0.25;
    setVolume(audio.volume * 100);
  }, [])

  async function switchPlayer () {
    if (status) {
      stopMusic();
    } else {
      const songUrlData = await fetchSongUrl(curSongInfo.id);
      curSongInfo.source = songUrlData.data[0].url;
      setSource(curSongInfo);
      slideTimeEnd(curPlayTime);
      playMusic();
    }
  }

  function getCurrentSongIndex () {
    return playTracks.findIndex(el => el.id === curSongInfo.id);
  }

  function playPreSong (curSongIdx: number) {
    if (curSongIdx > 0) {
      setSource(playTracks[curSongIdx - 1]);
    }
  }
  function playNextSong (curSongIdx: number) {
    if (curSongIdx < playTracks.length - 1) {
      setSource(playTracks[curSongIdx + 1]);
    }
  }
  // control previous or next
  function controlPreOrNext (type: number) {
    let curSongIdx = getCurrentSongIndex();
    if (type === -1) {
      playPreSong(curSongIdx)
    } else if (type === 1) {
      playNextSong(curSongIdx);
    }
    playMusic();
    setStatus(true);
  }
  function slideTime (time: any) {
    setMoveStatus(true);
    setPlayTime(time);
  }
  function slideTimeEnd (time: any) {
    setMoveStatus(false);
    setPlayTime(time);
    audio.currentTime = time;
  }
  // set volume
  function changeVolumn (volume: any) {
    setVolume(volume);
    audio.volume = volume / 100;
  }

  return (
    <footer className="app-footer">
      <div className="footer-bg"></div>
      <div className="footer-container">
        <div className="player-control">
          <SvgIcon href="iconshangyige" customStyle={nextSongIcon} event={() => controlPreOrNext(-1)}/>
          <div className="play-btn" onClick={switchPlayer}>
            <div className={statusClass.join(' ')}></div>
          </div>
          <SvgIcon href="iconxiayige" customStyle={nextSongIcon} event={() => controlPreOrNext(1)}/>
        </div>
        <div className="time-bar">
          <span className="slide-time">{parseTime(curPlayTime * 1000)}</span>
          <Slider onChange={slideTime} onAfterChange={slideTimeEnd} value={curPlayTime} min={0} max={Math.round(curSongInfo.dt / 1e3)} tipFormatter={null}/>
          <span className="slide-time">{parseTime(curSongInfo.dt)}</span>
        </div>
        <div className="volume-bar">
          <SvgIcon href="iconyinliang" customStyle={volumeIconStyle} event={() => {}}></SvgIcon>
          <Slider onChange={changeVolumn} min={0} max={100} onAfterChange={() => playMusic()} value={volume} tipFormatter={null}/>
        </div>
      </div>
    </footer>
  )
}

export default AppHeader;