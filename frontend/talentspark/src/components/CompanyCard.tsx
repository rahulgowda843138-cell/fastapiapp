//import { getCompanies } from "../Services/CompanyService";
//import { useEffect, useState} from "react";
import type {Company} from "../types/company";

type Props = {
    companies:Company[];

}

function CompanyCard( {
    companies}:Props){
    //companies, setCompanies] = useState<Company[]>([]);
    //unction fetchCompanies() {
    //st companies = await getCompanies();
    //Companies(companies);
    //
    //ct(() => {
    //chCompanies();
    //
    return (
        <div>
            {companies.map((company) => (
                <div key={company.id}>
                    <h1>{company.name}</h1>
                    <p>Email: {company.email}</p>
                    <p>Phone: {company.phone}</p>
                    <p>Location: {company.location}</p>
                    <hr></hr>
                </div>
            ))}
        </div>
    )
}

export default CompanyCard