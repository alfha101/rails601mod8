class TypesController < ApplicationController
  before_action :set_type, only: [:show, :update, :destroy]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  wrap_parameters :type, include: ["label"]
  after_action :verify_authorized, except: [:content]
  after_action :verify_policy_scoped, only: [:index]
  
  
    def index
      authorize Type
      types = policy_scope(Type.all)
      pp types.map{|r|r.attributes}
      @types = TypePolicy.merge(types)
    end
  
    def show
      # byebug
      authorize @type
      types = policy_scope(Type.where(:id=>@type.id))
     #
      # pp types.map{|r|r.attributes}
     #
      @type = TypePolicy.merge(types).first
    end
  
    def create
      authorize Type
      @type = Type.new(type_params)
      @type.creator_id=current_user.id
  
      User.transaction do
        if @type.save
          role=current_user.add_role(Role::ORGANIZER,@type)
          @type.user_roles << role.role_name
          role.save!
          render :show, status: :created, location: @type
        else
          render json: {errors:@type.errors.messages}, status: :unprocessable_entity
        end
      end
    end
  
    def update
      authorize @type
  
      if @type.update(type_params)
        head :no_content
      else
        render json: {errors:@type.errors.messages}, status: :unprocessable_entity
      end
    end
  
    def destroy
      authorize @type
      @type.destroy
  
      head :no_content
    end
  
    private
  
      def set_type
        @type = Type.find(params[:id])
      end
  
      def type_params
        params.require(:type).tap {|p|
            p.require(:label) #throws ActionController::ParameterMissing
          }.permit(:label)
      end
  end
  