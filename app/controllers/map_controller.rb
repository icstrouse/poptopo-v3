require "json"

class MapController < ApplicationController
  def index
    @tags = Tag.all.to_json
    @tracks = []
  end

  def tag
    tag = Tag.find(params[:id])
    tracks = tag.tracks

    @tags = [ tag ].to_json
    @tracks = tracks.map { |track|
      track_data = track.data.download
      { id: track.id, name: track.name, data: track_data }
    }.to_json
  end

  def track
    track = Track.find(params[:id])
    track_data = track.data.download

    @tags = [ track.tag ].to_json
    @tracks = [ { id: track.id, name: track.name, data: track_data } ].to_json
  end
end
