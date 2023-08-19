export const genSuccessAuthResObj = (session) => {
  if (!session?.user?.role)
    return {
      success: true,
      isAuthenticated: false,
    };
  return {
    success: true,
    isAuthenticated: true,
    authUser: {
      _id: session?.user?._id,
      role: session?.user?.role,
      firstName: session?.user?.firstName,
      lastName: session?.user?.lastName,
      email: session?.user?.email,
    },
  };
};

export const addUserToSession = (session, userDoc) => {
  session.user = {
    _id: userDoc._id.toString(),
    role: userDoc.userRole,
    firstName: userDoc.firstName,
    lastName: userDoc.lastName,
    email: userDoc.email,
  };
};

export const checkAuthentication = (req) => {
  return req?.session?.user ? true : false;
};
