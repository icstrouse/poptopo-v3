class Tag < ApplicationRecord
  has_many :tracks

  validates :name, :lat, :lng, presence: true
  validates :lat, :lng, numericality: true
end
