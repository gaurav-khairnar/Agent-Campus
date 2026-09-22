import jwt as pyjwt
from config import get_settings
from edu_core.schemas.users import UserDto
from edu_core.services import UserService
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
) -> UserDto:
    """
    Get the current authenticated user from Supabase JWT token.
    Decodes identity, role, and institution scope from database.
    """
    settings = get_settings()
    supabase_jwt_secret = settings.supabase_jwt_secret

    if not supabase_jwt_secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase JWT secret not configured",
        )

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        try:
            unverified_header = pyjwt.get_unverified_header(token)
            alg = unverified_header.get("alg")
        except Exception:
            alg = "HS256"

        if alg.startswith("HS"):
            payload = pyjwt.decode(
                token,
                supabase_jwt_secret,
                algorithms=["HS256", "HS384", "HS512"],
                options={"verify_aud": False},
            )
        else:
            supabase_url = settings.supabase_url
            if not supabase_url:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="SUPABASE_URL must be configured for asymmetric JWT verification",
                )

            jwks_url = f"{supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
            jwks_client = pyjwt.PyJWKClient(jwks_url)
            signing_key = jwks_client.get_signing_key_from_jwt(token)

            payload = pyjwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256", "RS256"],
                options={"verify_aud": False},
            )

        supabase_user_id = payload.get("sub")
        if not supabase_user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
            )

        email = payload.get("email")
        user_metadata = payload.get("user_metadata", {})
        name = user_metadata.get("name") or user_metadata.get("full_name")
        if not name and email:
            name = email.split("@")[0]

        user_service = UserService()
        user_dto = user_service.get_or_create_user_from_token(
            user_id=supabase_user_id,
            email=email,
            name=name,
        )

        return user_dto

    except pyjwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except pyjwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e!s}",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {e!s}",
        )


def require_roles(allowed_roles: list[str]):
    """
    FastAPI dependency factory enforcing strict RBAC.
    """
    def role_checker(current_user: UserDto = Depends(get_current_user)) -> UserDto:
        user_role = (current_user.role or "student").lower()
        allowed = [r.lower() for r in allowed_roles]
        if user_role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Role '{user_role}' is not authorized. Required: {allowed_roles}",
            )
        return current_user

    return role_checker


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
) -> UserDto | None:
    if not credentials:
        return None

    settings = get_settings()
    jwt_secret = settings.supabase_jwt_secret
    if not jwt_secret:
        return None

    try:
        return get_current_user(credentials)
    except HTTPException:
        return None
