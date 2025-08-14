# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

Track.destroy_all
Tag.destroy_all

Tag.create!([
  {
    name: "Walker Ranch Trailhead",
    lat: 39.95120242079443,
    lng: -105.33758684999596
  },
  {
    name: "Green Mountain",
    lat: 39.98234825440146,
    lng: -105.3016326054974
  }
])
p "Created #{Tag.count} Tags"

morning_run = Track.create(name: "Walker Ranch Trail Run", tag_id: Tag.first.id)
morning_run.data.attach(io: File.open(Rails.root.join("db", "tracks", "morning_run.geojson")), filename: "morning_run.geojson")
morning_run.save!

morning_hike_1 = Track.create(name: "Green Mountain West Ridge", tag_id: Tag.second.id)
morning_hike_1.data.attach(io: File.open(Rails.root.join("db", "tracks", "morning_hike_1.geojson")), filename: "morning_hike_1.geojson")
morning_hike_1.save!

morning_hike_2 = Track.create(name: "Green Mountain Ranger Trail", tag_id: Tag.second.id)
morning_hike_2.data.attach(io: File.open(Rails.root.join("db", "tracks", "morning_hike_2.geojson")), filename: "morning_hike_2.geojson")
morning_hike_2.save!
p "Created #{Track.count} Tracks"
