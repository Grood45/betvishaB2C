const GetAdminLayerPermission = (role_type) => {
    switch (role_type) {
      case "owneradmin":
        return [
          "admin",
        ];
      case "admin":
        return [];
      case "subadmin":
        return [];
      case "manager":
        return [];
      case "affiliate":
        return [];
      case "agent":
        return [];
      case "subagent":
        return [];
      case "support":
        return [];
      case "billing":
        return [];
      case "player":
        return [];
      default:
        return []; // Return an empty array for unknown roles
    }
  };

  module.exports={ GetAdminLayerPermission }