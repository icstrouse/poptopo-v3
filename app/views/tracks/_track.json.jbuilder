json.extract! track, :id, :name, :data, :tag_id, :created_at, :updated_at
json.url track_url(track, format: :json)
json.data url_for(track.data)
