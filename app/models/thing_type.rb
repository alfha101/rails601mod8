class ThingType < ActiveRecord::Base
  belongs_to :thing
  belongs_to :type

  acts_as_mappable :through => :type

  validates :type, :thing, presence: true

  scope :prioritized,-> { order(:priority=>:asc) }
  scope :things,     -> { where(:priority=>0) }
  scope :primary,    -> { where(:priority=>0).first }

  scope :with_thing, ->{ joins("left outer join things on things.id = thing_types.thing_id")
                          .select("thing_types.*")}
    scope :with_type, ->{ joins("right outer join types on types.id = thing_types.type_id")
                          .select("thing_types.*","types.id as type_id")}

  scope :with_name,    ->{ with_thing.select("things.name as thing_name")}
  scope :with_label, ->{ with_type.select("types.label as type_label")}

end
