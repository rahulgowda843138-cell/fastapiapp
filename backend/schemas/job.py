from pydantic import BaseModel, ConfigDict
from typing import Optional


class JobBase(BaseModel):
    title:str
    salary:Optional[int]=None
    description:Optional[str]=None
    company_id:Optional[int]=None

class JobCreate(JobBase):
    pass

class JobUpdate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    model_config = ConfigDict(from_attributes=True)