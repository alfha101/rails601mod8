class TypePolicy < ApplicationPolicy
    def index?
      true
    end

    def show?
      true
    end
    
    def create?
      @user
    end
    
    def update?
      organizer?
    end
    
    def destroy?
      organizer_or_admin?
    end
  
    def get_things?
      true
    end
  
    class Scope < Scope
      def user_roles
        joins_clause=["left join Roles r on r.mname='Type'",
                      "r.mid=Types.id",
                      "r.user_id #{user_criteria}"].join(" and ")
        scope.select("Types.*, r.role_name")
             .joins(joins_clause)
      end
  
      def resolve
        user_roles
      end
    end
  end
  