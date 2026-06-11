from pydantic import BaseModel
from typing import Optional, Literal

class Filter(BaseModel):
    search: Optional[str] = None
    page_size: Optional[int] = None
    page_index: Optional[int] = None
    sort_by: Optional[str] = None
    sort_order: Optional[Literal['ASC', 'DESC']] = None