class Track < ApplicationRecord
  belongs_to :tag
  has_one_attached :data

  validates :name, :data, presence: true
end
