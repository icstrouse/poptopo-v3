class CreateTags < ActiveRecord::Migration[8.0]
  def change
    create_table :tags do |t|
      t.string :name
      t.float :lat
      t.float :lng

      t.timestamps
    end
  end
end
