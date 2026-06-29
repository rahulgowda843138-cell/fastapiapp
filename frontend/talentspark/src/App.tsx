import Welcome from "./components/welcome";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
function App(){
  return(
    <>
    <NavBar/>
    <Welcome/>
    <CompanyCard/>
    <JobCard/>
    <Footer/>
    </>
  )

}
export default App