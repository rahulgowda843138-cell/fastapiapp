# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Depends, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

# pyrefly: ignore [missing-import]
from sqlalchemy.future import select
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import selectinload

from schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse
from models.company import Company
from database import get_db
from utils.oauth2 import get_current_user

router = APIRouter(
    prefix="/company",
    tags=["company"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=CompanyResponse
)
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)):
    try:
        db_company = Company(**company.dict())

        db.add(db_company)
        db.commit()
        db.refresh(db_company)
        return db_company
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred while creating company: {str(e)}"
        )


@router.get(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=list[CompanyResponse]
)
def get_all_company(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)):
    try:
        result = db.execute(select(Company).options(selectinload(Company.jobs)))
        companies = result.scalars().all()
        return companies
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred while fetching companies: {str(e)}"
        )


@router.get(
    "/{company_id}",
    status_code=status.HTTP_200_OK,
    response_model=CompanyResponse
)
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)):
    try:
        result = db.execute(select(Company).filter(Company.id == company_id))
        company = result.scalars().first()

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        return company
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred while fetching company: {str(e)}"
        )


@router.put(
    "/{company_id}",
    status_code=status.HTTP_200_OK,
    response_model=CompanyResponse
)               
def update_company(
    company_id: int,
    company: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)):
    try:
        result = db.execute(select(Company).filter(Company.id == company_id))
        db_company = result.scalars().first()

        if not db_company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found"
            )
        for key, value in company.dict().items():
            setattr(db_company, key, value)

        db.commit()
        db.refresh(db_company)
        return db_company
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred while updating company: {str(e)}"
        )


@router.delete(
    "/{company_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)):
    try:
        result = db.execute(select(Company).filter(Company.id == company_id))
        db_company = result.scalars().first()

        if not db_company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )

        db.delete(db_company)
        db.commit()
        return 
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error occurred while deleting company: {str(e)}"
        )