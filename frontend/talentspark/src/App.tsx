import NavBar from "./components/NavBar";
import Welcome from "./components/Welcome";
import Footer from "./components/Footer";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import {useEffect, useState} from "react";
import { getCompanies } from "./Services/CompanyService";
import type {Company} from "./types/company";


function App()
{
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    useEffect(() => {
      fetchCompanies();
    }, []);
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
    <NavBar/>
    <Welcome/>
    <CompanyCard key={companies.id}
    companies={companies}/>
    <JobCard/>
    <Footer/>
    </>
  )
}

export default App