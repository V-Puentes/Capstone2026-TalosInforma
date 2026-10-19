from fastapi import APIRouter

router = APIRouter(prefix="/api/public", tags=["Public"])

@router.get("/events/feed")
def get_feed():
    return {"message": "Endpoint de Feed de Eventos - En construcción"}

@router.get("/events/{evento_id}")
def get_event_detail(evento_id: str):
    return {"message": f"Detalle del evento {evento_id} - En construcción"}