import logging
from uuid import uuid4
from db.database import user_collection


class User:
    @staticmethod
    def transform_user(user):
        """Transform MongoDB _id to id for consistency."""
        if user and "_id" in user:
            user["id"] = str(user.pop("_id"))
        return user

    @staticmethod
    def find_user_by_email(email: str):
        try:
            user = user_collection.find_one({"email": email})
            return User.transform_user(user)
        except Exception as e:
            logging.error(f"Error finding user by email: {e}")
            return None

    @staticmethod
    def find_user_by_uuid(uuid: str):
        try:
            user = user_collection.find_one({"uuid": uuid})
            return User.transform_user(user)
        except Exception as e:
            logging.error(f"Error finding user by UUID: {e}")
            return None

    @staticmethod
    def create_user(user_data: dict):
        try:
            existing_user = user_collection.find_one({"email": user_data["email"]})
            if existing_user:
                raise ValueError("A user with this email already exists.")

            user_data["uuid"] = str(uuid4())
            user_data["_id"] = str(uuid4())
            user_data["refresh_token"] = None
            user_collection.insert_one(user_data)
            logging.info(f"User created with UUID: {user_data['uuid']}")
            return User.transform_user(user_data)
        except Exception as e:
            logging.error(f"Error creating user: {e}")
            return None

    @staticmethod
    def update_user(user_id: str, user_data: dict):
        try:
            result = user_collection.update_one({"uuid": user_id}, {"$set": user_data})
            if result.matched_count == 0:
                logging.warning(f"User with uuid {user_id} not found for update")
                return None
            logging.info(f"User with UUID {user_id} updated successfully")
            user = user_collection.find_one({"uuid": user_id})
            return User.transform_user(user)
        except Exception as e:
            logging.error(f"Error updating user: {e}")
            return None


    @staticmethod
    def delete_user(user_id: str):
        try:
            result = user_collection.delete_one({"uuid": user_id})
            if result.deleted_count == 0:
                logging.warning(f"User with uuid {user_id} not found or already deleted")
                return False
            logging.info(f"User with UUID {user_id} deleted successfully")
            return True
        except Exception as e:
            logging.error(f"Error deleting user: {e}")
            return False

    @staticmethod
    def get_all_users():
        try:
            users = list(
                user_collection.find(
                    {}, {"_id": 0, "uuid": 1, "name": 1, "email": 1, "role": 1}
                )
            )
            return users
        except Exception as e:
            logging.error(f"Error retrieving all users: {e}")
            return []

    @staticmethod
    def get_user_by_id(user_id: str):
        try:
            user = user_collection.find_one(
                {"uuid": user_id}, {"_id": 0, "uuid": 1, "name": 1, "email": 1, "role": 1}
            )
            return user
        except Exception as e:
            logging.error(f"Error retrieving user by ID: {e}")
            return None

    @staticmethod
    def update_refresh_token(user_id: str, refresh_token: str):
        try:
            result = user_collection.update_one(
                {"uuid": user_id}, {"$set": {"refresh_token": refresh_token}}
            )
            if result.matched_count == 0:
                logging.warning(
                    f"User with uuid {user_id} not found for refresh token update"
                )
                return None
            logging.info(f"Refresh token updated for user with UUID {user_id}")
            user = user_collection.find_one({"uuid": user_id})
            return User.transform_user(user)
        except Exception as e:
            logging.error(f"Error updating refresh token: {e}")
            return None

    @staticmethod
    def get_refresh_token(user_id: str):
        try:
            user = user_collection.find_one({"uuid": user_id}, {"refresh_token": 1})
            if not user:
                logging.warning(
                    f"User with uuid {user_id} not found for refresh token retrieval"
                )
                return None
            return user.get("refresh_token")
        except Exception as e:
            logging.error(f"Error retrieving refresh token: {e}")
            return None

    @staticmethod
    def delete_refresh_token(user_id: str):
        try:
            result = user_collection.update_one(
                {"uuid": user_id}, {"$set": {"refresh_token": None}}
            )
            if result.matched_count == 0:
                logging.warning(
                    f"User with uuid {user_id} not found for refresh token deletion"
                )
                return None
            logging.info(f"Refresh token deleted for user with UUID {user_id}")
            user = user_collection.find_one({"uuid": user_id})
            return User.transform_user(user)
        except Exception as e:
            logging.error(f"Error deleting refresh token: {e}")
            return None
