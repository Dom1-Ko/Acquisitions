import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error('Error getting users ', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1); // limit to stop searching else will continue to iterate through db, not good for large dbs

    if (!user) {
      throw new Error('No corresponding user to user id');
    }

    return user;
  } catch (e) {
    logger.error('Error finding user by id ', e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // chk if user exists
    const existingUser = await getUserById(id);

    //chk if email was given and was unchanged
    if (updates.email && updates.email !== existingUser.email) {
      // chk if new email is the email of an existing user
      const [emailExists] = await db
        .select()
        .from(users)
        .where(eq(users.email, updates.email))
        .limit(1);

      if (emailExists) {
        throw new Error('Email already exist in database');
      }
    }

    // Updated time stamp
    const updateData = {
      ...updates,
      updated_at: new Date(),
    };

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    logger.info(`User ${updatedUser.email} data updated successfully`);
    return updatedUser;
  } catch (e) {
    logger.error('Erorr updating user data ', e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    // chk if user exists
    await getUserById(id);

    // delete user
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    logger.info(`User ${deletedUser.email} was deleted succesfully`);
    return deletedUser;
  } catch (e) {
    logger.error('Failed to delete user ', e);
    throw e;
  }
};
