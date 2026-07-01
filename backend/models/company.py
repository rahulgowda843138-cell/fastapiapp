from sqlalchemy import Column,Integer,String,ForeignKey,Enum
from sqlalchemy.orm import relationship
from database import Base,engine,SessionLocal


class Company(Base):
    __tablename__="companies"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String,nullable=False,index=True)
    email = Column(String,unique=True)
    phone = Column(String,unique=True)
    location = Column(String)
    jobs = relationship("Job",back_populates="company")
