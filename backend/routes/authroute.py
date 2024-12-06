from fastapi import APIRouter
from controllers.auth import login, logout, me, refresh_token  

router = APIRouter()


router.post("/login")(login)
router.delete("/logout")(logout)
router.get("/me")(me)
router.post("/refresh")(refresh_token)  
