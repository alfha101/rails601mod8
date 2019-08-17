json.array!(@thing_types) do |ti|
    json.extract! ti, :id, :thing_id, :type_id, :priority, :creator_id, :created_at, :updated_at
    json.thing_name ti.thing_name        if ti.respond_to?(:thing_name)
    json.type_label ti.type_label  if ti.respond_to?(:type_label)
    # json.type_content_url type_content_url(ti.type_id)    if ti.type_id
  
    # if ti.respond_to?(:lng) && ti.lng
    #   json.position do
    #     json.lng ti.lng
    #     json.lat ti.lat
    #   end
    # end
    # if ti.respond_to?(:distance) && ti.distance && ti.distance >= 0
    #   json.distance ti.distance.to_f
    # end
  end
  