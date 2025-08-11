# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

Track.destroy_all
Tag.destroy_all

Tag.create!([
  {
    name: "Bear Peak",
    lat: 39.961287931115216,
    lng: -105.29525181844889
  },
  {
    name: "Green Mountain",
    lat: 39.98234825440146,
    lng: -105.3016326054974
  }
])
p "Created #{Tag.count} Tags"
