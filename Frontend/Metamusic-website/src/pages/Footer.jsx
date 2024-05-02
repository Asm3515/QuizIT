import { FaFacebookF, FaLinkedinIn, FaGithub, FaBehance, FaPinterestP } from 'react-icons/fa';

function ContactArea() {
  return (
    <section className="contact-area" id="contact" style={{padding: '60px 0', borderBottom: '1px solid #353C46'}}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="contact-content text-center">
              <a href="#"><img src="https://i.ibb.co/QDy827D/ak-logo.png" alt="logo" style={{maxWidth: '210px'}} /></a>
              <p style={{fontSize: '15px', margin: '30px 0 60px', position: 'relative'}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum 
                <span style={{background: '#353C46', bottom: '-30px', content: "", height: '1px', left: '50%', position: 'absolute', transform: 'translate(-50%)', width: '80%'}}></span>
              </p>
              <h6 style={{color: '#8b9199', fontSize: '15px', fontWeight: '400', marginBottom: '10px'}}>1120 Lorem ipsum dolor sit amet, KC 179050, Chandigarh.</h6>
              <h6 style={{color: '#8b9199', fontSize: '15px', fontWeight: '400'}}>+01 2345 6789 12<span style={{color: '#353c47', margin: '0 10px'}}>|</span>+01 2345 6789 12</h6>
              <div className="contact-social" style={{marginTop: '30px'}}>
                <ul style={{margin: '0', padding: '0', listStyle: 'none', display: 'inline-flex'}}>
                  <li><a className="hover-target" href=""><FaFacebookF style={{border: '1px solid #8b9199', color: '#8b9199', display: 'inline-block', height: '40px', margin: '0 10px', paddingTop: '7px', transition: 'all 0.4s ease 0s', width: '40px'}} /></a></li>
                  <li><a className="hover-target" href=""><FaLinkedinIn style={{border: '1px solid #8b9199', color: '#8b9199', display: 'inline-block', height: '40px', margin: '0 10px', paddingTop: '7px', transition: 'all 0.4s ease 0s', width: '40px'}} /></a></li>
                  <li><a className="hover-target" href=""><FaGithub style={{border: '1px solid #8b9199', color: '#8b9199', display: 'inline-block', height: '40px', margin: '0 10px', paddingTop: '7px', transition: 'all 0.4s ease 0s', width: '40px'}} /></a></li>
                  <li><a className="hover-target" href=""><FaBehance style={{border: '1px solid #8b9199', color: '#8b9199', display: 'inline-block', height: '40px', margin: '0 10px', paddingTop: '7px', transition: 'all 0.4s ease 0s', width: '40px'}} /></a></li>
                  <li><a className="hover-target" href=""><FaPinterestP style={{border: '1px solid #8b9199', color: '#8b9199', display: 'inline-block', height: '40px', margin: '0 10px', paddingTop: '7px', transition: 'all 0.4s ease 0s', width: '40px'}} /></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{background: '#1A1E25', color: '#868c96'}}>
      <p style={{padding: '40px 0', textAlign: 'center'}}>
        Copyright &copy; 2024  All Rights Reserved.
      </p>
    </footer>
  );
}

export { ContactArea, Footer };
