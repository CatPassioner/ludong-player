/**
 * 演示曲目（公开可访问的示例音频）
 * 可替换为你自己的音乐 CDN 地址
 */
const playlist = [
  {
    id: 1,
    title: '晨光序曲',
    artist: 'SoundHelix',
    cover: 'https://picsum.photos/seed/music1/600/600',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372
  },
  {
    id: 2,
    title: '城市夜行',
    artist: 'SoundHelix',
    cover: 'https://picsum.photos/seed/music2/600/600',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 427
  },
  {
    id: 3,
    title: '雨落窗台',
    artist: 'SoundHelix',
    cover: 'https://picsum.photos/seed/music3/600/600',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 350
  },
  {
    id: 4,
    title: '海边慢调',
    artist: 'SoundHelix',
    cover: 'https://picsum.photos/seed/music4/600/600',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 372
  },
  {
    id: 5,
    title: '山谷回声',
    artist: 'SoundHelix',
    cover: 'https://picsum.photos/seed/music5/600/600',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 350
  }
]

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r < 10 ? '0' : ''}${r}`
}

module.exports = {
  playlist,
  formatTime
}
