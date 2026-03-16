from fastapi import APIRouter, HTTPException
from app.schemas.auth_schema import LoginRequest, SignupRequest, AuthResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

# In-memory user store (replace with a real DB later)
_users: dict[str, dict] = {}
_next_id = 1


@router.post("/signup", response_model=AuthResponse)
def signup(req: SignupRequest):
    global _next_id

    if req.email in _users:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = {
        "id": str(_next_id),
        "name": req.name,
        "email": req.email,
        "password": req.password,  # plain-text for now; hash in production
    }
    _users[req.email] = user
    _next_id += 1

    return AuthResponse(
        token=f"token-{user['id']}",
        user=UserOut(id=user["id"], name=user["name"], email=user["email"]),
    )


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    user = _users.get(req.email)

    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return AuthResponse(
        token=f"token-{user['id']}",
        user=UserOut(id=user["id"], name=user["name"], email=user["email"]),
    )
