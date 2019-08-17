class ThingTypesController < ApplicationController
    include ActionController::Helpers
    helper ThingsHelper
    wrap_parameters :thing_type, include: ["type_id", "thing_id", "priority"]
    before_action :get_thing, only: [:index, :update, :destroy]
    before_action :get_type, only: [:type_things]
    before_action :get_thing_type, only: [:update, :destroy]
    before_action :authenticate_user!, only: [:create, :update, :destroy]
    after_action :verify_authorized, except: [:subjects]
    #after_action :verify_policy_scoped, only: [:linkable_things]
    before_action :origin, only: [:subjects]
  
    def index
      authorize @thing, :get_types?
      @thing_types = @thing.thing_types.prioritized.with_label
    end
  
    def type_things
      authorize @type, :get_things?
      @thing_types=@type.thing_types.prioritized.with_name
      render :index 
    end
  
    def linkable_things
      authorize Thing, :get_linkables?
      type = Type.find(params[:type_id])
      #@things=policy_scope(Thing.not_linked(type))
      #need to exclude admins from seeing things they cannot link
      @things=Thing.not_linked_type(type)
      @things=ThingPolicy::Scope.new(current_user,@things).user_roles(true,false)
      @things=ThingPolicy.merge(@things)
    #
      # pp @things.map{|r|r.attributes}
    # 
      render "things/index"
    end
  
    def subjects
      expires_in 1.minute, :public=>true
      miles=params[:miles] ? params[:miles].to_f : nil
      subject=params[:subject]
      distance=params[:distance] ||= "false"
      reverse=params[:order] && params[:order].downcase=="desc"  #default to ASC
      last_modified=ThingType.last_modified
      state="#{request.headers['QUERY_STRING']}:#{last_modified}"
      #use eTag versus last_modified -- ng-token-auth munges if-modified-since
      eTag="#{Digest::MD5.hexdigest(state)}"
  
      if stale?  :etag=>eTag
        @thing_types=ThingType.within_range(@origin, miles, reverse)
          .with_name
          .with_label
          .with_position
        @thing_types=@thing_types.things    if subject && subject.downcase=="thing"
        @thing_types=ThingType.with_distance(@origin, @thing_types) if distance.downcase=="true"
        render "thing_types/index"
      end
    end
  
    def create
      thing_type = ThingType.new(thing_type_create_params.merge({
                                    :type_id=>params[:type_id],
                                    :thing_id=>params[:thing_id],
                                    }))
      thing=Thing.where(id:thing_type.thing_id).first
      if !thing
        full_message_error "cannot find thing[#{params[:thing_id]}]", :bad_request
        skip_authorization
      elsif !Type.where(id:thing_type.type_id).exists?
        full_message_error "cannot find type[#{params[:type_id]}]", :bad_request
        skip_authorization
      else
        authorize thing, :add_type?
        thing_type.creator_id=current_user.id
        if thing_type.save
          head :no_content
        else
          render json: {errors:@thing_type.errors.messages}, status: :unprocessable_entity
        end
      end
    end
  
    def update
      authorize @thing, :update_type?
      if @thing_type.update(thing_type_update_params)
        head :no_content
      else
        render json: {errors:@thing_type.errors.messages}, status: :unprocessable_entity
      end
    end
  
    def destroy
      authorize @thing, :remove_type?
      @thing_type.type.touch #type will be only thing left
      @thing_type.destroy
      head :no_content
    end
  
    private
      def get_thing
        @thing ||= Thing.find(params[:thing_id])
      end
      def get_type
        @type ||= Type.find(params[:type_id])
      end
      def get_thing_type
        @thing_type ||= ThingType.find(params[:id])
      end
  
      def thing_type_create_params
        params.require(:thing_type).tap {|p|
            #_ids only required in payload when not part of URI
            p.require(:type_id)    if !params[:type_id]
            p.require(:thing_id)    if !params[:thing_id]
          }.permit(:priority, :type_id, :thing_id)
      end
      def thing_type_update_params
        params.require(:thing_type).permit(:priority)
      end
  
      def origin
        case
        when params[:lng] && params[:lat]
          @origin=Point.new(params[:lng].to_f, params[:lat].to_f)
        else
          raise ActionController::ParameterMissing.new(
            "an origin [lng/lat] required")
        end
      end
  end
  