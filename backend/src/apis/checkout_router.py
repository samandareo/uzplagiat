import stripe
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from src.core.security import get_current_user_id
from src.config.settings import settings
from src.config.database import get_db
from src.apps.auth.model.user import User

stripe.api_key = settings.STRIPE_SECRET_KEY
router = APIRouter(prefix="/checkout", tags=["checkout"])

@router.post("/create-session")
async def create_checkout_session(user_id: str = Depends(get_current_user_id)):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "UzPlagiat Premium",
                            "description": "Unlimited checks and high priority processing.",
                        },
                        "unit_amount": 499, # $4.99
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=f"{settings.FRONTEND_URL}/billing?success=true",
            cancel_url=f"{settings.FRONTEND_URL}/billing?canceled=true",
            client_reference_id=user_id,
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        user_id_str = session.get("client_reference_id")
        
        if user_id_str:
            try:
                user_id = int(user_id_str)
                user = await db.get(User, user_id)
                if user:
                    user.is_premium = True
                    user.subscribed_at = datetime.utcnow()
                    await db.commit()
            except ValueError:
                pass # Invalid user ID format
                
    return {"status": "success"}
