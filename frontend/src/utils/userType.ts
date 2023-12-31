export enum UserType {
    Admin = 0,
    Common = 1,
}

export const userTypeToString = (userType: UserType): string => {
    switch (userType) {
        case UserType.Admin:
            return 'Admin';
        case UserType.Common:
            return 'Common';
        default:
            return '';
    }
};