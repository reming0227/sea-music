export interface requestActionType {
  type: string,
  payload: object
}

export interface songTrack {
  id: number,
  name: string,
  player: string,
  picUrl: string,
  source: string,
  dt: number
}

export interface curSongInfoType extends songTrack {
  status: boolean
}