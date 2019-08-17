class CreateTypes < ActiveRecord::Migration
  def change
    create_table :types do |t|
      t.string :label, {null: false}
      t.integer :creator_id, {null: false}

      t.timestamps null: false

    end
    add_index :types, :creator_id
  end
end
