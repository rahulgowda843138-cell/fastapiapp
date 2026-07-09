import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div>

          <h2>Rahul Spark</h2>

          <p>
            AI Powered Recruitment Platform
          </p>

        </div>

        <div>

          <h4>Quick Links</h4>

          <ul>
            <li>Home</li>
            <li>Jobs</li>
            <li>Resume Analysis</li>
            <li>AI Chat</li>
          </ul>

        </div>

        <div>

          <h4>Contact</h4>

          <p>rahulgowda843138@gmail.com</p>

          <p>+91 8431380320</p>

        </div>

      </div>

      <hr />

      <p className="copyright">
        © 2026 TalentSpark. All Rights Reserved.
      </p>

    </footer>
  );
}

export default Footer;