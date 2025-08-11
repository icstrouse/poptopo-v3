class CreateTracks < ActiveRecord::Migration[8.0]
  def change
    create_table :tracks do |t|
      t.string :name
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
