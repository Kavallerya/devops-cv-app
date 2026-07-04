from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import ContactMessage
from app.schemas import ContactRequest, ContactResponse

router = APIRouter()


@router.post("/contact", response_model=ContactResponse)
async def create_contact_message(
    payload: ContactRequest,
    db: AsyncSession = Depends(get_db),
):
    message = ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)

    return ContactResponse(
        id=message.id,
        message="Thank you! Your message has been received.",
    )
