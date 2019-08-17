class Type < ActiveRecord::Base
    include Protectable
    validates :label, :presence=>true
  
    has_many :thing_types, inverse_of: :thing, dependent: :destroy


end
