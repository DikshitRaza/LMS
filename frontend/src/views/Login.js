import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './login.css';

function Login() {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
 
  const cookies = new Cookies();

  const submit = async (e) => {
  
    e.preventDefault();

    // Add a validation check for empty email or password
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
        category,
      });

      if (response.data.message === "Login successful") {
        cookies.set("user", email,category, { path: "/" });
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("category", category);
        history("/admin", { state: { id: email } });
      } else if (response.data.message === "User not found") {
        alert("User not found");
      } else if (response.data.message === "Invalid password") {
        alert("Invalid password");
      }
    } catch (error) {
      alert("Error occurred. Please check your details and try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="logo-container">
          <img src="data:image/png;base64,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" alt="Logo" className="logo" />
          <h1>Library Management System</h1>
        </div>
      </header>
      <nav className="navbar">
        <a href="#home">Home</a>
        <a href="#gallery">Gallery</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#plans">Plans</a>
        <a href="#about">About</a>
        <a href="#contact-us">Contact Us</a>
      </nav>
      <div className="content-container">
        <div className="book-image">
          <img src="https://i0.wp.com/stanzaliving.wpcomstaging.com/wp-content/uploads/2022/04/fc23e-library-in-jaipur.jpg?fit=1000%2C667&ssl=1" alt="Person touching a virtual screen" height="400" width="650" />
        </div>
        <div className="login-container">
          <div className="login-form">
            <img  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAKsAtgMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAAAQUGBwIDBAj/xABLEAABAwIDBAUGCQkHBAMAAAABAAIDBBEFEiEGEzFBByJRYXEjM4GRobEUMjRCUnKSwdEVFyQ2U2J0gsIWVHOUsrPSg5Oi4Qg1Q//EABoBAAIDAQEAAAAAAAAAAAAAAAADAgQFAQb/xAAyEQACAQMDAgMFBwUAAAAAAAAAAQIDBBESITEFQTJRYRQiUnGhBhNCYpHR4RUWM7HB/9oADAMBAAIRAxEAPwC5nMc55cGkgnit0j2uYWtNyeASCVrBkN7jRYNidGc7rWHYgAhBjcS8ZRa2qWbyhBZ1rdiV7hOMrOI11Qw7gWfz7EAZROaxga42I5Facjt5msbXvdZOjdKc7bWPaontd0hYZs+H0cDfhuItGUwsdZsZ/fdy8Br4cVKMJTeInG0uSXVEse5cS9oAFySbABQrFekvAcJc9lO+TEJuGWmAyDxedPVdVJj+0uK7QSE4jVF0V7tp2dWNv8vPxNymlXYWi/GxMqvkTzFulXHKxx+BU9LQstYWG9ePSdP/ABUbrNq9oaz5RjVdbsjmMY9TLBM6FZjShHhC3Jvk2y1dTMbzVM0n15C73rW17mm7XEHtBSITDh2QYvilMQabFK+H/Dqnt9xT3Q9IG09I65xH4S36FTG149ejvaowhRcIvlHU2i18G6X2ENixrDHM0A31I7MPsO4esqcYBj2FY0BJhlbFPlF3MBs9vi06j1LzgsopHwyslhe+OVhu17HFrmntBHBV52kH4diaqNcnqSYiRoDOsb8kQkRtIf1STzVObJ9KFZQSNgx5jqynOnwhgAlZ4jg72HxVsUFfSY3SR1uGVEc9O7QPaefYRyPcdVSqUpU+R0ZKXB0Stc95c0Eg8wtpe0sLQRe1rLFsgibkde47FjunB2c2sDdKJCRNLH5niw7Ssp/KWyda3GyVzxMMjb3PakZ5C+fn2IAyhIjZZ5sb8ChYvaZjmZw4aoQAu5z9fNa+tkm93vUta/O6xdK5ri0HQGwWx0bY2lzRYjggDEt3HWBzX0sg2mBe4hgbxRG4zHK/UAXVQdJ22vw2WXA8GlIomEtqpmnz7ubQfojn2+HFlKm6ksIjKWlG7bvpHfM2TCtm5i2AXbLXMNnP7RH2D97ny7TWaELVhTjBYRWcm3uCEIUzgIQhAAhCEACEIQAIQhAAnTZzaDEdnK4VWGzZb23sLtWSjscPv4hNaFxpNYYHonZTaSg2rozUUr91UssJ6Zxu6M/eDyP33CfN9fyeXj1b3XmbCMUrMGxGKvw6YxVER0PEOHNrhzB7PvsvQOyeP0W0uENr6UZJmaTwl1zE+3DvHMHmPSFm16H3e64LEJ6tmPG73PXve3JA/SOPVypGPMrsr9Qlk8jbd6X4qsMDPuOoBm53QljaJm5n6nglQArAwsBcG5ra3WmMuLwHlxHO/BK6NznFwFwTcFacYxSlw3CqquqX2igjL3WGptyHeeA8UJZ2AhfSvtUMIoW4RhsmSuq23kew2MMXD1u1A8CexUqAALDQLrxXEKjFsSqK+rN5qh5e4X0b2NHcBYDwXKtejTVOOCrKWp5BCEJpEEISIAFvjpKmVmeOmmez6bYyR61Ldm9noooGVdfGHzPGZkbhowcrjt9yfq/5HJ4D3rFuesxpz0U1nHc27bo0qkNdSWM9ir3scx2WRjmO7HNIKRTKeGKdhZMwPb2FRfE6P4FUhgN2PF2E8T2+pWLPqMLh6GsSK9702dstaeYnKhCFpGYCEIQAIQhAAnnZHaGfZrGY62LM+B1mVMIPnY/xHEf+ymZC40pLDBbHqKGpp6yiiq6J7JIpmB8b2fOaeazh1vvNezMqt6GtobPlwKrfo0OmpSez57P6h4uVpS+Wtu9bcVkVabpy0lqMtSyJNcP8ncC3zULKJwiblk0PFKlkhBKGDIQbjRVd0z4qYYqPBIni8v6RUAfRBswHxNz/AChWiIQ8B5JudV5123xQ4vtXiNXmJYJTFH2BrOqLeNifSrNrDVPPkLqPCGNCELTK4IQhAAunC4W1GJUsT7Fr5WhwPMX1C5lnTzOp6iKdgu6J7XgdpBuozTcWlySg0pJvgtZc9f8AI5PAe9Z008dTTxzwuzRyNDmnuWFf8jk8B714LDTwz36aayhkTJtewfkjfDR8MrXMPZc2+9PajO21Y1lLFRNPXldncOxo4es+4q9Yxk7iGnzKd9KKt56vIZ6SpbO2x0eOIXQmfD6aqra6Clw+J8tVM8MijZxc4q89nuimipqFtTtTVGSbKHSQwybuKPtBdxPjcL1cq0YL3jxzpvOxUiFbtTszsPWVHwXC3Usjg3hT1xe6/wBoqHbV7FT4NE6sopHVFE3V4cOvEO024jv0t7VyFxCTxwccGiJoQhPIAhCEAdOF182FYlTYhTedppBI0fStxHgRcelelqCqhno4KyB28gqY2yRuHNpFx715gV4dEOIflHZQUkriX0ErogeeU9ZvvI9Cp3kMxUhtJ74JqWGc526DhqhDnGA5G6jjqhZ484car3YbhddVh1hTQSSD+VpIXmcXsLm55ntXoTpGnEGwmKdYBzomxkc+s5rT7158WhZr3WxFXkEIQrgoEIQgAQhdNDQVWISZKSEyEcTwDfEqMpRgtUnhEoxlJ6YrLOzBcdqMJuwN31OTcxE2se0H7k9S7aYLUUr2PlmglP8A+ckLrjXtFx7VhSbG3aDW1ZB5thbw9J/BbK7Y7CNw6RzJnPbbrGS3uXnrup06rPVvn0/k9FZU+o0oacLHr/Aw1+1tNGwtoY3TSHg54ytH3n2eKiNTPLVTvnneXyPN3OKmFRsjQvB3E08TuVyHD1Wv7UyYjs3X0bS+MCpiGpdGOsPFv4XVmyq2cNqbw35ib2leT3qLKXkWZ/8AH3Aon/lDH5mB0jH/AASnJ+boHPPpu0eg9qhfSXtnV7U43UQsmc3CaeQsp4Gnqvsbbxw5k2uOwW772n0EfqDKe2sm9zV55j823wCuwWqpJvsZfYUdVwc3RwNwRoQVcvRXtNPjVHUYVij9/UUzAWSSamWI6Wd2kHS/MEKm1Ouhv9bZv4GT/XGpVknBnEcG0VK3CNpK7C+DI5M0JJ4scA5o9ANvQuROPS0LbaSkaE08R09KYaKr3lo5T1+R7U6lPMVkVOHdHahCE0WCsToWrnQ4viNGHWE9O2QDvY639artS/onn3O3FGCQBLHLGb/VLv6Uqus02Sh4kXvE0StzPFzeyVYTXc+7LkW5IWQWiJdKzXf2HxCQfFL4f91qohegOkhu+2IxSHLfJG19/qvafuXn9aVn4H8yvV8QIQhWhYIQt1DSvrayKmi0dI61+wcz6BdclJRTb4R2MXJpLljls9gb8Vl3kt2UrD1nDi89g/FTyngipoWw08bY428GtCSkpoqSmjp4G5Y4xYBbV429vZ3M/wAvZHs7Gyhaw/M+WC0V/wAjk8B71vWiv+RyeA96pLkvMZF14dh82ISObEWtDRdzncAuRSLZL4tV4s+9LuqjpUnKPImpJxi2iSbLGLAsLkoyzM6SV0hdGLAkgD16KpW9E9cGgflam0H7F34q1kKnT67fU1iMvojJna0pycpLdlRy9GNZE/KcUpz/ANF34p+2H2Vm2ZxmSvnq46hrqd0QYxhadXNN9fqqWVcsbqkta9pdYaArUr661eyh70vov2D2GiuxEduNkqnaHGZMSpKmGMmFrBFIDqRfmOHHsVXzRSU88kMrSyWJ5Y9p+a4GxHrV/Kk9rP1nxT+Ictvot/WuJyp1HnCKV7bwpRTiY0VXvLRynr8j2rtUfTnRVe8tHKevyPavSRkZUo90dqkvRsC7bnCQ36cn+09RpS3oqjz7b0T7X3Mcrz9gt/qXKvgl8iEeUXyxwhGV/HjohJk3/Xvl5W4oWMWzjxvDm4ngddSkEuqaZ7PS5pC8ytN2gkWuOC9Ruc4PIBIAK877a4YcI2qxKjy2jExkj7Mj+sLeF7ehXrOXMRNVcMZUIQrwkFJthqYPq6ipcPNsDG+LuPu9qjKecD2ipcCpJW1NPUSmSTNmiDSALAa3I71S6hGpK2lGmstl3p0qcbmMqjwkT9CiH5w8L/udd9ln/JH5w8L/ALnXfZZ/yXl/YLn4Geq9vtvjRL1or/kcngPeov8AnDwv+5132Wf8lqqdvsMmgdG2lrQXcy1lv9SFYXPwMPb7b40OSkWyXxarxZ96rz+11B+xqfst/FTPo8xenxVleadkrd0Yw7eADjm7D3Kp1K1rU7WUpRwtv9oXK6o1FpjLLJgtNZm3By+nwW5C8xF4aYoiVdn/ACg3d/H0snZcbf8A7V3+GuxasnwW68sxgvJAqT2s/WfFP4hyuxUntZ+s+KfxDlv/AGd/zz+X/TG6j4I/MakIQvWmQOdFV7y0cp6/I9qtLoToBPjmIVjmnLBTCMHve6/9Cppeg+hahmpdjG101xJXzukBtY7tvVb7Q4+lLrzxTaIqHvZLCe4wnKzhx1QsoQHsu8Am/NCzRorXtawNJsQLWVU9M2CPDKPGo49G/o857uLD68w9IVpGJzznBFjquXGqKmxzCqrDKlrt3UxlhP0TxDh3g2I8EylPRNSIyWVg8yoXTidBUYXiFRQVjctRTyFjwOBPaO4ixHcQuZbHJVBIQHAgi4PEJUIAaaykMJzs1jPsXKn8gOBBFweITTWUhhOZmsZ9ihKI2Ms7M5kIQoDAVndC5G7xgX1zQm321WK7sHxjEMEqjU4ZUmGQjK7QODh2EHQqj1O0ld2k6MHhvH0aY2hUVOopM9FIVKfnI2l/b0v+XH4o/ORtL+3pf8uPxXjv7YvfOP6v9jT9vpepbNXGxtS5zWgEgXIC1Kp5OkDaGR2Z01Nf/AH4rD+3u0H7am/7AVuP2fu1FJtfq/2O/wBQpepbapLatwdtNihaQR8JcNO7Qpwk272gexzRUwsuLZmQC48LqOOc5zi57i5zjckm5J7StjpPTKtpOU6jW6xsVLu5hWSUREIQtwonVhWHz4tidLh1ILz1UrYmacCTa57hxPcF6zwehhwjD6ehhBZBTxMijvxytFgqh6CNmSZptqKyPyceaCjuNS46PePD4oPe9XM7y/xNLdqpXM8y0rsSQkrTI7MwXFrIWTXCAZH3J46IVY6Jviw5ABYaXSmIRDOCTbksmxsc0OcNSLnVamSOe4Ncbg8QgCvelbZh2KUv5boIb1dLHadjBrLEOfi3X0X7AqdXqeVoibmjFiTZUt0j7FOwqSTGMLivh0jrzRtHydx5/UPsPdZXrWt+CQmpDuiBIQhXhIJCA4EEXB4hKhADRWUhhOZmsZ9i5k/kBwIIuDxCaqykMJzs1jPsUJRGxlnZnKhCFAYCEIQAIQhAAhCEACetj9m6rarHIcOpbtZ8eomA0hjHE+PId5C4MIwutxnEYMPw2B09VO6zGD2knkBzK9KbCbKUuyOFCigIlqZnB1XUZbGV3Cw7GjgB4niSlVquhep1IfMLo6agw+nwyiiENLTxiONoN7Ae8966j+j8Nc3aspGNibmYLFYxeWvvNbcFnEhQzf8AXJty0QsZHGJ2WM2FroQBi7PnOXNa+lluky5DktflZI2RrWhpOoFjotbI3RuDnCwHFACw3zHeXtb5ySqY2RpZlD2OaQ5trgg8iFnI4TNDY9SDdEZEIIk0JQBTm3XR1Nh+8xLAY3S0erpaQavg72jiW93Ed44V2CCLjUL1K9jpHl7NQeBUK2v6PMMxxz6rDntocRdq4hvkpT+8BwP7w9N1do3WNpiZU+6KQQnPHdn8VwCfdYrSPhubMkGsb/quGh8OPcmxXk01lCQSEBwIIuDxCVC6A01lIYTnZrGfYuVP5AcCCLg8QmqspDCc7NYz7FCURsZZ2ZyoQhQGAhCGgue1jGlz3ENa1ouXE8ABzQAJz2dwDEtpMRbQYTTmWU6veTZkTfpPdyHtPIFTTY/olxXFslVj5kwqhOuQt8vIO5p+J/Nr3K7MFwHDcEoGUWCUkcFO3V2X4z3fScTq495SKldR2W7OpDPsTsVRbIURZTXnrZQN/Vlti/8Adb2NHZ61LTkyG2XNb03SMe2NoY82I4rWI3B2cjqg39CottvLJBFmz9e+X97gs5uW79OVLI9srcrDcrGLyN95pfguAZQ2y+Ute/zkLCRpldmZqLWQgBdyX9e4F9bJd7vRkAtfmtkfmm+C5ofOtQBsDdx1jrfRBG/1GlllVebHikpfiu8UAAk3IyEXtzSbo33l9ONlhP51y6D5r+VAHPUNhroXU08LJI3izmSNDmkd4Kg+O9FuC1V5KCSXD5XcBH147/VPD0EKcU/nQtlVwb4qcKkoeFnHFPko7EejDaOmzPo2U9fGDpuZA13pDrD1EqNVmA4xQvLKvCq2IjiTA63rAsvS9L5s+K0ym0jvFWI3k1yhbpLseXHPa1xa5wDhxBNiFi58ZaQ5zCD2lerJ42SRHeMa7T5wuuWmp4BJpDFw+gEz21fD9Tn3XqeUHYXUzOBoKeapY42AhjLyD6E8YV0ebW4oWmDBKmJh+fVWhA9DrH1BenqrTLbvWdP5v0pUrpvhDFHzKRwToUqHPDsfxVkTb6w0TczvtuFh9kqztndi8C2XAlwygibMBYzydeU/zHUeAsE8O86frLpn805JlVnLlncGsu3/AFRpbVAO46p1vqkpfjnwRVfGHglnRTGZeuDa/JLvQfJ249W6zg801czfOj633oA2hhh65N7ckH9I4aZVnUeaKwpeLvQgAD9x1CL80qwqfOehCAP/2Q==" alt="Login Logo" className="login-logo" height={60}/>
            <form onSubmit={submit}>
              <label>Email</label>
              <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <label>Password</label>
              <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <label>Category</label>
              <select className='dik' value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select</option>
                <option value="Student">Student</option>
                <option value="admin">admin</option>
                <option value="Faculty">Faculty</option>
              </select>

              <button type="submit" disabled={!email || !password}>
                Login
              </button>

              <div className="mt-3 text-center">
                <p className="small text-muted">
                  Don't have an account? <Link to="/registration">Register here</Link>
                </p>
                <p className="small text-muted">
                  Forgot your password? <Link to="/ForgotPassword">Reset it here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
