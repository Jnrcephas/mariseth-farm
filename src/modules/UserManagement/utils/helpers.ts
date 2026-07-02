export const useGroupPermissionMap = (
    defaultGroups: any[],
    permissions: any[],
  ) => {
    const brps = defaultGroups?.map((grp) => {
      const hasPermIds = grp?.permissions?.map((obj: any) => obj.id);
      const permsss = permissions?.map((perm) => ({
        ...perm,
        is_active: hasPermIds?.includes(perm.id) ? true : false,
      }));
      const setPerms = [...permsss];
      return { ...grp, permissions: setPerms };
    });
    return brps;
  };

  type Permission = {
    id: number;
    name: string;
    codename: string;
  };

  export const groupPermissionsByCodename = (
    permissions: Permission[]
  ): Record<string, Permission[]> => {
    return permissions.reduce((groups, permission) => {
      const [group] = permission.codename.split("|");
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  };

  export function formatPhoneNumberWithPlus(phone_number: string | "") {
  return phone_number ? `+${phone_number}` : "";
}

export function formatPhoneNumberWithOutPlus(phone_number: string | "") {
  return phone_number ? phone_number?.replace("+", "") : "";
}

export function formatPhoneNumberStartWithZero(phone_number: string | ""){
  if (phone_number){
  const cleanedValue = phone_number.replace(/[^0-9]/g, "");
    const phoneNumber = `0${cleanedValue.substring(cleanedValue.length - 9)}`;
    return phoneNumber
  }
  return ""
}
export function formatPhoneNumberStartWithZip(phone_number: string | ""){
  if (phone_number){
  const cleanedValue = phone_number.replace(/[^0-9]/g, "");
    const phoneNumber = `233${cleanedValue.substring(cleanedValue.length - 9)}`;
    return phoneNumber
  }
  return ""
}