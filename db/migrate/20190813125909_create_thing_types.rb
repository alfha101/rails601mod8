class CreateThingTypes < ActiveRecord::Migration
  def change
    create_table :thing_types do |t|
      t.references :thing, index: true, foreign_key: true, null: false
      t.references :type, index: true, foreign_key: true, null: false
      t.integer :priority, {null:false, default:5}
      t.integer :creator_id, {null: false}

      t.timestamps null: false
    end
    add_index :thing_types, [:type_id, :thing_id], unique: true
  end
end
