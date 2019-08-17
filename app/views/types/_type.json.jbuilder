json.extract! type, :id, :label, :creator_id, :created_at, :updated_at
json.url type_url(type, format: :json)
json.user_roles type.user_roles     unless type.user_roles.empty?
