# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Depends, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session


from schemas.job import JobCreate, JobUpdate, JobResponse
from models.job import Job
from models.company import Company
from database import get_db
from utils.oauth2 import get_current_user, rol_required

router = APIRouter(prefix="/job", tags=["job"])


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    # Validate that the company exists
    company = db.query(Company).filter(Company.id == job.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with ID {job.company_id} not found"
        )
    
    db_job = Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


@router.get("/", status_code=status.HTTP_200_OK, response_model=list[JobResponse])
def get_all_job(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    jobs = db.query(Job).all()
    return jobs


@router.get("/{job_id}", status_code=status.HTTP_200_OK, response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Not Found"
        )

    return job


@router.put("/{job_id}", status_code=status.HTTP_200_OK, response_model=JobResponse)
def update_job(job_id: int, job: JobUpdate, db: Session = Depends(get_db), current_user=Depends(rol_required(["admin","hr"]))):
    db_job = db.query(Job).filter(Job.id == job_id).first()

    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Not Found"
        )

    # Validate that the company exists if company_id is being updated
    if job.company_id is not None:
        company = db.query(Company).filter(Company.id == job.company_id).first()
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Company with ID {job.company_id} not found"
            )

    for key, value in job.dict(exclude_unset=True).items():
        if value is not None:
            setattr(db_job, key, value)

    db.commit()
    db.refresh(db_job)

    return db_job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db), current_user=Depends(rol_required(["admin","hr"]))):
    db_job = db.query(Job).filter(Job.id == job_id).first()

    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job Not Found"
        )

    db.delete(db_job)
    db.commit()

    return {"detail": "Job deleted successfully."}
