from fastapi import APIRouter, Depends
from controllers.users import getUsers, getUserById, createUser, updateUser, deleteUser
from middleware.authuser import verify_user, admin_only


router = APIRouter()

router.get("/users", dependencies=[Depends(verify_user), Depends(admin_only)])(getUsers)
router.get("/users/{id}", dependencies=[Depends(verify_user), Depends(admin_only)])(getUserById)
router.post("/users", dependencies=[Depends(verify_user), Depends(admin_only)])(createUser)
router.patch("/users/{id}", dependencies=[Depends(verify_user), Depends(admin_only)])(updateUser)
router.delete("/users/{id}", dependencies=[Depends(verify_user), Depends(admin_only)])(deleteUser)



# The following commented-out lines are examples without authentication or authorization dependencies.
# These can be used if you want to expose the endpoints without restrictions.

# router.get('/users')(getUsers)
# router.get('/users/{id}')(getUserById)
# router.post('/users')(createUser)
# router.patch('/users/{id}')(updateUser)
# router.delete('/users/{id}')(deleteUser)
