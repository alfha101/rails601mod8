class Thing < ActiveRecord::Base
  include Protectable
  validates :name, :presence=>true

  has_many :thing_images, inverse_of: :thing, dependent: :destroy

  scope :not_linked, ->(image) { where.not(:id=>ThingImage.select(:thing_id)
                                                          .where(:image=>image)) }

  scope :not_linked_type, ->(type) { where.not(:id=>ThingType.select(:thing_id)
                                                          .where(:type=>type))
                                                         }
end
