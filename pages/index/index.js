const { playlist, formatTime } = require('../../utils/music')

Page({
  data: {
    playlist: [],
    currentIndex: -1,
    currentSong: null,
    playing: false
  },

  onLoad() {
    const app = getApp()
    app.globalData.playlist = playlist

    this.setData({
      playlist: playlist.map((song) => ({
        ...song,
        durationText: formatTime(song.duration)
      }))
    })

    this.bindAudioEvents()
  },

  onShow() {
    const app = getApp()
    const { currentIndex } = app.globalData
    const audio = app.globalData.audioManager
    const playing = !!(audio && !audio.paused && audio.src)

    this.setData({
      currentIndex,
      currentSong: currentIndex >= 0 ? playlist[currentIndex] : null,
      playing
    })
  },

  bindAudioEvents() {
    const app = getApp()
    const audio = app.globalData.audioManager
    if (!audio || this._bound) return
    this._bound = true

    audio.onPlay(() => this.setData({ playing: true }))
    audio.onPause(() => this.setData({ playing: false }))
    audio.onStop(() => this.setData({ playing: false }))
    audio.onEnded(() => this.playNext())
  },

  playSong(e) {
    const index = e.currentTarget.dataset.index
    this.startPlay(index)
    wx.navigateTo({ url: `/pages/player/player?index=${index}` })
  },

  goPlayer() {
    if (this.data.currentIndex < 0) return
    wx.navigateTo({
      url: `/pages/player/player?index=${this.data.currentIndex}`
    })
  },

  togglePlay() {
    const app = getApp()
    const audio = app.globalData.audioManager
    if (!audio || !audio.src) {
      this.startPlay(0)
      return
    }
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  },

  startPlay(index) {
    const app = getApp()
    const song = playlist[index]
    if (!song) return

    const audio = app.globalData.audioManager
    app.globalData.currentIndex = index

    audio.title = song.title
    audio.singer = song.artist
    audio.coverImgUrl = song.cover
    audio.src = song.url

    this.setData({
      currentIndex: index,
      currentSong: song,
      playing: true
    })
  },

  playNext() {
    const app = getApp()
    const next = (app.globalData.currentIndex + 1) % playlist.length
    this.startPlay(next)
  }
})
