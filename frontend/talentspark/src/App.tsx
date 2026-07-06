// import Welcome from "./components/Welcome";
import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {useEffect,useState} from "react";
import { getCompanies,updateCompany,deleteCompany,createCompany } from "./Services/CompanyService";
import type {Company} from "./types/company"
import FloatingChat from "./components/FloatingChat";

function App(){
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error | null>(null)
  const [companies,setCompanies] = useState<Company[]>([]);
  const [token,setToken] = useState<string | null>(localStorage.getItem("token"));
  const [showRegister,setShowRegister] = useState(false);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(company:Company){
    try{
      const updatedCompany = await updateCompany(company.id,company);
      setCompanies(companies.map((company) => company.id === updatedCompany.id ? updatedCompany : company));
    }catch(error){
      setError(error as Error);
    }
  }

  async function handleDelete(id:number){
    try{
      await deleteCompany(id);
      setCompanies(companies.filter((company) => company.id !== id));
    }catch(error){
      setError(error as Error);
    }
  }

  async function handleAdd(company:Company){
    try{
      const newCompany = await createCompany(company);
      setCompanies([...companies,newCompany]);
    }catch(error){
      setError(error as Error);
    }
  }

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCompanies([]);
    setError(null);
  };

  useEffect(() => {
    if (token) {
      fetchCompanies();
    } else {
      setLoading(false);
    }
  }, [token]);
  
  if (!token) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  if(loading){
    return <div>Loading...</div>
  }

  if(error){
    return <div>Error: {error.message}</div>
  }
  
  return(
    <>
    <NavBar />
    {/* <Welcome /> */}
    <button onClick={handleLogout}>Logout</button>
    <br />
    <CompanyCard 
      companies={companies}
      onedit={handleEdit}
      ondelete={handleDelete}
      onadd={handleAdd}
    />
    <JobCard />
    <Footer />
    <FloatingChat />
    
    </>
  )
}

export default App