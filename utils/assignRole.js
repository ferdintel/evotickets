// utils/assignRole.js
import Parse from './parseConfig';

export const assignRole = async (username, roleName) => {
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('username', username);
  const user = await userQuery.first();

  if (!user) {
    throw new Error('User not found');
  }

  const roleQuery = new Parse.Query(Parse.Role);
  roleQuery.equalTo('name', roleName);
  let role = await roleQuery.first();

  if (!role) {
    // Create role if it doesn't exist
    const roleACL = new Parse.ACL();
    roleACL.setPublicReadAccess(true);
    roleACL.setPublicWriteAccess(false);
    const Role = Parse.Object.extend('_Role');
    role = new Role();
    role.set('name', roleName);
    role.setACL(roleACL);
    await role.save();
  }

  role.getUsers().add(user);
  await role.save();
};
