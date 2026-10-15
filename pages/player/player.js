const { playlist, formatTime } = require('../../utils/music')

const MODES = ['list', 'loop', 'shuffle']
const MODE_LABELS = {
  list: '顺序',
  loop: '单曲',
  shuffle: '随机'
}

Page({
  data: {
    song: {},
    index: 0,
    playing: false,
    progress: 0,
    currentTimeText: '0:00',
    durationText: '0:00',
    mode: 'list',
    modeLabel: '顺序',
    statusBarHeight: 20,
    seeking: false
  },

  onLoad(options) {
    const sys = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sys.statusBarHeight || 20 })

    const index = Number(options.index || 0)
    this.loadSong(index, true)
    this.bindAudioEvents()
  },

  onUnload() {
    this.clearTimer()
  },

  bindAudioEvents() {
    const app = getApp()
    const audio = app.globalData.audioManager
    if (!audio || this._bound) return
    this._bound = true

    audio.onPlay(() => {
      this.setData({ playing: true })
      this.startTimer()
    })
    audio.onPause(() => {
      this.setData({ playing: false })
      this.clearTimer()
    })
    audio.onStop(() => {
      this.setData({ playing: false, progress: 0 })
      this.clearTimer()
    })
    audio.onEnded(() => this.handleEnded())
    audio.onTimeUpdate(() => this.syncProgress())
    audio.onCanplay(() => this.syncProgress())
  },

  loadSong(index, autoPlay) {
    const app = getApp()
    const list = app.globalData.playlist.length ? app.globalData.playlist : playlist
    const song = list[index]
    if (!song) return

    app.globalData.currentIndex = index
    this.setData({
      song,
      index,
      durationText: formatTime(song.duration),
      currentTimeText: '0:00',
      progress: 0
    })

    if (autoPlay) {
      this.play(song)
    }
  },

  play(song) {
    const app = getApp()
    const audio = app.globalData.audioManager
    const target = song || this.data.song

    // 同一首歌继续播，不重新赋值 src（避免从头开始）
    if (audio.src === target.url && audio.paused) {
      audio.play()
      return
    }

    audio.title = target.title
    audio.singer = target.artist
    audio.coverImgUrl = target.cover
    audio.src = target.url
  },

  togglePlay() {
    const audio = getApp().globalData.audioManager
    if (!audio.src) {
      this.play(this.data.song)
      return
    }
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  },

  playPrev() {
    const list = getApp().globalData.playlist
    const len = list.length
    let next = this.data.index - 1
    if (next < 0) next = len - 1
    this.loadSong(next, true)
  },

  playNext() {
    const next = this.getNextIndex()
    this.loadSong(next, true)
  },

  getNextIndex() {
    const list = getApp().globalData.playlist
    const len = list.length
    const { mode, index } = this.data

    if (mode === 'shuffle') {
      if (len <= 1) return 0
      let n = Math.floor(Math.random() * len)
      while (n === index) n = Math.floor(Math.random() * len)
      return n
    }
    return (index + 1) % len
  },

  handleEnded() {
    if (this.data.mode === 'loop') {
      this.play(this.data.song)
      return
    }
    this.playNext()
  },

  toggleMode() {
    const i = MODES.indexOf(this.data.mode)
    const mode = MODES[(i + 1) % MODES.length]
    this.setData({ mode, modeLabel: MODE_LABELS[mode] })
  },

  startTimer() {
    this.clearTimer()
    this._timer = setInterval(() => this.syncProgress(), 500)
  },

  clearTimer() {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
  },

  syncProgress() {
    if (this.data.seeking) return
    const audio = getApp().globalData.audioManager
    const current = audio.currentTime || 0
    const duration = audio.duration || this.data.song.duration || 1
    const progress = Math.min(100, (current / duration) * 100)

    this.setData({
      progress,
      currentTimeText: formatTime(current),
      durationText: formatTime(duration),
      playing: !audio.paused
    })
  },

  onSeekChanging(e) {
    this.setData({ seeking: true, progress: e.detail.value })
  },

  onSeekChange(e) {
    const audio = getApp().globalData.audioManager
    const duration = audio.duration || this.data.song.duration || 0
    const value = e.detail.value
    const time = (value / 100) * duration

    audio.seek(time)
    this.setData({
      seeking: false,
      progress: value,
      currentTimeText: formatTime(time)
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
