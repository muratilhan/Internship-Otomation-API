import UserRoles from "../config/rolesList";

export const isDeletedQueryControl = () => {
  return { isDeleted: false };
};

export const createdByQueryMutation = (userId) => {
  return {
    createdBy: {
      connect: {
        id: userId,
      },
    },
  };
};

export const updatedByQueryMutation = (userId) => {
  return {
    updatedBy: {
      connect: {
        id: userId,
      },
    },
  };
};

export const isSealedQueryCheck = (role, isSealed) => {
  return role === UserRoles.student && isSealed;
};

export const releatedRecordQueryControl = (role, userId) => {
  if (role === UserRoles.student) {
    return { id: userId };
  } else return {};
};
