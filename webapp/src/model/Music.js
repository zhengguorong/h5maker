/**
 * Created by tracy on 2017/7/18.
 */
export default class Music {
  constructor (music = {}) {
    this.name = music.name || null
    this.link = music.link || null
    this.isPlaying = music.isPlaying || false
  }
}
