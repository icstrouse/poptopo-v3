require "json"

class MapController < ApplicationController
  def index
    @tags = Tag.all.to_json
  end

  def tag
    @tag = Tag.find(params[:id]).to_json
  end

  def track
    @track = Track.find(params[:id]).to_json
  end
end
